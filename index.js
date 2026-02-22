require("dotenv").config();
const { Client } = require("@jubbio/core");
const playCommand = require("./commands/play");

// 🔥 TOKEN kontrolü
if (!process.env.TOKEN) {
  console.error("❌ TOKEN bulunamadı! Railway Variables kısmına TOKEN ekle.");
  process.exit(1);
}

const client = new Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "MESSAGE_CONTENT",
    "GUILD_VOICE_STATES"
  ]
});

client.on("ready", () => {
  console.log(`✅ ${client.user.username} giriş yaptı ve aktif!`);
});

client.on("messageCreate", async (message) => {
  if (!message.content) return;
  if (message.author.bot) return;
  if (!message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "play") {
    try {
      await playCommand.execute(client, message, args);
    } catch (err) {
      console.error("Komut hatası:", err);
      message.reply("❌ Komut çalıştırılırken hata oluştu.");
    }
  }
});

// 🔥 Login
client.login(process.env.TOKEN)
  .then(() => {
    console.log("🔐 Login isteği gönderildi...");
  })
  .catch((err) => {
    console.error("❌ Login hatası:", err);
  });