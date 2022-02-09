const { getVoiceConnection } = require('@discordjs/voice')

module.exports = {
    async run(client, message, args) {
        const connection = getVoiceConnection(message.guild.id)

        if(!connection) return message.channel.send("Eu não estou em nenhum canal!")

        message.channel.send("Saindo...").then(msg => {setTimeout(() => msg.delete(), 5000)})
        connection.destroy()
        
    }
}