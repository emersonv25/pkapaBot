const { joinVoiceChannel } = require('@discordjs/voice');

module.exports = {
    async run(client, message, args) {
        let voiceChannel = message.member.voice.channel;
 
        if (!voiceChannel) return message.channel.send('Você precisa estar conectada em um canal de voz !');
        let permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('Você não tem as permissões necessárias');
        if (!permissions.has('SPEAK')) return message.channel.send('Você não tem as permissões necessárias');
        
        //message.channel.send("Entrando em: " + voiceChannel.name)
        const connection = joinVoiceChannel({
            channelId: message.member.voice.channelId,
            guildId: message.guild.id, 
            adapterCreator: message.guild.voiceAdapterCreator
        })
    }
}