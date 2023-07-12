const Discord = require("discord.js");
require('dotenv').config()
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

const token = process.env.TOKEN
const prefix = process.env.PREFIX

const client = new Discord.Client({
  intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_VOICE_STATES
  ] 
})

client.once("ready", async () => {
  console.log("PkapaBot iniciado !")
})

client.on("messageCreate", message => {
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;
  if (!message.content.toLowerCase().startsWith(prefix.toLocaleLowerCase())) return;
  if(message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;
  let args = message.content.trim().slice(prefix.length).split(/ +/g);
  let command = args.shift().toLowerCase();

  if(command == "p" || command == "tocar"){command = "play"}
  if(command == "j" || command == "entrar") {command = "join"}
  if(command == "exit" || command == "l" || command == "quit") {command = "leave"}
  if(command == "skip" || command == "n" || command == "s") {command = "next"}
  if(command == "r" || command == "resumir" || command == "despausar") { command = "resume"}
  if(command == "pausar") { command = "pause"}
  if(command == "voltar" || command == "anterior") { command = "back"}
  if( command == "perguntar" || command == "conversar" || command == "a" || command == "speak") { command = "ask" }
  if(command == "imagem" || command == "imagens" || command == "img") { command = "image"}
  try {
    const commandFile = require(`./commands/${command}.js`)
    commandFile.run(client, message, args);
  }
  catch(err){
    console.error("Erro:" + err.message);
    message.channel.send("OPS, não conheço este comando !")
  }
})

client.on('interactionCreate', async interaction => {
  if (!interaction.isMessageComponent()) return

  let customId = interaction.customId

  try {
    const interactionFile = require(`./interactions/${customId}.js`)
    interactionFile.run(client, interaction);
  }
  catch(err){
    console.error("Erro:" + err.message);
  }

})

client.login(token);