require("dotenv").config();

const { Client, GatewayIntentBits, Collection } = require("@jubbio/core");
const fs = require("fs");
const path = require("path");
const http = require("http");

// 🔥 CLIENT OLUŞTUR
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates // ⚠️ Voice intent açık olmalı
  ]
});

// 🔥 VOICE STATE CACHE
client.voiceStates = new Map();

// Voice event debug
client.on("voiceStateUpdate", (state) => {
  console.log("🎧 VOICE EVENT GELDİ:", state);
  client.voiceStates.set(state.user_id, state);
});

// 🔥 KOMUTLARI YÜKLE
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// 🔥 READY EVENT
client.once("ready", () => {
  console.log("✅ Bot hazır!");
  console.log("🎧 Voice adapters:", client.voice.adapters);
});

// 🔥 MESAJ EVENT
client.on("messageCreate", async (message) => {
  if (!message.content) return;
  if (!message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    await command.execute(client, message, args);
  } catch (error) {
    console.error(error);
    message.reply("❌ Komut çalıştırılırken hata oluştu.");
  }
});

// 🔥 LOGIN
client.login(process.env.TOKEN);

// 🔥 Railway mini server
http.createServer((req, res) => {
  res.writeHead(200);
  res.end("Bot aktif.");
}).listen(3000);