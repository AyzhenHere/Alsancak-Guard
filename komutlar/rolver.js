const Discord = require('discord.js');
exports.run = (client, message, args) => {
 if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply('Bunun için gerekli iznin yok');
  let user = message.mentions.members.first() 
  let rol = message.mentions.roles.first() 
  if (!user) return message.reply('__**Kime Rol Verceğimi Yazmadın!**__')
  if (!rol) return message.reply('__**Verilecek rolüyazmadın**__');
  user.addRole(rol);
 message.channel.send('__**Başarılı Rol Verildi**__')
 };

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['rol'],
  permLevel: 2
};

exports.help = {
  name: 'rolver',
  description: 'İstediğiniz kişiyi istediğiniz rolü verir.',
  usage: 'rol-ver [kullanıcı] [@rol]'
};