const { spawn } = require("child_process");
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@jubbio/voice");
const path = require("path");
const fs = require("fs");

module.exports = {
  name: "play",
  async execute(client, message, args) {

    const voiceChannelId = message.member?.voice?.channel_id;
    if (!voiceChannelId) {
      return message.reply("Odaya gir.");
    }

    const url = args[0];
    if (!url) {
      return message.reply("Bir YouTube linki gir.");
    }

    message.reply("İndiriliyor...");

    const filePath = path.join(__dirname, "song.mp3");

    // eski dosya varsa sil
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    const ytdlp = spawn("yt-dlp", [
      "-x",
      "--audio-format",
      "mp3",
      "-o",
      filePath,
      url
    ]);

    ytdlp.stderr.on("data", data => {
      console.log("YTDLP:", data.toString());
    });

    ytdlp.on("error", err => {
      console.log("SPAWN ERROR:", err);
    });

    ytdlp.on("close", async (code) => {
      console.log("YTDLP EXIT CODE:", code);

      if (code !== 0) {
        return message.reply("❌ İndirme başarısız.");
      }

      const connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: message.guild_id,
        adapterCreator: message.guild.voiceAdapterCreator
      });

      const player = createAudioPlayer();
      const resource = createAudioResource(filePath);

      player.play(resource);
      connection.subscribe(player);

      message.reply("Çalıyor...");
    });
  }
};