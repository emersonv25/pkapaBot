const Discord = require("discord.js")
require('dotenv').config()
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    NoSubscriberBehavior,
    VoiceConnectionStatus,
    getVoiceConnection
} = require('@discordjs/voice');
const ytSearch = require('yt-search');
const play = require('play-dl')
const queueService = require('./queue.js')
const spotify = require('./spotify.js')
let msgPlayer = []
let playing = []

module.exports = {
    name: "player",
    author: "emersonv25",

    async run(client, message, url) {
        if (url) {
            try {
                if (url.includes("open.spotify.com/playlist")) {
                    let token = await spotify.getToken(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);
                    let playlist = await spotify.getPlaylist(token, url)
                    for (let i = 0; i < playlist.length; i++) {
                        queueService.add(message.guildId, playlist[i].track.name + ' ' + playlist[i].track.artists[0].name)
                    }
                    message.channel.send("Todos os itens da playlist foram adicionados na fila")
                }
                else if (url.includes("open.spotify.com")) {
                    let token = await spotify.getToken(process.env.SPOTIFY_CLIENT_ID, process.env.SPOTIFY_CLIENT_SECRET);
                    let track = await spotify.getTrack(token, url)
                    queueService.add(message.guildId, track.name + ' ' + track.artists[0].name)
                }
                else {
                    //await play.video_info(url)
                    queueService.add(message.guildId, url)
                }
            }
            catch (e) {
                if (this.getPlaying(message.guildId)) {
                    console.log(e.message)
                    message.channel.send('Não conseguir adicionar a musica na fila: link invalido ou não suportado')
                }
                else {
                    console.log(e.message)
                    message.channel.send('Não conseguir reproduzir a musica: link invalido ou não suportado')
                }
                return
            }
        }

        if (this.getPlaying(message.guildId)) {
            message.channel.send("Adicionado a fila de reprodução")
        }
        else if (queueService.finishedQueue(message.guildId, url)) {
            try {
                this.disableMsgPlayer(message.guildId)
                this.sendMsgEnd(message)
                const voicePlayer = getVoiceConnection(message.guild.id);
                const player = voicePlayer.state.subscription.player
                player.stop();
                voicePlayer.destroy()                
            }
            catch{}

        }
        else {
            try {
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channelId,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator
                })
                let urlQueue = queueService.get(message.guildId)


                if (!this.validURL(urlQueue)) {
                    let video = await this.videoFinder(urlQueue)
                    urlQueue = video.url
                }
                await play.setToken({
                    youtube: {
                        cookie: process.env.YOUTUBE_COOKIES
                    }
                })

                let yt_info = await play.video_info(urlQueue)
                let stream = await play.stream(urlQueue)
                let resource = createAudioResource(stream.stream, { inputType: stream.type });
                let player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
                player.play(resource);
                connection.subscribe(player);

                this.sendMsgPlayer(message, yt_info.video_details.title)

                player.on(AudioPlayerStatus.Playing, () => {
                    this.setPlaying(message.guildId, true)
                })

                player.on(AudioPlayerStatus.Idle, () => {
                    if (queueService.finishedQueue(message.guildId)) {
                        this.setPlaying(message.guildId, false)
                        if (typeof msgPlayer.find(i => i.guildId == message.guildId) != 'undefined') {
                            this.disableMsgPlayer(message.guildId)
                            this.sendMsgEnd(message)
                            player.stop()
                            connection.destroy()
                        }
                    }
                    else {
                        queueService.next(message.guildId)
                        this.setPlaying(message.guildId, false)
                        this.run(client, message)
                    }
                })

                connection.on(VoiceConnectionStatus.Disconnected, () => {
                    queueService.clear(message.guildId)
                    player.stop()
                    this.setPlaying(message.guildId, false)
                    connection.destroy()
                })

                connection.on(VoiceConnectionStatus.Destroyed, () => {
                    queueService.clear(message.guildId)
                    player.stop()
                    this.setPlaying(message.guildId, false)
                })
            }
            catch (ex) {
                queueService.remove(message.guildId)
                console.log('Erro ao reproduzir: ' + url + ' Exception: ' + ex.message)
                message.channel.send("Ops, algo errado não está certo, não conseguir reproduzir a musica. Erro: " + ex.message)
                this.run(client, message)
            }
        }
        return

    },
    async videoFinder(query) {
        const videoResult = await ytSearch(query);
        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
    },
    async sendMsgPlayer(message, titulo) {
        let messagePlayer = msgPlayer.find(i => i.guildId == message.guildId)
        if (typeof messagePlayer == 'undefined') {
            msgPlayer.push({
                guildId: message.guildId,
                message: {}
            })
            messagePlayer = msgPlayer.find(i => i.guildId == message.guildId)
        }

        this.deleteMsgPlayer(message.guildId);

        let player = new Discord.MessageEmbed().setColor("BLUE").setDescription(titulo).setTitle("Radinho do PKAPA")
        let buttons = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton().setCustomId('stop').setEmoji('⏹').setStyle('SECONDARY'),
                new Discord.MessageButton().setCustomId('back').setEmoji('⏮️').setStyle('SECONDARY'),
                new Discord.MessageButton().setCustomId('pause').setEmoji('⏸️').setStyle('SECONDARY'),
                new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY')
            ]);
        messagePlayer.message = await message.channel.send({ embeds: [player], components: [buttons] })
    },
    getMsgPlayer(guildId) {
        let msg = msgPlayer.find(i => i.guildId == guildId)
        if (typeof msg == 'undefined' || typeof msg.message == 'undefined') {
            return false
        }
        else if (Object.keys(msg.message) == 0) {
            return false
        }
        return msg.message
    },
    async disableMsgPlayer(guildId) {
        let msg = this.getMsgPlayer(guildId)
        if (msg) {
            let buttonUpdate = new Discord.MessageActionRow()
                .addComponents([
                    new Discord.MessageButton().setCustomId('stop').setEmoji('⏹').setStyle('SECONDARY').setDisabled(true),
                    new Discord.MessageButton().setCustomId('back').setEmoji('⏮️').setStyle('SECONDARY').setDisabled(true),
                    new Discord.MessageButton().setCustomId('resume').setEmoji('▶️').setStyle('SECONDARY').setDisabled(true),
                    new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY').setDisabled(true)
                ]);
            await msg.edit({ components: [buttonUpdate] });
        }

    },
    async deleteMsgPlayer(guildId) {
        let msg = this.getMsgPlayer(guildId)
        if (msg) {
            await msg.delete()
        }
    },
    getPlaying(guildId) {
        let p = playing.find(i => i.guildId == guildId)

        if (typeof p == 'undefined') {
            playing.push({ guildId: guildId, flPlay: false })
            return false
        }
        return p.flPlay
    },
    setPlaying(guildId, flag) {
        let playObj = playing.find(i => i.guildId == guildId)
        if (typeof playObj == 'undefined') {
            playing.push({ guildId: guildId, flPlay: flag })
        }
        else {
            playObj.flPlay = flag
        }

    },
    sendMsgEnd(message) {
        let embed = new Discord.MessageEmbed().setColor("GREEN").setDescription('Ajude o PkapaBot a sobreviver').setTitle("Fila Finalizada")
        let buttons = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton().setLabel('❖ PIX').setStyle('LINK').setURL('https://nubank.com.br/pagar/1n0dvz/sMiK1M5nAO'),
            ]);

        message.channel.send({ embeds: [embed], components: [buttons] })
    },
    validURL(url) {
        var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
        if (!regex.test(url)) {
            return false;
        } else {
            return true;
        }
    }
}