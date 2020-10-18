const Discord = require("discord.js");
const db = require("quick.db");
const a = require("../ayarlar.json");

exports.run = async (client, message, args, params) => {
  //Wiz Jack ?
  if (!message.member.hasPermission("ADMINISTRATOR"))
    return message.channel.send(
      new Discord.RichEmbed()
        .setTitle(`UYARI`)
        .setDescription(
          "**Bu Komutu Kullanmak için `YÖNETİCİ` Yetkisine Sahip Olmalısın!**"
        )
        .setColor("#FF0000")
        .setFooter(message.author.tag)
        .setThumbnail(message.author.avatarURL)
        .setTimestamp()
    );

  if (!args[0])
    message.channel.send(
      new Discord.RichEmbed()
        .setTitle(`UYARI`)
      .setColor("#FF0000")
        .setDescription("**Yanlış Komut Kullanımı!**")
        .setFooter(message.guild.name)
        .setThumbnail(message.guild.iconURL)
        .setTimestamp()
        .addField(
          `Doğru Kullanım`,
          `\`${a.prefix}kanal-koruma aç\` **veya** \`${a.prefix}kanal-koruma kapat\``
        )
        .setColor("RED")
    );

  let rol = await db.fetch(`kanalk_${message.guild.id}`);
  if (args[0] == "aç") {
    if (rol) {
      const embed = new Discord.RichEmbed()
        .setColor("#FF0000")
        .setTitle(`UYARI`)
        .setDescription("**__Kanal Koruma Sistemi__ Zaten Aktif!**")
        .setTimestamp() //Wiz Jack ?
        .setFooter(message.guild.name)
        .setThumbnail(message.guild.iconURL);
      message.channel.send(embed);
      return;
    } else {
      db.set(`kanalk_${message.guild.id}`, "acik");
      const embed = new Discord.RichEmbed()
      .setColor("#FF0000")
        .setTitle(`BAŞARILI`)
        .setDescription(
          "**__Kanal Koruma Sistemi__ Başarıyla Aktif Edildi!\n \n▪ Kapatmak için: `!kanal-koruma kapat`**"
        )
        .setFooter(message.guild.name)
        .setTimestamp()
        .setThumbnail(message.guild.iconURL);

      message.channel.send(embed);
    }
  } else if (args[0] == "kapat") {
    await db.delete(`kanalk_${message.guild.id}`);
    const embed = new Discord.RichEmbed()
      .setColor("#FF0000")
      .setTitle(`BAŞARILI`)
      .setDescription(
        "**__Kanal Koruma Sistemi__ Başarıyla Kapatıldı!\n \n▪ Açmak için: `!kanal-koruma aç`**"
      )
      .setTimestamp()
      .setFooter(message.guild.name)
      .setThumbnail(message.guild.iconURL);
    message.channel.send(embed);
  }

};

exports.conf = {
  enabled: true,
  aliases: ["kk"],
  permLevel: 0
};
//Dcs Ekibi
exports.help = {
  name: "kanalkoruma",
  description: "Kanal Koruma Sistemi!",
  usage: "kanal-koruma"
};
