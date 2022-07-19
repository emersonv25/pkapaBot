const Discord = require("discord.js")
require('dotenv').config()

module.exports = {
    name: "talk",
    author: "emersonv25",

    async run(client, message, args) {
        try{
            if (message.author.id === "202193332330299392") {
                let conteudo = message.content
                conteudo = conteudo.substring(conteudo.indexOf(" "))
                await message.channel.send(conteudo)
                await message.delete()
            }
            else{
                await message.channel.send('Apenas o meu mestre Pkapa pode utilizar este comando');
            }

        }
        catch(e){
            console.log(e.message)
            message.channel.send("Ops, ocorreu um erro: " + e.message)
        }

    }

}