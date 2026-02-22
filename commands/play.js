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

   const voiceChannel = message.author.voice?.channel;
    if (!voiceChannel) return message.reply("Odaya gir.");

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    const player = createAudioPlayer();

    const ytdlp = spawn("yt-dlp", ["-f", "bestaudio", "-o", "-", url]);

    const ffmpeg = spawn("ffmpeg", [
      "-i", "pipe:0",
      "-f", "opus",          // 🔥 BURASI DEĞİŞTİ
      "-ar", "48000",
      "-ac", "2",
      "pipe:1"
    ]);

    ytdlp.stdout.pipe(ffmpeg.stdin);

    const resource = createAudioResource(ffmpeg.stdout, {
      inputType: StreamType.Opus,  // 🔥 EN KRİTİK SATIR
      inlineVolume: true
    });

    connection.subscribe(player);
    player.play(resource);

    message.reply("Çalıyor...");
  }
};