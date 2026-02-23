require("dotenv").config();
const { Client, GatewayIntentBits } = require("@jubbio/core");
const sqlite3 = require("sqlite3").verbose();

const PREFIX = "?";

const db = new sqlite3.Database("./levels.db");

// Tablo oluştur
db.run(`
CREATE TABLE IF NOT EXISTS levels (
  userId TEXT PRIMARY KEY,
  xp INTEGER,
  level INTEGER
)
`);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.cooldowns = new Map();

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;

  // Cooldown
 const cooldownTime = 5000;
  const now = Date.now();

  if (client.cooldowns.has(userId)) {
    const expirationTime = client.cooldowns.get(userId) + cooldownTime;
    if (now < expirationTime) return;
  }

  client.cooldowns.set(userId, now);

  addXP(userId, message);

  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    return message.reply("🏓 Level bot aktif!");
  }

  if (command === "level") {
    db.get(
      "SELECT * FROM levels WHERE userId = ?",
      [userId],
      (err, row) => {
        if (!row) {
          return message.reply("📊 Seviye: 0\n⭐ XP: 0");
        }

        message.reply(
          `📊 Seviye: ${row.level}\n⭐ XP: ${row.xp}`
        );
      }
    );
  }
});

function addXP(userId, message) {
  db.get(
    "SELECT * FROM levels WHERE userId = ?",
    [userId],
    (err, row) => {
      if (!row) {
        db.run(
          "INSERT INTO levels (userId, xp, level) VALUES (?, ?, ?)",
          [userId, 10, 0]
        );
        return;
      }

      const xpGain = Math.floor(Math.random() * 11) + 5;
      let newXP = row.xp + xpGain;
      let newLevel = row.level;

      const nextLevelXp = (newLevel + 1) * 100;

      if (newXP >= nextLevelXp) {
        newLevel++;
        message.reply(
          `🎉 ${message.author.username} seviye atladı! Yeni seviye: ${newLevel}`
        );
      }

      db.run(
        "UPDATE levels SET xp = ?, level = ? WHERE userId = ?",
        [newXP, newLevel, userId]
      );
    }
  );
}

client.once("ready", () => {
  console.log(`✅ Level Bot Hazır: ${client.user.username}`);
});

client.login(process.env.BOT_TOKEN);