const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require("@jubbio/voice");
const { spawn } = require("child_process");

module.exports = {
  name: "play",
  async execute(client, message, args) {

    const url = args[0];
    if (!url) return message.reply("Link gir.");

    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) return message.reply("Odaya gir.");

    // 1️⃣ Bağlan
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    // 2️⃣ Player oluştur
    const player = createAudioPlayer();

    // 3️⃣ yt-dlp + ffmpeg stream
    const ytdlp = spawn("yt-dlp", ["-f", "bestaudio", "-o", "-", url]);
    const ffmpeg = spawn("ffmpeg", [
      "-i", "pipe:0",
      "-f", "s16le",
      "-ar", "48000",
      "-ac", "2",
      "pipe:1"
    ]);

    ytdlp.stdout.pipe(ffmpeg.stdin);

    // 4️⃣ Resource oluştur
    const resource = createAudioResource(ffmpeg.stdout, {
      inlineVolume: true
    });

    // 5️⃣ Subscribe OLMAZSA SES GELMEZ
    connection.subscribe(player);

    // 6️⃣ Çal
    player.play(resource);

    message.reply("Çalıyor...");
  }
};