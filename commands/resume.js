const { getVoiceConnection } = require("@discordjs/voice")
const Discord = require("discord.js")
const playerService = require('../helpers/player');
module.exports = {
    async run(client, message, args) {
        try
        {
            const voicePlayer = getVoiceConnection(message.guild.id);
            let voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.channel.send('Você precisa estar conectada em um canal de voz !');
            if(!voicePlayer) return message.channel.send("Não estou tocando nada !")
            
            const player = voicePlayer.state.subscription.player
            player.unpause();
            this.updateMsgPlayer(message, args)
            return
        }
        catch(ex)
        {
            console.log(ex.message)
            message.channel.send("OPS, erro: " + ex.message)
        }

    },
    async updateMsgPlayer(message, flInteraction)
    {
        let buttonUpdate = new Discord.MessageActionRow()
        .addComponents([
            new Discord.MessageButton().setCustomId('stop').setEmoji('⏹').setStyle('SECONDARY'),
            new Discord.MessageButton().setCustomId('pause').setEmoji('⏸️').setStyle('SECONDARY'),
            new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY')
        ]);
        let msgPlayer = playerService.getMsgPlayer()
        await msgPlayer.edit({ components: [buttonUpdate] });
        message.channel.send("Resumido !").then(msg => {setTimeout(() => msg.delete(), 5000)})
        if(flInteraction){try{message.deferUpdate()} catch{}}
    }
}