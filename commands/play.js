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

      // ✅ Guild member'ı fetch et
      const member = await message.guild.members.fetch(message.author.id);
      const voiceChannel = member.voice?.channel;

      if (!voiceChannel) 
        return message.reply("Odaya gir.");

      // ✅ Bağlan
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: message.guild.id,
        adapterCreator: message.guild.voiceAdapterCreator
      });

      const player = createAudioPlayer();

      // ✅ yt-dlp stream
      const ytdlp = spawn("yt-dlp", ["-f", "bestaudio", "-o", "-", url]);

      // ✅ ffmpeg opus output
      const ffmpeg = spawn("ffmpeg", [
        "-i", "pipe:0",
        "-f", "opus",
        "-ar", "48000",
        "-ac", "2",
        "pipe:1"
      ]);

      ytdlp.stdout.pipe(ffmpeg.stdin);

      const resource = createAudioResource(ffmpeg.stdout, {
        inputType: StreamType.Opus,
        inlineVolume: true
      });

      connection.subscribe(player);
      player.play(resource);

      message.reply("Çalıyor...");

    } catch (err) {
      console.error(err);
      message.reply("❌ Komut çalıştırılırken hata oluştu.");
    }
  }
};