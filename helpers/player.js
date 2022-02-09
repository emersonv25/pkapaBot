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

let msgPlayer = {}

module.exports = {
    name: "player",
    author: "emersonv25",

    async run(client, message, url) {
        try {
            const connection = joinVoiceChannel({
                channelId: message.member.voice.channelId,
                guildId: message.guild.id,
                adapterCreator: message.guild.voiceAdapterCreator
            })

            let yt_info = await play.video_info(url)
            let stream = await play.stream_from_info(yt_info)
            const resource = createAudioResource(stream.stream, { inputType: stream.type });
            const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
            player.play(resource);
            connection.subscribe(player);

            this.sendMsgPlayer(message, yt_info.video_details.title)

            player.on(AudioPlayerStatus.Idle, () => {
                //this.disableMsgPlayer(message);
              })

            return
        }
        catch (ex) {
            message.channel.send("Ops, não conseguir reproduzir a musica. Erro: " + ex.message)
        }
    },
    async videoFinder(query) {

        const videoResult = await ytSearch(query);
        return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
    },
    async sendMsgPlayer(message, titulo) {
        let player = new Discord.MessageEmbed().setColor("BLUE").setDescription(titulo).setTitle("Radinho do PKAPA")

        let buttons = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton().setCustomId('stop').setEmoji('⏹').setStyle('SECONDARY'),
                new Discord.MessageButton().setCustomId('pause').setEmoji('⏸️').setStyle('SECONDARY'),
                new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY')
            ]);
        this.msgPlayer = await message.channel.send({ embeds: [player], components: [buttons] })
    },
    getMsgPlayer(){
        return this.msgPlayer
    }

}