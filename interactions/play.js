const Discord = require("discord.js")

module.exports = {
    run: async(client, interaction) => {

      let buttonUpdate = new Discord.MessageActionRow()
        .addComponents([
          new Discord.MessageButton().setCustomId('back').setEmoji('⏮️').setStyle('SECONDARY'),
          new Discord.MessageButton().setCustomId('pause').setEmoji('⏸️').setStyle('SECONDARY'),
          new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY')
      ]);
      
      await interaction.update({components: [buttonUpdate]});

    }
}