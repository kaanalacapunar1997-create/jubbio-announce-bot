require("dotenv").config();
const { Client, GatewayIntentBits } = require("@jubbio/core");
const { Pool } = require("pg");

const PREFIX = "?";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS levels (
      userId TEXT PRIMARY KEY,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 0
    );
  `);
})();

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

  if (message.content.startsWith(PREFIX)) {
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (command === "ping") {
      return message.reply("🏓 Level bot aktif!");
    }

    if (command === "level") {
      const result = await pool.query(
        "SELECT * FROM levels WHERE userId = $1",
        [userId]
      );

      if (result.rows.length === 0) {
        return message.reply("📊 Seviye: 0\n⭐ XP: 0");
      }

      const row = result.rows[0];
      return message.reply(`📊 Seviye: ${row.level}\n⭐ XP: ${row.xp}`);
    }
  }

  const xpGain = Math.floor(Math.random() * 11) + 5;

  const result = await pool.query(
    "SELECT * FROM levels WHERE userId = $1",
    [userId]
  );

  if (result.rows.length === 0) {
    await pool.query(
      "INSERT INTO levels (userId, xp, level) VALUES ($1, $2, $3)",
      [userId, xpGain, 0]
    );
  } else {
    const row = result.rows[0];
    let newXP = row.xp + xpGain;
    let newLevel = row.level;

    const nextLevelXp = (newLevel + 1) * 100;

    if (newXP >= nextLevelXp) {
      newLevel++;
      message.reply(
        `🎉 ${message.author.username} seviye atladı! Yeni seviye: ${newLevel}`
      );
    }

    await pool.query(
      "UPDATE levels SET xp = $1, level = $2 WHERE userId = $3",
      [newXP, newLevel, userId]
    );
  }
});

client.once("ready", () => {
  console.log(`✅ Level Bot Hazır: ${client.user.username}`);
});

client.login(process.env.BOT_TOKEN);