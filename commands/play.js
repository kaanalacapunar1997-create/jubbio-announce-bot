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

    try {

      const url = args[0];
      if (!url) return message.reply("Link gir.");

      // ✅ Voice state cache'ten al
      const voiceState = client.voiceStates.get(message.author.id);
      const voiceChannelId = voiceState?.channel_id;

      if (!voiceChannelId)
        return message.reply("Odaya gir.");

      // ✅ Voice kanalına bağlan
      const connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: message.guild_id,
        adapterCreator: client.voice.adapters.get(message.guild_id)
      });

      const player = createAudioPlayer();

      // ✅ yt-dlp
      const ytdlp = spawn("yt-dlp", ["-f", "bestaudio", "-o", "-", url]);

      // ✅ ffmpeg -> opus
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

      message.reply("Çalıyor...");

    } catch (err) {
      console.error(err);
      message.reply("❌ Hata oluştu.");
    }
  }
};