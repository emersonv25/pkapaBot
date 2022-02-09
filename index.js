const Discord = require("discord.js");
const config = require("./config.json");
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
  if (!message.content.toLowerCase().startsWith(config.prefix.toLocaleLowerCase())) return;
  if(message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

  let args = message.content.trim().slice(config.prefix.length).split(/ +/g);

  let command = args.shift().toLowerCase();

  if(command == "p"){command = "play"}
  if(command == "j" || command == "entrar") {command = "join"}
  if(command == "exit" || command == "l") {command = "leave"}
  
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

  let message = interaction.message;
  let member = interaction.member;
  let user = interaction.user;

  let customId = interaction.customId

  try {
    const interactionFile = require(`./interactions/${customId}.js`)
    interactionFile.run(client, interaction);
  }
  catch(err){
    console.error("Erro:" + err.message);
  }

})

client.login(config.token);