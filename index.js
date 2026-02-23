require("dotenv").config();
const { Client, GatewayIntentBits } = require("@jubbio/core");

const PREFIX = "?";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.levels = new Map();
client.cooldowns = new Map();

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;

  // XP cooldown (30 saniye)
  const cooldownTime = 30000;
  const now = Date.now();

  if (client.cooldowns.has(userId)) {
    const expirationTime = client.cooldowns.get(userId) + cooldownTime;
    if (now < expirationTime) {
      // XP verme ama komutları kontrol etmeye devam et
    } else {
      client.cooldowns.set(userId, now);
      addXP(userId, message);
    }
  } else {
    client.cooldowns.set(userId, now);
    addXP(userId, message);
  }

  // Prefix kontrol
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    return message.reply("🏓 Pong! Level bot aktif.");
  }

  if (command === "level") {
    if (!client.levels.has(userId)) {
      client.levels.set(userId, { xp: 0, level: 0 });
    }

    const userData = client.levels.get(userId);

    return message.reply(
      `📊 Seviye: ${userData.level}\n⭐ XP: ${userData.xp}`
    );
  }
});

// XP ekleme fonksiyonu
function addXP(userId, message) {
  if (!client.levels.has(userId)) {
    client.levels.set(userId, { xp: 0, level: 0 });
  }

  const userData = client.levels.get(userId);
  const xpGain = Math.floor(Math.random() * 11) + 5;

  userData.xp += xpGain;

  const nextLevelXp = (userData.level + 1) * 100;

  if (userData.xp >= nextLevelXp) {
    userData.level++;
    message.reply(
      `🎉 ${message.author.username} seviye atladı! Yeni seviye: ${userData.level}`
    );
  }
}

client.once("ready", () => {
  console.log(`✅ Level Bot Hazır: ${client.user.username}`);
});

client.login(process.env.BOT_TOKEN);