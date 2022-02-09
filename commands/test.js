const Discord = require("discord.js")


module.exports = {

    async run(client, message, args) {

        let player = new Discord.MessageEmbed().setColor("BLUE").setDescription("titulo").setTitle("Radinho do PKAPA")

        let buttons = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageButton().setCustomId('stop').setEmoji('⏹').setStyle('SECONDARY'),
                new Discord.MessageButton().setCustomId('pause').setEmoji('⏸️').setStyle('SECONDARY'),
                new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY')
            ]);
        let msgPlayer = await message.channel.send({ embeds: [player], components: [buttons] })

        let buttonUpdate = new Discord.MessageActionRow()
        .addComponents([
            new Discord.MessageButton().setCustomId('stop').setEmoji('⏹').setStyle('SECONDARY'),
            new Discord.MessageButton().setCustomId('resume').setEmoji('▶️').setStyle('SECONDARY'),
            new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY')
        ]);

        await msgPlayer.edit({ components: [buttonUpdate] });
        //let cmd2 = await message.channel.send("poong")

    }
}