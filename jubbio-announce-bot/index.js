require("dotenv").config();
const { Client, GatewayIntentBits } = require("@jubbio/core");
const RSSParser = require("rss-parser");

const ANNOUNCE_CHANNEL_ID = process.env.ANNOUNCE_CHANNEL_ID || "548500039761145856";
const CHECK_INTERVAL_MS = 5 * 60 * 1000;

const YOUTUBE_CHANNELS = [
  { id: "UCiK2XqGgeptbWfLJ0Eb777Q", name: "CyberRulzTv" }
];

const rss = new RSSParser();
const lastVideoIds = {};

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

async function checkChannel(channel) {
  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`;
    const feed = await rss.parseURL(feedUrl);

    if (!feed.items || feed.items.length === 0) return;

    const latest = feed.items[0];
    const videoId = latest.id || latest.link;

    if (!videoId) {
      console.warn(`[${channel.name}] Video ID alinamadi.`);
      return;
    }

    if (lastVideoIds[channel.id] === undefined) {
      lastVideoIds[channel.id] = videoId;
      console.log(`✅ [${channel.name}] İlk kontrol: ${latest.title}`);
      return;
    }

    if (videoId !== lastVideoIds[channel.id]) {
      lastVideoIds[channel.id] = videoId;

      await client.rest.request(
        "POST",
        `/bot/channels/${ANNOUNCE_CHANNEL_ID}/messages`,
        { content: `🎥 **${channel.name} yeni video yükledi!**\n**${latest.title}**\n${latest.link}` }
      );

      console.log(`📢 [${channel.name}] Duyuru gönderildi: ${latest.title}`);
    }
  } catch (err) {
    console.error(`❌ [${channel.name}] kontrol hatası:`, err.message);
  }
}

async function checkAll() {
  await Promise.all(YOUTUBE_CHANNELS.map(channel => checkChannel(channel)));
}

client.once("ready", () => {
  console.log(`✅ Duyuru botu hazır: ${client.user.username}`);
  console.log(`📡 ${YOUTUBE_CHANNELS.length} kanal takip ediliyor`);
  checkAll();
  setInterval(checkAll, CHECK_INTERVAL_MS);
});

client.on("error", (err) => {
  console.error("❌ Bot hatası:", err.message);
});

process.on("uncaughtException", (err) => {
  console.error("❌ Beklenmeyen hata:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ İşlenmemiş hata:", err?.message || err);
});

client.login(process.env.BOT_TOKEN);
