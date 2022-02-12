module.exports = {
    run: async (client, interaction) => {
        try {
            const commandFile = require(`../commands/resume.js`)
            commandFile.run(client, interaction, true);
            interaction.deferUpdate()
            return
        }
        catch (ex) {
            console.log(ex.message)
            interaction.channel.send("OPS, erro: " + ex.message)
        }

    }

}