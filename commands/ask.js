const Discord = require("discord.js")
require('dotenv').config()
const OpenAi = require('openai')

const configuration = new OpenAi.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAi.OpenAIApi(configuration);

module.exports = {
    name: "ask",
    author: "emersonv25",

    async run(client, message, args) {
        try{
            const pergunta = message.content.substring(message.content.indexOf(" ")).trim()
            const resposta = await this.askToOpenAi(pergunta)
            await message.channel.send(resposta);

        }
        catch(e){
            console.log(e.message)
            message.channel.send("Ops, ocorreu um erro: " + e.message)
        }

    },
    async askToOpenAi(text){
        try {
            const prompt = text;
        
            const response = await openai.createCompletion({
              model: "text-davinci-003",
              prompt: `${prompt}`,
              temperature: 0.5, // Higher values means the model will take more risks.
              max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
            });

            return response.data.choices[0].text
        
          } catch (error) {
            console.error(error)
            return 'Erro ao se comunicar com minha IA: ' + error.message;
          }
    }
}





