const { getVoiceConnection } = require("@discordjs/voice")
const Discord = require("discord.js")

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
            this.updateMsgPlayer(message)
            message.channel.send("Resumido !")
            return
        }
        catch(ex)
        {
            console.log(ex.message)
            message.channel.send("OPS, erro: " + ex.message)
        }

    },
    async updateMsgPlayer(message)
    {
        let buttonUpdate = new Discord.MessageActionRow()
        .addComponents([
            new Discord.MessageButton().setCustomId('stop').setEmoji('⏹').setStyle('DANGER'),
            new Discord.MessageButton().setCustomId('pause').setEmoji('⏸️').setStyle('SECONDARY'),
            new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY')
        ]);
        await message.update({ components: [buttonUpdate] });
    }
}