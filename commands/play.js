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

    // 🔥 yt-dlp başlat
    const ytdlp = spawn("yt-dlp", [
      "-f", "bestaudio",
      "--no-playlist",
      "-o", mp3Path,
      args[0]
    ]);

    // 🔥 DEBUG ÇIKTILARI
    ytdlp.stdout.on("data", data => {
      console.log("YTDLP STDOUT:", data.toString());
    });

    ytdlp.stderr.on("data", data => {
      console.log("YTDLP STDERR:", data.toString());
    });

    ytdlp.on("error", err => {
      console.log("YTDLP SPAWN ERROR:", err);
      message.reply("❌ yt-dlp spawn error");
    });

    ytdlp.on("close", (code) => {

      console.log("YTDLP EXIT CODE:", code);

      if (code !== 0) {
        return message.reply("❌ İndirme hatası.");
      }

      console.log("MP3 indirildi.");

      // 🔥 WAV'a çevir
      const ffmpeg = spawn("ffmpeg", [
        "-y",
        "-i", mp3Path,
        "-ar", "48000",
        "-ac", "2",
        wavPath
      ]);

      ffmpeg.stderr.on("data", data => {
        console.log("FFMPEG STDERR:", data.toString());
      });

      ffmpeg.on("close", (ffCode) => {

        console.log("FFMPEG EXIT CODE:", ffCode);

        if (ffCode !== 0) {
          return message.reply("❌ Dönüştürme hatası.");
        }

        console.log("WAV hazır.");

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
          console.log("Bitti, dosyalar siliniyor.");
          try {
            fs.unlinkSync(mp3Path);
            fs.unlinkSync(wavPath);
          } catch {}
        });

        player.on("error", err => {
          console.log("PLAYER ERROR:", err);
        });

        message.reply("🎶 Çalıyor...");
      });
    });
  }
};