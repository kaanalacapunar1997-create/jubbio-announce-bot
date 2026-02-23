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

client.once("ready", () => {
  console.log(`✅ Bot hazır! User: ${client.user.username}`);
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
  if (newState.channelId) {
    client.voiceStates.set(newState.userId, newState.channelId);
  } else {
    client.voiceStates.delete(newState.userId);
  }
});