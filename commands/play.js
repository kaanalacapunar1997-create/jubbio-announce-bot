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

    const mp3Path = path.join(__dirname, "song.mp3");
    const wavPath = path.join(__dirname, "song.wav");

    message.reply("⬇️ İndiriliyor...");

    const ytdlp = spawn("yt-dlp", [
      "-f", "bestaudio",
      "-o", mp3Path,
      args[0]
    ]);

    ytdlp.on("close", (code) => {

      if (code !== 0) {
        return message.reply("❌ İndirme hatası.");
      }

      // 🔥 BURASI ÖNEMLİ
      const ffmpeg = spawn("ffmpeg", [
        "-y",
        "-i", mp3Path,
        "-ar", "48000",     // 48kHz
        "-ac", "2",         // stereo
        "-f", "wav",
        wavPath
      ]);

      ffmpeg.on("close", (ffCode) => {

        if (ffCode !== 0) {
          return message.reply("❌ Dönüştürme hatası.");
        }

        const connection = joinVoiceChannel({
          channelId: VOICE_CHANNEL_ID,
          guildId: GUILD_ID,
          adapterCreator: client.voice.adapters.get(GUILD_ID)
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(wavPath);

        player.play(resource);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Playing, () => {
          console.log("🎵 Çalıyor!");
        });

        player.on("idle", () => {
          fs.unlinkSync(mp3Path);
          fs.unlinkSync(wavPath);
        });

        player.on("error", console.error);

        message.reply("🎶 Çalıyor...");
      });
    });
  }
};