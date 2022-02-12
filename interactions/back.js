module.exports = {
    run: async (client, interaction) => {
        try {
            const commandFile = require(`../commands/back.js`)
            commandFile.run(client, interaction);
            interaction.deferUpdate()
            return
        }
        catch (ex) {
            console.log(ex.message)
            interaction.channel.send("OPS, erro: " + ex.message)
        }

    }

}