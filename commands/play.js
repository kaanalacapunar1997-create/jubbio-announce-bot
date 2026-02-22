const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType
} = require("@jubbio/voice");

const { spawn } = require("child_process");

// 🔥 SABİT ODA ID
const MUSIC_CHANNEL_ID = "546336747034783744";

module.exports = {
  name: "play",
  async execute(client, message, args) {

    const url = args[0];
    if (!url) return message.reply("Link gir.");

    const connection = joinVoiceChannel({
      channelId: MUSIC_CHANNEL_ID,
      guildId: message.guildId,
      adapterCreator: client.voice.adapters.get(message.guildId)
    });

    const player = createAudioPlayer();

    const ytdlp = spawn("yt-dlp", ["-f", "bestaudio", "-o", "-", url]);

    const ffmpeg = spawn("ffmpeg", [
      "-i", "pipe:0",
      "-f", "opus",
      "-ar", "48000",
      "-ac", "2",
      "pipe:1"
    ]);

    ytdlp.stdout.pipe(ffmpeg.stdin);

    const resource = createAudioResource(ffmpeg.stdout, {
      inputType: StreamType.Opus
    });

    connection.subscribe(player);
    player.play(resource);

    message.reply("🎵 Müzik başlatıldı.");
  }
};