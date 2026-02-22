const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { 
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@jubbio/voice");

module.exports = {
  name: "play",

  async execute(client, message, args) {

    if (!args[0]) {
      return message.reply("❌ Link gir.");
    }

    const VOICE_CHANNEL_ID = "546336747034783744";
    const GUILD_ID = message.guildId;

    const filePath = path.join(__dirname, "song.mp3");

    message.reply("⬇️ İndiriliyor...");

    const ytdlp = spawn("yt-dlp", [
      "-f", "bestaudio",
      "-o", filePath,
      args[0]
    ]);

    ytdlp.on("close", (code) => {

      if (code !== 0) {
        return message.reply("❌ İndirme hatası.");
      }

      const connection = joinVoiceChannel({
        channelId: VOICE_CHANNEL_ID,
        guildId: GUILD_ID,
        adapterCreator: client.voice.adapters.get(GUILD_ID)
      });

      const player = createAudioPlayer();
      const resource = createAudioResource(filePath);

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Playing, () => {
        console.log("🎵 Çalıyor!");
      });

      player.on("idle", () => {
        fs.unlinkSync(filePath); // iş bitince sil
      });

      player.on("error", console.error);

      message.reply("🎶 Çalıyor...");
    });
  }
};