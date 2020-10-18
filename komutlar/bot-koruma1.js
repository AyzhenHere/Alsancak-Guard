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
  
  if (!aktif) {
    db.set(`bottemizle_${message.guild.id}`, 'aktif')
    message.channel.send(`:white_check_mark: Koruma sistemi aktif edildi !`)
  }else {
        if (aktif) {

            return message.channel.send(`:warning: Bot koruması zaten Açık.\nBot korumasını kapatmak için: \`a!bot-koruma-kapat\``)

        }
    }
};


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['bot-koruma-ac']
};

exports.help = {
  name: 'bot-koruma-ac',
  description: 'Sunucuya bot eklendiğinde atılmasını sağlayan sistemi başarıyla aktifleştirirsiniz/kapatırsınız.',
  usage: 'bot-koruma-ac'
};