require("dotenv").config();

const { Client, GatewayIntentBits, Collection } = require("@jubbio/core");
const fs = require("fs");
const path = require("path");

// 🔥 CLIENT OLUŞTUR
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// 🔥 GLOBAL MUSIC DEĞİŞKENLERİ (Client oluştuktan sonra!)
client.musicPlayer = null;
client.musicConnection = null;

// 🔥 KOMUTLARI YÜKLE
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// 🔥 BOT READY
client.once("ready", () => {
  console.log("✅ Bot hazır!");
  console.log("Voice adapters:", client.voice.adapters);
});

// 🔥 MESAJ EVENT
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
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

// 🔥 LOGIN (Railway için)
client.login(process.env.TOKEN);