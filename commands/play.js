const { spawn } = require("child_process");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource
} = require("@jubbio/voice");
const path = require("path");
const fs = require("fs");

const VOICE_CHANNEL_ID = "546336747034783744";

module.exports = {
  name: "play",

  async execute(client, message, args) {

    const url = args[0];
    if (!url) {
      return message.reply("YouTube linki gir.");
    }

    message.reply("İndiriliyor...");

    const filePath = path.join(__dirname, "song.mp3");

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

    ytdlp.on("close", async (code) => {
      if (code !== 0) {
        return message.reply("İndirme başarısız.");
      }

      const connection = joinVoiceChannel({
        channelId: VOICE_CHANNEL_ID,
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