const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource
} = require("@jubbio/voice");

const { spawn } = require("child_process");

const MUSIC_CHANNEL_ID = "546336747034783744";

module.exports = {
  name: "play",
  async execute(client, message, args) {

    const url = args[0];
    if (!url) return message.reply("Link gir.");

    message.reply("İndiriliyor...");

    const outputFile = "/tmp/music.mp3";

    const ytdlp = spawn("yt-dlp", [
      "-f", "bestaudio",
      "-x",
      "--audio-format", "mp3",
      "-o", outputFile,
      url
    ]);

    ytdlp.stderr.on("data", data => {
      console.log("yt-dlp:", data.toString());
    });

    ytdlp.on("close", (code) => {

      if (code !== 0) {
        return message.reply("İndirme hatası.");
      }

      const connection = joinVoiceChannel({
        channelId: MUSIC_CHANNEL_ID,
        guildId: message.guildId,
        adapterCreator: client.voice.adapters.get(message.guildId)
      });

      const player = createAudioPlayer();
      const resource = createAudioResource(outputFile);

      connection.subscribe(player);
      player.play(resource);

      message.reply("🎵 Çalıyor...");
    });
  }
};