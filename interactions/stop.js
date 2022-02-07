module.exports = {
    run: async (client, interaction) => {
        try {
            const commandFile = require(`../commands/stop.js`)
            commandFile.run(client, interaction);
            return
        }
        catch (ex) {
            console.log(ex.message)
            interaction.channel.send("OPS, erro: " + ex.message)
        }

    }

}