const Discord = require('discord.js');
const db = require('quick.db')
const ayarlar = require('../ayarlar.json')

var prefix = ayarlar.prefix;

exports.run = async(yashinu, message, args) => {
  if(message.author.id !== message.guild.owner.user.id) return message.reply('⚠ Bu Komutu Kullana Bilmek için Sunucu Sahibi Olmalısın!')
  if(args[0] === "0" || args[0] === "sıfırla") {
    await db.delete(`banlimit_${message.guild.id}`)
    message.reply('✅  Ban Koruma Özelliği Başarıyla Devre Dışı Bırakıldı!')
    return
  }
  if(!args[0] || isNaN(args[0])) return message.channel.send(`⚠ Ban Koruma Sistemi Ban Limit Sayısını Belirtmelisin!`);
  await db.set(`banlimit_${message.guild.id}`, args[0])
  message.reply(`✅ Sunucunun Ban Koruma Limiti **${args[0]}** Olarak Ayarlandı!`);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'banlimit'
};