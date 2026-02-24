require("dotenv").config();
const { Client, GatewayIntentBits } = require("@jubbio/core");
const RSSParser = require("rss-parser");

const YOUTUBE_CHANNEL_ID = "UCiK2XqGgeptbWfLJ0Eb777Q";
const ANNOUNCE_CHANNEL_ID = "548500039761145856";
const CHECK_INTERVAL_MS = 5 * 60 * 1000; // 5 dakikada bir kontrol

const rss = new RSSParser();
let lastVideoId = null;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds
  ]
});

async function checkYouTube() {
  try {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
    const feed = await rss.parseURL(feedUrl);

    if (!feed.items || feed.items.length === 0) return;

    const latest = feed.items[0];
    const videoId = latest.id || latest.link;

    if (lastVideoId === null) {
      lastVideoId = videoId;
      console.log(`✅ İlk kontrol: ${latest.title}`);
      return;
    }

    if (videoId !== lastVideoId) {
      lastVideoId = videoId;
      const message = `🎥 **Yeni Video!**\n**${latest.title}**\n${latest.link}`;

      await client.rest.request(
        "POST",
        `/bot/channels/${ANNOUNCE_CHANNEL_ID}/messages`,
        { content: message }
      );

      console.log(`📢 Duyuru gönderildi: ${latest.title}`);
    }
  } catch (err) {
    console.error("❌ YouTube kontrol hatası:", err.message);
  }
}

client.once("ready", () => {
  console.log(`✅ Duyuru botu hazır: ${client.user.username}`);
  checkYouTube();
  setInterval(checkYouTube, CHECK_INTERVAL_MS);
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
