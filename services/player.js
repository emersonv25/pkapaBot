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
let msgPlayer = []
let playing = false

module.exports = {
    name: "player",
    author: "emersonv25",

    async run(client, message, url) {
         if(url){
            queueService.add(message.guildId, url)
        }

        if(playing)
        {
            message.channel.send("Adicionado a fila de reprodução").then(msg => {setTimeout(() => msg.delete(), 5000)})
        }
        else if(queueService.finishedQueue(message.guildId, url))
        {
            this.disableMsgPlayer(message.guildId)
            message.channel.send("Lista de reprodução vazia !")
        }
        else{
            try {
                const connection = joinVoiceChannel({
                    channelId: message.member.voice.channelId,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator
                })
                let urlQueue = queueService.get(message.guildId)
                let yt_info = await play.video_info(urlQueue)
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
                    if(queueService.finishedQueue(message.guildId))
                    {
                        playing = false
                        if(typeof msgPlayer.find(i => i.guildId == message.guildId) != 'undefined'){
                            this.disableMsgPlayer(message.guildId)
                            message.channel.send("Fila finalizada !")
                       }
                    }
                    else{
                        queueService.next(message.guildId)
                        playing = false
                        this.run(client, message)
                    }
                })
            }
            catch (ex) {
                queueService.remove(message.guildId)
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
        let messagePlayer = msgPlayer.find(i => i.guildId == message.guildId)
        if(typeof messagePlayer == 'undefined'){
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
    getMsgPlayer(guildId){  
        let msg = msgPlayer.find(i => i.guildId == guildId).message
        if(typeof msg == 'undefined')
        {
            return false
        }
        else if (Object.keys(msg) == 0)
        {
            return false
        }
        return  msg
    },
    async disableMsgPlayer(guildId){
        let msg = this.getMsgPlayer(guildId)
        if(msg){
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
    async deleteMsgPlayer(guildId){
        let msg = this.getMsgPlayer(guildId)
        if(msg)
        {
            await msg.delete()
        }   
    }

}