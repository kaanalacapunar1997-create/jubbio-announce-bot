require("dotenv").config();

const { Client, GatewayIntentBits } = require("@jubbio/core");
const play = require("play-dl");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// SoundCloud client_id otomatik al
(async () => {
  try {
    const clientId = await play.getFreeClientID();
    await play.setToken({
      soundcloud: {
        client_id: clientId
      }
    });
    console.log("✅ SoundCloud client_id alındı");
  } catch (err) {
    console.error("❌ SoundCloud client_id alınamadı:", err);
  }
})();

// Komut yükleme
const fs = require("fs");
client.commands = new Map();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(client, message, args);
  } catch (err) {
    console.error(err);
    message.reply("❌ Hata oluştu.");
  }
});

client.voiceStates = new Map();

client.once("ready", async () => {
  console.log(`✅ Bot hazır! User: ${client.user.username}`);

  // Sunucudaki mevcut ses durumlarını yükle
  try {
    for (const guild of client.guilds.values()) {
      const voiceStates = await client.rest.request("GET", `/bot/guilds/${guild.id}/voice-states`).catch(() => null);
      if (!voiceStates) continue;
      const list = Array.isArray(voiceStates) ? voiceStates : (voiceStates.data || []);
      console.log("🔍 Voice states örnek:", JSON.stringify(list[0] || {}));
      for (const vs of list) {
        const userId = vs.userId || vs.user_id;
        const channelId = vs.channelId || vs.channel_id;
        if (userId && channelId) {
          client.voiceStates.set(userId, channelId);
        }
      }
    }
    console.log(`✅ Ses durumları yüklendi (${client.voiceStates.size} kullanıcı)`);
  } catch (err) {
    console.error("⚠️ Ses durumları yüklenemedi:", err.message);
  }
});

client.voiceStates = new Map();

client.on("disconnect", () => {
  console.log("⚠️ Bot bağlantısı kesildi, yeniden bağlanıyor...");
});

client.on("error", (err) => {
  console.error("❌ Bot hatası:", err.message);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Beklenmeyen hata:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ İşlenmemiş promise hatası:", err?.message || err);
});

client.login(process.env.BOT_TOKEN);

client.on("voiceStateUpdate", (oldState, newState) => {
  console.log("🔍 voiceStateUpdate:", JSON.stringify(newState));
  const userId = newState.userId || newState.user_id;
  const channelId = newState.channelId || newState.channel_id;
  if (channelId) {
    client.voiceStates.set(userId, channelId);
  } else {
    client.voiceStates.delete(userId);
  }
});