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
              temperature: 0, // Higher values means the model will take more risks.
              max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
              top_p: 1, // alternative to sampling with temperature, called nucleus sampling
              frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
              presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
            });

            return response.data.choices[0].text
        
          } catch (error) {
            console.error(error)
            return 'Erro ao se comunicar com minha IA: ' + error.message;
          }
    }
}





