const Discord = require("discord.js");
const db = require("quick.db");
const a = require("../ayarlar.json");
// Ekibi
exports.run = async (client, message, args, params) => {
  
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(
      new Discord.RichEmbed()
        .setTitle(`UYARI`)
        .setDescription(
          "**Bu Komutu Kullanmak için `YÖNETİCİ` Yetkisine Sahip Olmalısın!**"
        )
        .setColor("RED")
        .setFooter(message.author.tag)
        .setThumbnail(message.author.avatarURL)
        .setTimestamp()
    );

  if (!args[0]) //Wiz Ekibi
    message.channel.send(
      new Discord.RichEmbed()
        .setTitle(`UYARI`)
        .setDescription("**Yanlış Komut Kullanımı!**")
        .setFooter(message.guild.name)
        .setThumbnail(message.guild.iconURL)
        .setTimestamp()
        .addField(
          `Doğru Kullanım`,
          `\`${a.prefix}ban-koruma aç\` **veya** \`${a.prefix}ban-koruma kapat\``
        )
        .setColor("RED")
    );

  let rol = await db.fetch(`bank_${message.guild.id}`);
  if (args[0] == "aç") {
    if (rol) {
      const embed = new Discord.RichEmbed()
        .setColor("RED")
        .setTitle(`UYARI`)
        .setDescription("**__Ban Koruma Sistemi__ Zaten Aktif!**")
        .setTimestamp()
        .setFooter(message.guild.name)
        .setThumbnail(message.guild.iconURL);
      message.channel.send(embed);
      return;
    } else {
      db.set(`bank_${message.guild.id}`, "acik");
      const embed = new Discord.RichEmbed()
        .setColor("GREEN")
        .setTitle(`BAŞARILI`)
        .setDescription(
          "**__Ban Koruma Sistemi__ Başarıyla Aktif Edildi!\n \n▪ Kapatmak için: `!rol-koruma kapat`**"
        )
        .setFooter(message.guild.name)
        .setTimestamp()
        .setThumbnail(message.guild.iconURL);
//Wiz Ekibi
      message.channel.send(embed);
    }
  } else if (args[0] == "kapat") {
    await db.delete(`bank_${message.guild.id}`);
    const embed = new Discord.RichEmbed()
      .setColor("#FF0000")
      .setTitle(`BAŞARILI`)
      .setDescription(
        "**__Ban Koruma Sistemi__ Başarıyla Kapatıldı!\n \n▪ Açmak için: `!ban-koruma aç`**"
      )
      .setTimestamp()
      .setFooter(message.guild.name)
      .setThumbnail(message.guild.iconURL);
    message.channel.send(embed);
  }

};

exports.conf = {
  enabled: true,
  aliases: ["bk"],
  permLevel: 0
};
//Wiz Ekibi
exports.help = {
  name: "bankoruma",
  description: "Ban Koruma Sistemi!",
  usage: "ban-koruma"
};