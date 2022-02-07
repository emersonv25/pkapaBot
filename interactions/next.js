module.exports = {
    run: async (client, interaction) => {
        try {
            //const commandFile = require(`../commands/next.js`)
            //commandFile.run(client, interaction);
            interaction.channel.send("Em desenvolvimento !")
            return
        }
        catch (ex) {
            console.log(ex.message)
            interaction.channel.send("OPS, erro: " + ex.message)
        }

    }

}