const Discord = require("discord.js")
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior
} = require('@discordjs/voice');
const ytSearch = require('yt-search');
const play = require('play-dl')
module.exports = {
    name: "play",
    author: "emersonv25",

    async run(client, message, args) {
      let voiceChannel = message.member.voice.channel;
      if (!voiceChannel) return message.channel.send('Você precisa estar conectada em um canal de voz !');
      let permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has('CONNECT')) return message.channel.send('Você não tem as permissões necessárias');
      if (!permissions.has('SPEAK')) return message.channel.send('Você não tem as permissões necessárias');
      try{
        if(this.validURL(args[0])){
          //const  connection = await join.run(client, message).catch(console.error);
          const connection = joinVoiceChannel({
              channelId: message.member.voice.channelId,
              guildId: message.guild.id, 
              adapterCreator: message.guild.voiceAdapterCreator
          })
          
            //const stream  = await play.stream(args[0]);        l
            let yt_info = await play.video_info(args[0])
            let stream = await play.stream_from_info(yt_info)
            const resource = createAudioResource(stream.stream, {inputType: stream.type});
            const player = createAudioPlayer({behaviors: { noSubscriber: NoSubscriberBehavior.Play}});
            player.play(resource);
            connection.subscribe(player);
            this.sendMsgPlayer(message, yt_info.video_details.title)
          return
        }
        else{
          const video = await this.videoFinder(args.join(' '));
            if(video){
              const connection = joinVoiceChannel({
                channelId: message.member.voice.channelId,
                guildId: message.guild.id, 
                adapterCreator: message.guild.voiceAdapterCreator
              })  
              
              let yt_info = await play.video_info(video.url)
              let stream = await play.stream_from_info(yt_info)
              const resource = createAudioResource(stream.stream, {inputType: stream.type});
              const player = createAudioPlayer({behaviors: { noSubscriber: NoSubscriberBehavior.Play}});
              player.play(resource);
              connection.subscribe(player);

              this.sendMsgPlayer(message, yt_info.video_details.title)

              return
            } 
            else {
              message.channel.send('Não encontrei nenhum resultado para: ' + args.join(' '));
            }
        }
      }
      catch(ex)
      {
        message.channel.send("Ops, não conseguir reproduzir a musica. Erro: " + ex.message)
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
    async videoFinder (query){

      const videoResult = await ytSearch(query);
      return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
    },
    async sendMsgPlayer(message, titulo)
    {
      let player = new Discord.MessageEmbed().setColor("BLUE").setDescription(titulo).setTitle("Radinho do PKAPA")
      
      let buttons = new Discord.MessageActionRow()
        .addComponents([
          new Discord.MessageButton().setCustomId('stop').setEmoji('⏹').setStyle('DANGER'),
          new Discord.MessageButton().setCustomId('pause').setEmoji('⏸️').setStyle('SECONDARY'),
          new Discord.MessageButton().setCustomId('next').setEmoji('⏭️').setStyle('SECONDARY')
        ]);
      await message.channel.send({ embeds: [player], components: [buttons]})
    }
    
}