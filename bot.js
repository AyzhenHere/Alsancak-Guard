const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const weather = require("weather-js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
const snekfetch = require("snekfetch");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
//   console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);
/////otorolmain
/////otorolmain son
////botu sese sokma
////botu sese sokma son

/////hoşgeldin mesajı sohbete


//●●●●●●●●●●●●●●●●●●●●BAN KORUMA SİSTEMİ●●●●●●●●●●●●●●●●●●●//

const wait = require("util").promisify(setTimeout);

client.on("guildBanAdd", async function(guild, user) {
  let ban_koruma = await db.fetch(`bank_${guild.id}`);
  if (ban_koruma == "acik") {
    let rol = guild.roles.get("766621467315798026")
    let kanal = guild.channels.get("767382350165573632")
    if (!kanal) return;
    if (!rol) return;
    wait(1000);
    const entry = await guild
      .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
      .then(audit => audit.entries.first());
    const yetkili = await guild.members.get(entry.executor.id);
    if (entry.executor.id == client.user.id) return;
    if (entry.executor.id == guild.owner.id) return;
    const kisi = guild.members.get(entry.executor.id);
    kisi.roles.forEach(x => kisi.removeRole(x).then(f => kisi.addRole(rol.id)))
    
    
    
    const embed = new Discord.RichEmbed()
      .setColor("#FF0000")
      .setTitle(`UYARI`)
      .setDescription(
        `**<@${yetkili.id}> Sağ Tık Ban Attığı için Bütün Yetkileri Alındı!\n \n__▪ Yasaklanan Kullanıcı:__ \`${user.tag}\`\n__▪ Yasaklanan Kullanıcı ID:__ \`${user.id}\`**`
      )
      .setFooter(guild.name)
      .setTimestamp()
      .setThumbnail(guild.iconURL);
    kanal.send(embed);
    
    guild.owner.send(
      `**\`${yetkili.tag}\`  İsimli Yetkili  \`${user.tag}\`  Adlı Kişiyi Sağ Tık ile Banladı Ve Yetkilerini Aldım!**`
    );
  }
});

//●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●//
//●●●●●●●●●●●●●●●●●●●●ROL KORUMA SİSTEMİ●●●●●●●●●●●●●●●●●●●//

client.on("roleDelete", async role => {
  let rolkoruma = await db.fetch(`rolk_${role.guild.id}`);
  if (rolkoruma == "acik") {
    let rol = role.guild.roles.get("766621467315798026")
    let log = role.guild.channels.get("767382350165573632")
    
    if (!rol) return;
    if (!log) return;
    const entry = await role.guild
      .fetchAuditLogs({ type: "ROLE_DELETE" })
      .then(audit => audit.entries.first());
    if (entry.executor.id == role.guild.owner.id) return;
    role.guild.createRole({
      name: role.name,
      color: role.color,
      permissions: role.permissions
    }); 
    role.guild.roles.forEach(c => 
      role.guild
        .member(entry.executor)
        .removeRole(c)
        .then(f => role.guild.member(entry.executor).addRole(rol))
    );
    const embed = new Discord.RichEmbed()
      .setTitle(`UYARI`)
      .setFooter(role.guild.name)
      .setThumbnail(role.guild.iconURL)
      .setColor("#FF0000")
      .setTimestamp()
      .setDescription(
        `**Bir Rol Silindi ve Sunucuya Geri Yüklendi! Rolü Silen Kişinin Tüm Yetkileri Alındı!\n \n__▪ Silinen Rol:__ \`${role.name}\`\n__▪ Rolü Silen Kişi:__ ${entry.executor}\n__▪ Kullanıcının ID"si:__ \`${entry.executor.id}\`**`
      );
    log.send(embed);
    const dcs = new Discord.RichEmbed()
      .setTitle(`UYARI`)
      .setFooter(role.guild.name)
      .setThumbnail(role.guild.iconURL)
      .setColor("#FF0000")
      .setTimestamp() 
      .setDescription(
        `**Bir Rol Silindi ve Sunucuya Geri Yüklendi! Rolü Silen Kişinin Tüm Yetkileri Alındı!\n \n__▪ Silinen Rol:__ \`${role.name}\`\n__▪ Rolü Silen Kişi:__ ${entry.executor.tag}\n__▪ Kullanıcının ID"si:__ \`${entry.executor.id}\`**`
      );
      role.guild.owner.send(dcs)
  }
});

//●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●//

//●●●●●●●●●●●●●●●●KANAL KORUMA SİSTEMİ●●●●●●●●●●●●●●●●//

client.on("channelDelete", async function(channel) {
  let kanal_koruma = await db.fetch(`kanalk_${channel.guild.id}`);
  if (kanal_koruma == "acik") {
    const log = channel.guild.channels.get("767382350165573632")
   
    if (!log) return;
    
    
    let entry = await channel.guild
      .fetchAuditLogs({ type: "CHANNEL_DELETE" })
      .then(a => a.entries.first());
    if (entry.executor.bot) return;
    if (entry.executor.id == channel.guild.owner.id) return;
    let kisi = channel.guild.member(entry.executor);
    await kisi.roles.forEach(x =>
      kisi.removeRole(x)
    );
    let mu = new Discord.RichEmbed()
      .setTitle(`UYARI`)
      .setColor("#FF0000")
      .setTimestamp() 
      .setThumbnail(channel.guild.iconURL)
      .setFooter(channel.guild.name)
      .setDescription(
        `**\`${channel.name}\`  İsimli Kanal Silindi Ancak Kanal Koruma Sistemi Sayesinde Sunucuya Geri Yüklendi ve Kanalı Silen Kişinin Yetkileri Alındı!\n \n__▪ Kanalı Silen Kişi:__ ${entry.executor}\n__▪ Kişinin ID'si:__ \`${entry.executor.id}\`\n__▪ Kişinin Tagı:__ \`${entry.executor.tag}\`**`
      );

    let kategoriID = channel.parentID;
    channel.clone(this.name, true, true).then(z => {
      let chn = z.guild.channels.find(x => x.id === z.id);
      if (kategoriID) {
        chn.setParent(chn.guild.channels.find(s => s.id === kategoriID));
      }
      if (channel.type == "voice") return log.send(mu);
      let everyone = channel.guild.roles.find(x => x.name === "@everyone");
      const embed = new Discord.RichEmbed()
        .setTitle(`BİLDİRİ`)
      .setColor("#FF0000")
        .setThumbnail(channel.guild.iconURL)
        .setFooter(channel.guild.name)
        .setTimestamp()
        .setDescription(
          `**Bu Kanal Silindi Ancak Kanal Koruma Sistemi Sayesinde Sunucuya Geri Yüklendi ve Kanalı Silen Kişinin Yetkileri Alındı!\n \n__▪ Kanalı Silen Kişi:__ ${entry.executor}\n__▪ Kişinin ID'si:__ \`${entry.executor.id}\`**`
        );
      chn.send(embed);
      log.send(mu);
      let dcs = new Discord.RichEmbed()
      .setTitle(`UYARI`)
      .setColor("#FF0000")
      .setTimestamp()
      .setThumbnail(channel.guild.iconURL)
      .setFooter(channel.guild.name)
      .setDescription(
        `**\`${channel.name}\`  İsimli Kanal Silindi Ancak Kanal Koruma Sistemi Sayesinde Sunucuya Geri Yüklendi ve Kanalı Silen Kişinin Yetkileri Alındı!\n \n__▪ Kanalı Silen Kişinin ID'si:__ \`${entry.executor.id}\`\n__▪ Kişinin Tagı:__ \`${entry.executor.tag}\`**`
      );
      channel.guild.owner.send(dcs)
    });
  }
});
   

//●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●//

///////////sa-as başlangıç


///////////sa-as son

///////////mesaj log
client.on("messageDelete", async (message, channel) => {
  if (message.author.bot || message.channel.type === "dm") return;

  if (message.author.bot) return;

  var user = message.author;

  let sChannel2 = message.guild.channels.find(c => c.name === "「🔒」yöneti̇m-log");
  const embed = new Discord.RichEmbed()
      .setColor("#FF0000")
    .setAuthor(`Mesaj silindi.`, message.author.avatarURL)
    .addField("Kullanıcı İsmi", message.author.tag, true)
    .addField("Kanal Adı", message.channel.name, true)
    .addField("Silinen Mesaj", "```" + message.content + "```")
    .setFooter(
      `Bugün Saat ${message.createdAt.getHours() +
        3}:${message.createdAt.getMinutes()}`
    );
  sChannel2.send(embed);
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  if (newMessage.author.bot || newMessage.channel.type === "dm") return;
  let sChannel3 = newMessage.guild.channels.find(c => c.name === "「🔒」yöneti̇m-log");
  if (oldMessage.content == newMessage.content) return;
  let embed = new Discord.RichEmbed()
      .setColor("#FF0000")
    .setAuthor(`Mesaj Düzenlendi`, newMessage.author.avatarURL)
    .addField("Kullanıcı", newMessage.author)
    .addField("Eski Mesaj", oldMessage.content, true)
    .addField("Yeni Mesaj", newMessage.content, true)
    .addField("Kanal Adı", newMessage.channel.name, true)
    .setFooter(
      `Bugün Saat ${newMessage.createdAt.getHours() +
        3}:${newMessage.createdAt.getMinutes()}`
    );
  sChannel3.send(embed);
});
////////mesaj log son


//MOD LOG KANAL YÜKLEME

client.on("channelCreate", async(channel) => {
let kslog = await db.fetch(`kslog_${channel.guild.id}`);
  if (!kslog) return;
  const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_CREATE'}).then(audit => audit.entries.first());
  let kanal;
  if (channel.type === "text") kanal = `<#${channel.id}>`
  if (channel.type === "voice") kanal = `\`${channel.name}\``
  let embed = new Discord.RichEmbed() //dcs
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Kanal Oluşturma")
  .addField("**Kanalı Oluşturan Kişi**", `<@${entry.executor.id}>`)
  .addField("**Oluşturduğu Kanal**", `${kanal}`)
  .setTimestamp()
      .setColor("#FF0000")
  client.channels.get(kslog).send(embed)
  })

//MOD LOG KANAL SİLME

client.on("channelDelete", async(channel) => {
let kslog = await db.fetch(`kslog_${channel.guild.id}`);
  if (!kslog) return;
  const entry = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'}).then(audit => audit.entries.first());
  let embed = new Discord.RichEmbed()
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Kanal Silme")
  .addField("**Kanalı Silen Kişi**", `<@${entry.executor.id}>`)
  .addField("**Silinen Kanal**", `\`${channel.name}\``)
  .setTimestamp()
      .setColor("#FF0000") //dcs
  client.channels.get(kslog).send(embed)
  })

//MOD LOG ROL OLUŞTURMA

client.on("roleCreate", async(role) => {
let rslog = await db.fetch(`rslog_${role.guild.id}`);
  if (!rslog) return;
  const entry = await role.guild.fetchAuditLogs({type: 'ROLE_CREATE'}).then(audit => audit.entries.first()); //dcs
  let embed = new Discord.RichEmbed()
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Rol Oluşturma")
  .addField("**Rolü Oluşturan Kişi**", `<@${entry.executor.id}>`)
  .addField("**Oluşturulan Rol**", `\`${role.name}\` ** | ** \`${role.id}\``)
  .setTimestamp()
      .setColor("#FF0000")
  client.channels.get(rslog).send(embed)
  })

//MOD LOG ROL SİLME

client.on("roleDelete", async(role) => {
let rslog = await db.fetch(`rslog_${role.guild.id}`);
  if (!rslog) return;
  const entry = await role.guild.fetchAuditLogs({type: 'ROLE_DELETE'}).then(audit => audit.entries.first());
  let embed = new Discord.RichEmbed()
  .setThumbnail(entry.executor.avatarURL) //dcs
  .setTitle("Rol Silme")
  .addField("**Rolü Silen Kişi**", `<@${entry.executor.id}>`)
  .addField("**Silinen Rol**", `\`${role.name}\` ** | ** \`${role.id}\``)
  .setTimestamp()
      .setColor("#FF0000")
  client.channels.get(rslog).send(embed)
  })

//MOD LOG EMOJİ YÜKLEME

client.on("emojiCreate", async(emoji) => {
  let eslog = await db.fetch(`eslog_${emoji.guild.id}`);
  if (!eslog) return;
  const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_CREATE'}).then(audit => audit.entries.first());
  let embed = new Discord.RichEmbed() //dcs
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Emoji Oluşturma")
  .addField("**Emojiyi Oluşturan Kişi**", `<@${entry.executor.id}>`)
  .addField("**Emojinin Resmi**",  `ー ${emoji}`)
  .addField("**Oluşturulan Emoji**", `İsmi: \`${emoji.name}\``)
  .setTimestamp()
      .setColor("#FF0000")
  client.channels.get(eslog).send(embed)
})

//MOD LOG EMOJİ SİLME

 client.on("emojiDelete", async(emoji) => {
  let eslog = await db.fetch(`eslog_${emoji.guild.id}`);
  if (!eslog) return;
  const entry = await emoji.guild.fetchAuditLogs({type: 'EMOJI_DELETE'}).then(audit => audit.entries.first()); //dcs
  let embed = new Discord.RichEmbed()
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Emoji Silme")
  .addField("**Emojiyi Silen Kişi**", `<@${entry.executor.id}>`)
  .addField("**Silinen Emoji**", `İsmi: ${emoji}`)
  .setTimestamp()
      .setColor("#FF0000")
  client.channels.get(eslog).send(embed)
})

//MOD LOG EMOJİ GÜNCELLEME

client.on("emojiUpdate", async(oldEmoji, newEmoji) => {
  let eslog = await db.fetch(`eslog_${oldEmoji.guild.id}`); //dcs
  if (!eslog) return;
  const entry = await oldEmoji.guild.fetchAuditLogs({type: 'EMOJI_UPDATE'}).then(audit => audit.entries.first());
  let embed = new Discord.RichEmbed()
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Emoji Güncelleme")
  .addField("**Emojiyi Güncelleyen Kişi**", `<@${entry.executor.id}>`)
  .addField("**Emojinin Resmi**", `ー ${newEmoji}`)
  .addField("**Güncellenmeden Önceki Emoji**", `Eski İsmi: \`${oldEmoji.name}\``)
  .addField("**Güncellendikten Sonraki Emoji**", `Yeni İsmi: \`${newEmoji.name}\``)
  .setTimestamp()
      .setColor("#FF0000")
  client.channels.get(eslog).send(embed)
})

//MOD LOG SES KANALINA GİRİŞ-ÇIKIŞ BİLGİLENDİRME

client.on("voiceStateUpdate", async(oldMember, newMember) => {
let seslog = await db.fetch(`seslog_${oldMember.guild.id}`);
 if (!seslog) return;
  let embed = new Discord.RichEmbed() //dcs
.setThumbnail(oldMember.user.avatarURL)
 .setTitle("Ses Kanalına Giriş")
 .addField("**Kanala Giren Kişi**", `<@${oldMember.id}>`)
 .addField("**Şuanda Bulunduğu Kanal**", `\`${newMember.voiceChannel.name}\` **|** \`${newMember.voiceChannel.id}\``) 
 .setTimestamp()
      .setColor("#FF0000")
  client.channels.get(seslog).send(embed)
})

//MOD LOG BAN ATMA BİLGİLENDİRME

client.on("guildBanAdd", async(guild, user) => {
let banlog = await db.fetch(`banlog_${guild.id}`);
  if (!banlog) return;
  const entry = await guild.fetchAuditLogs({type: "MEMBER_BAN_ADD"}).then(audit => audit.entries.first());
  let embed = new Discord.RichEmbed() //dcs
  .setThumbnail(entry.executor.avatarURL)
  .setTitle("Sunucudan Yasaklama")
  .addField("**Kullanıcıyı Yasaklayan Yekili**", `<@${entry.executor.id}>`)
  .addField("**Yasaklanan Kullanıcı**", `\`*${user.tag}\` **|** \`${user.id}\``)
  .addField("**Yasaklanma Sebebi**", `${entry.reason}`)
  .setTimestamp()
      .setColor("#FF0000")
  client.channels.get(banlog).send(embed)
})

///MOD LOG BAN AÇMA BİLGİLENDİRME

client.on("guildBanRemove", async(guild, user) => {
let banlog = await db.fetch(`banlog_${guild.id}`);
  if (!banlog) return;
  const entry = await guild.fetchAuditLogs({type: "MEMBER_BAN_REMOVE"}).then(audit => audit.entries.first());
  let embed = new Discord.RichEmbed()
  .setThumbnail(entry.executor.avatarURL)  //dcs
  .setTitle("Yasak Kaldırma")
  .addField("**Yasağı Kaldıran Yetkili**", `<@${entry.executor.id}>`)
  .addField("**Yasağı Kaldırılan Kullanıcı**", `\`${user.tag}\` **|** \`${user.id}\``)
  .setTimestamp()
      .setColor("#FF0000")
  client.channels.get(banlog).send(embed)
})

///MOD LOG BAN AÇMA BİLGİLENDİRME SON

/// Rol Koruma v2
client.on("roleUpdate", async function(oldRole, newRole) {
  const bilgilendir = await newRole.guild
    .fetchAuditLogs({ type: "ROLE_UPLATE" })
    .then(hatırla => hatırla.entries.first());
  let yapanad = bilgilendir.executor;
  let idler = bilgilendir.executor.id;
  if (idler === "750740742825181195") return; // yapan kişinin id si bu ise bir şey yapma
  if (oldRole.hasPermission("ADMINISTRATOR")) return;

  setTimeout(() => {
    if (newRole.hasPermission("ADMINISTRATOR")) {
      newRole.setPermissions(newRole.permissions - 8);
    }

    if (newRole.hasPermission("ADMINISTRATOR")) {
      if (
        !client.guilds.get(newRole.guild.id).channels.has("767382350165573632")
      )
        return newRole.guild.owner.send(
          `Rol Koruma Nedeniyle ${yapanad} Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün **Yöneticisi** Alındı. \Rol: **${newRole.name}**`
        ); //bu id ye sahip kanal yoksa sunucu sahibine yaz

      client.channels
        .get("767382350165573632")
        .send(
          `Rol Koruma Nedeniyle ${yapanad} Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün **Yöneticisi Alındı**. \Rol: **${newRole.name}**`
        ); // belirtilen id ye sahip kanala yaz
    }
  }, 1000);
});
/////////rol koruma v2 son

////////ban limit koruma
client.on("guildBanAdd", async (guild, user) => {
  const entry = await guild
    .fetchAuditLogs({ type: "MEMBER_BAN_ADD" })
    .then(audit => audit.entries.first());
  let banlimit = await db.fetch(`banlimit_${guild.id}`);
  let kullanıcıban = await db.fetch(
    `banlimitkullanici_${guild.id}_${entry.executor.id}`
  );

  if (banlimit) {
    if (entry.executor.id !== guild.owner.user.id) {
      if (entry.executor.bot) return;
      await db.add(`banlimitkullanici_${guild.id}_${entry.executor.id}`, 1);

      try {
        guild
          .member(entry.executor)
          .roles.filter(a => a.hasPermission("BAN_MEMBERS"))
          .forEach(x => guild.member(entry.executor).removeRole(x.id));
        guild.owner.user.send(`

**Sunucundan Bir Yetkili Ban Koruma Limitine Ulaştı ve Ban Yetkisi Olan Tüm Rolleri Alındı!**\n**Bilgileri:**
\n**Kullanıcı:**\  ${entry.executor} | ${entry.executor.id} 
\n\`Katılım Tarihi:\` 
\n•**Discord:** ${moment(entry.executor.createdAt).format(
          "DD/MM/YYYY | HH:mm:ss"
        )} 
•**Sunucu:** ${moment(guild.member(entry.executor).joinedAt).format(
          "DD/MM/YYYY | HH:mm:ss"
        )}`);
      } catch (err) {}
      db.delete(`banlimitkullanici_${guild.id}_${entry.executor.id}`);
    }
  }
});
///////////////ban limit koruma son

////////botu kickleme
client.on('guildMemberAdd', member => {
 let guvenlik= db.fetch(`bottemizle_${member.guild.id}`)
    if (!guvenlik) return;
    if(member.user.bot !==true){
    } else {
   member.kick(member) 
  }  
  }); 
////////botu kickleme son

///////////////// Anti Ddos koruma
 client.on('message', msg => {

if(client.ping > 2500) {

            let bölgeler = ['singapore', 'eu-central', 'india', 'us-central', 'london',
            'eu-west', 'amsterdam', 'brazil', 'us-west', 'hongkong', 
            'us-south', 'southafrica', 'us-east', 'sydney', 'frankfurt',
            'russia']
           let yenibölge = bölgeler[Math.floor(Math.random() * bölgeler.length)]
           let sChannel = msg.guild.channels.find(c => c.name === "「🔒」yöneti̇m-log")

           sChannel.send(`Sunucu'ya Vuruyorlar \nSunucu Bölgesini Değiştirdim \n __**${yenibölge}**__ :tik: __**Sunucu Pingimiz**__ :`+ client.ping)
           msg.guild.setRegion(yenibölge)
           .then(g => console.log(" bölge:" + g.region))
           .then(g => msg.channel.send("bölge **"+ g.region  + " olarak değişti")) 
           .catch(console.error);
}});



let rol = `766621467315798026` // Kişiye verilecek jail rolünün Id'sini yazınız.
let logk = `767382350165573632` // Kişiye jail rolü verildikten sonra log kanalının Id'sini yazınız.
client.on("guildMemberUpdate", async(eski, yeni) => {
 if(eski.roles.size === yeni.roles.size) return;
 let log = await yeni.guild.fetchAuditLogs({ type: 'MEMBER_ROLES_UPDATE' }).then(x => x.entries.first())
 if(!log) return;
 let onlycode = log.executor
 if(onlycode.bot) return;
 yeni.setRoles(eski.roles.array())
 yeni.guild.member(onlycode).roles.forEach(a => yeni.guild.member(onlycode).removeRole(a))
 yeni.guild.member(onlycode).addRole(rol)
 client.channels.get(logk).send(`${onlycode} adlı kişi ${yeni} adlı kişiye bir rol verdi veya aldı, kişinin rolünü alarak ${onlycode} kişisine @${eski.guild.roles.get(rol).name} rolünü verdim.`)
});
