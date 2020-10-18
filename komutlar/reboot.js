const Discord = require("discord.js");
const bot = new Discord.Client();
const ayarlar = require("../ayarlar.json");

module.exports.run = async (bot, message, args) => {
  var embed2 = new Discord.RichEmbed()
    .setDescription(
      `🔒 | ${message.member.user} Geliştiricilerimden Değilsin Yapamassın ! `
    )
    .setColor("RANDOM");

  if (message.author.id !== "750740742825181195") return message.channel.sendEmbed(embed2);

  var embed = new Discord.RichEmbed()
    .setDescription(
      "Yeniden başlama onayı için aşağıdaki **TİK** işaretine dokunabilir misin ?"
    )
    .setColor("RANDOM");
  message.channel.send(embed).then(async function(sentEmbed) {
    const emojiArray = ["✅"];
    const filter = (reaction, user) =>
      emojiArray.includes(reaction.emoji.name) && user.id === message.author.id;
    await sentEmbed.react(emojiArray[0]).catch(function() {});
    var reactions = sentEmbed.createReactionCollector(filter, {
      time: 70000
    });
    reactions.on("end", () =>
      sentEmbed.edit("Yeniden başlama işlemi **İptal Oldu** ")
    );
    reactions.on("collect", async function(reaction) {
      if (reaction.emoji.name === "✅") {
        message.channel.send("İşlem Onaylandı ");

        console.log(`BOT: Bot yeniden Başlıyor.`);
        process.exit(0);
      }
    });
  });
};
module.exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [""],
  permLevel: 0
};

module.exports.help = {
  name: "reboot",
  description: "reboot",
  usage: "reboot"
};
