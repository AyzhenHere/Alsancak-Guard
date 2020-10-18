const Discord = require('discord.js');
const db = require('quick.db')
const config = require('../config.json')

exports.run = async (client, message, args) => {
let prefix = await require('quick.db').fetch(`prefix_${message.guild.id}`) || config.prefix
 if (!message.member.hasPermission('ADMINISTRATOR')) { 
const uyarı = new Discord.RichEmbed()    
      .setColor("#FF0000")
.setDescription(`Bu komutu kullanma izniniz bulunmamaktadır. \nBu komutu yalnızca **Yöneticiler** kullanabilir.`)       
.setFooter(`Aquarius Discord Bot © 2020 | aquabot.pw`, client.user.displayAvatarURL);
return message.channel.send(uyarı).then(msg => { msg.delete(20000); }); 
  };
  let aktif = await db.fetch(`bottemizle_${message.guild.id}`)
  if (aktif) {
    db.delete(`bottemizle_${message.guild.id}`)
    message.channel.send(`:no_entry: Koruma sistemi devre dışı bırakıldı !`)
  }else {
        if (!aktif) {

            return message.channel.send(`:warning: Bot koruması zaten kapalı.\nBot Korumasını açmak için: \`a!bot-koruma-ac\``)

        }
    }

};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['bot-koruma']
};

exports.help = {
  name: 'bot-koruma-kapat',
  description: 'Sunucuya bot eklendiğinde atılmasını sağlayan sistemi başarıyla aktifleştirirsiniz/kapatırsınız.',
  usage: 'bot-koruma-kapat'
};