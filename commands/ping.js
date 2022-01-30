const Discord = require("discord.js")

module.exports = {
    name: "ping",
    author: "ferinha",

    run: async(client, message, args) => {
        let cor_embed = "GREEN"
        let ping = client.ws.ping

        let embed1 = new Discord.MessageEmbed().setColor(cor_embed).setDescription("Calculando ping.")

        let embed2 = new Discord.MessageEmbed().setColor(cor_embed).setDescription("O meu ping é: " + ping + "ms")

        let comando = await message.reply({content: `${message.author}`, embeds: [embed1]}).then(msg => {
            setTimeout(() => {
                msg.edit({content: `${message.author}`, embeds: [embed2]})
            }, 2000);
        })

        //let cmd2 = await message.channel.send("poong")

    }
}