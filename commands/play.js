const { spawn } = require("child_process");
const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource
} = require("@jubbio/voice");
const path = require("path");
const fs = require("fs");

module.exports = {
  name: "play",

  async execute(client, message, args) {

    // 🔥 ESKİ ÇALIŞAN YÖNTEM — voiceStates cache
    const voiceState = client.voiceStates.get(message.author.id);
    const voiceChannelId = voiceState?.channel_id;

    if (!voiceChannelId) {
      return message.reply("Odaya gir.");
    }

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