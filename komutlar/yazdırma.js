const Discord = require('discord.js');

exports.run = (client, message, args) => {
  const emoji = client.emojis.find("name","danielunlem2")
    if (message.author.id !== "750740742825181195")  return message.channel.send(`Bu komutu Kullanamazsınız ${emoji}`)
  .then(msg => msg.delete(5000));
  
    let mesaj = args.slice(0).join(' ');
    if (mesaj.length < 1) return message.channel.send('Hacklanıyor...')   //Abi Sakin Ol :D :SDFsdfnkmlçsdfsdfşmdfgşmdfşgkmdfşgldfglmdfg
  message.delete()
  
    const embed = new Discord.RichEmbed()
    

    message.channel.send(`${mesaj}`)

};

exports.conf = {
  enabled: true,
  guildOnly: false,
    

  aliases: [''],
  permLevel: 0
};

exports.help = {
  name: 'yaz',
      category: ''
};