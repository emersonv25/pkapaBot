const playerService = require('../services/player');
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
          playerService.run(client, message, args[0])
          return
        }
        else if (args.length == 0)
        {
          //playerService.run(client, message);
          message.channel.send("Digite o nome ou o link da musica")
        }
        else
        {
            const video = await playerService.videoFinder(args.join(' '))
            if(video){
              playerService.run(client, message, video.url);
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

}