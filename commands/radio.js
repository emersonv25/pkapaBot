const Discord = require("discord.js")
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource
} = require('@discordjs/voice');
const join = require('./join.js');
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');

module.exports = {
    name: "play",
    author: "emersonv25",

    async run(client, message, args) {
        //if (!args.length) return message.channel.send('Please provide a valid query!');
        /*
        let loading = new Discord.MessageEmbed().setColor("BLUE").setDescription("Carregando Musica").setTitle("Loading...") 
        
        let player = new Discord.MessageEmbed().setColor("BLUE").setDescription("Radinho do PKAPA: Em Desenvolvimento !").setTitle("Em desenvolvimento...")
        
        let buttons = new Discord.MessageActionRow()
          .addComponents([
            new Discord.MessageButton().setCustomId('back').setEmoji('⏮️').setStyle('SECONDARY'),
            new Discord.MessageButton().setCustomId('pause').setEmoji('⏸️').setStyle('SECONDARY'),
            new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY')
          ]);

        let msg = await message.reply({ embeds: [loading]}).then(msg => {
            setTimeout(() => {
                msg.edit({embeds: [player], components: [buttons]})
            }, 1000);
        })
        */
        if(this.validURL(args[0])){
 
          //const  connection = await join.run(client, message).catch(console.error);
          const connection = joinVoiceChannel({
              channelId: message.member.voice.channelId,
              guildId: message.guild.id, 
              adapterCreator: message.guild.voiceAdapterCreator
          })
          const stream  = ytdl(args[0], {filter: 'audioonly'});

          const player = createAudioPlayer();
          const resource = createAudioResource(stream);

          await player.play(resource);
          connection.subscribe(player);

          return
        }
        else{
          const video = await videoFinder(args.join(' '));
          if(video){
            const connection = joinVoiceChannel({
              channelId: message.member.voice.channelId,
              guildId: message.guild.id, 
              adapterCreator: message.guild.voiceAdapterCreator
            })  
            const stream  = ytdl(video.url, {filter: 'audioonly'});
            const player = createAudioPlayer();
            const resource = createAudioResource(stream);
  
            
            connection.subscribe(player);
            player.play(resource);
            player.on("error", () => console.log("erro"))
            player.on("idle", () => {
              try{
                play.stop()
              }
              catch(e){ }
              try { 
                connection.destroy()
              }
              catch(e) {}
            })
            return
          } 
          else {
            message.channel.send('No video results found');
          }
        }
    },
    validURL (url){
      var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
      if(!regex.test(url)){
          return false;
      } else {
          return true;
      }
    },
    async videoFinde (query){

      const videoResult = await ytSearch(query);
      return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;

  }
    
}