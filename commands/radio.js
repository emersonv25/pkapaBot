const Discord = require("discord.js")

module.exports = {
    name: "play",
    author: "emersonv25",

    run: async(client, message, args) => {

        let loading = new Discord.MessageEmbed().setColor("BLUE").setDescription("Carregando Musica").setTitle("Loading...")
        
        let player = new Discord.MessageEmbed().setColor("BLUE").setDescription("Radinho do PKAPA: Em Desenvolvimento !").setTitle("Em desenvolvimento...")
        
        let buttons = new Discord.MessageActionRow()
          .addComponents([
            new Discord.MessageButton().setCustomId('back').setEmoji('⏮️').setStyle('SECONDARY'),
            new Discord.MessageButton().setCustomId('pause').setEmoji('⏸️').setStyle('SECONDARY'),
            new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY')
          ]);

        let msg = await message.reply({content: `${message.author}`, embeds: [loading]}).then(msg => {
            setTimeout(() => {
                msg.edit({content: `${message.author}`, embeds: [player], components: [buttons]})
            }, 1000);
        })

        //let cmd2 = await message.channel.send("poong")

    }
}