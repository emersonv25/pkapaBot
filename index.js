const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client({
  intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES
  ] 
})

client.once("ready", async () => {
  console.log("PkapaBot está na área")
})

client.on("messageCreate", message => {
  if (message.author.bot) return;
  if (message.channel.type == "dm") return;
  if (!message.content.toLowerCase().startsWith(config.prefix.toLocaleLowerCase())) return;
  if(message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;

  const args = message.content.trim().slice(config.prefix.length).split(/ +/g);

  const command = args.shift().toLowerCase();

  try {
    const commandFile = require(`./commands/${command}.js`)
    commandFile.run(client, message, args);
  }
  catch(err){
    console.error("Erro:" + err);
  }
})

client.login(config.token);