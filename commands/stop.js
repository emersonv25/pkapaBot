const { getVoiceConnection } = require("@discordjs/voice")
const queueService = require('../services/queue.js')
module.exports = {
    async run(client, message, args) {
        try
        {
            const voicePlayer = getVoiceConnection(message.guild.id);
            let voiceChannel = message.member.voice.channel;
            if (!voiceChannel) return message.channel.send('Você precisa estar conectada em um canal de voz !');
            if(!voicePlayer) return message.channel.send("Não estou tocando nada !")
            const player = voicePlayer.state.subscription.player
            queueService.clear(message.guildId)
            player.stop();
            return
        }
        catch(ex)
        {
            console.log(ex.message)
            message.channel.send("OPS, erro: " + ex.message)
        }

    }
}