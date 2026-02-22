const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType
} = require("@jubbio/voice");

const { spawn } = require("child_process");

module.exports = {
  name: "play",
  async execute(client, message, args) {

    const url = args[0];
    if (!url) return message.reply("Link gir.");

    // 🔥 JUBBIO DOĞRU YÖNTEM
    const voiceState = client.voiceStates.get(message.author.id);
    const voiceChannelId = voiceState?.channel_id;

    if (!voiceChannelId)
      return message.reply("Odaya gir.");

    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
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

    message.reply("🎵 Çalıyor...");
  }
};