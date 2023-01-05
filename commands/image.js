const google = require('googlethis');

module.exports = {
    name: "image",
    author: "emersonv25",
    async run(client, message, args){
        try{
            const search = message.content.substring(message.content.indexOf(" ")).trim();
            const images = await google.image(search, { safe: false });
            await message.channel.send(images[0].url);
        }
        catch(e) {
            console.log(e)
            await message.channel.send("Ops, não conseguir encontrar a imagem");
        }
    }

}

