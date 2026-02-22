console.log("AUTHOR:", message.author);
console.log("MEMBER:", message.member);
console.log("VOICE FIELD:", message.voice_channel_id);
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

      // 🔥 Jubbio'da voice channel id genelde burada olur
      const voiceChannelId = message.voice_channel_id || message.member?.voice_channel_id;

      if (!voiceChannelId)
        return message.reply("Odaya gir.");

      const connection = joinVoiceChannel({
        channelId: voiceChannelId,
        guildId: message.guild_id,
        adapterCreator: client.voice.adapters.get(message.guild_id)
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

      message.reply("Çalıyor...");

    } catch (err) {
      console.error(err);
      message.reply("❌ Hata oluştu.");
    }
  }
};