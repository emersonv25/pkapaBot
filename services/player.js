const Discord = require("discord.js")
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    AudioPlayerStatus,
    NoSubscriberBehavior,
} = require('@discordjs/voice');
const ytSearch = require('yt-search');
const play = require('play-dl')
const queueService = require('./queue.js')
let msgPlayer = {}
let playing = false
module.exports = {
    name: "player",
    author: "emersonv25",

    async run(client, message, url) {
        if(url){
            queueService.add(url)
        }

        if(playing)
        {
            message.channel.send("Adicionado a fila de reprodução")
        }
        else if(queueService.finishedQueue())
        {
            message.channel.send("Lista de reprodução vazia !")
        }
        else{
            try {
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channelId,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator
                })
                let urlQueue = queueService.get()
                let yt_info = await play.video_info(urlQueue)
                //let stream = await play.stream_from_info(yt_info)
                let stream = await play.stream(urlQueue)
                let resource = createAudioResource(stream.stream, { inputType: stream.type });
                let player =  createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
                player.play(resource);
                connection.subscribe(player);
    
                this.sendMsgPlayer(message, yt_info.video_details.title)

                player.on(AudioPlayerStatus.Playing, () => {
                    playing = true;
                })
                
                player.on(AudioPlayerStatus.Idle, () => {
                    if(queueService.finishedQueue())
                    {
                        playing = false
                        if(!Object.keys(msgPlayer)){
                            this.msgPlayer.delete()
                        }
                    }
                    else{
                        queueService.next()
                        playing = false
                        this.run(client, message)
                    }
                })
            }
            catch (ex) {
                queueService.remove()
                message.channel.send("Ops, não conseguir reproduzir a musica. Erro: " + ex.message)
            }
        }
        return

    },
    async videoFinder(query) {

        const videoResult = await ytSearch(query);
        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
    },
    async sendMsgPlayer(message, titulo) {
        if(!Object.keys(msgPlayer)){
            this.msgPlayer.delete()
        }
        let player = new Discord.MessageEmbed().setColor("BLUE").setDescription(titulo).setTitle("Radinho do PKAPA")
        let buttons = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton().setCustomId('stop').setEmoji('⏹').setStyle('SECONDARY'),
                new Discord.MessageButton().setCustomId('back').setEmoji('⏮️').setStyle('SECONDARY'),
                new Discord.MessageButton().setCustomId('pause').setEmoji('⏸️').setStyle('SECONDARY'),
                new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY')
            ]);
        this.msgPlayer = await message.channel.send({ embeds: [player], components: [buttons] })
    },
    getMsgPlayer(){
        return this.msgPlayer
    }

}