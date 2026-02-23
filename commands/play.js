const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType
} = require("@jubbio/voice");
const play = require("play-dl");
const { spawn } = require("child_process");

module.exports = {
  name: "play",

  async execute(client, message, args) {

    if (!args[0]) {
      return message.reply("❌ YouTube linki veya .mp3 linki gir.");
    }

    const url = args[0];

    const userChannelId = client.voiceStates.get(message.author.id)
      || message.member?.voice?.channelId
      || "546336747034783744";

    if (!client.music) client.music = {};

    if (!client.music[message.guildId]) {
      client.music[message.guildId] = {
        connection: null,
        player: null
      };
    }

    const musicData = client.music[message.guildId];

    // Bağlantı yoksa veya destroy edilmişse yeniden bağlan
    if (!musicData.connection || musicData.connection.state?.status === "destroyed") {
      musicData.connection = joinVoiceChannel({
        channelId: userChannelId,
        guildId: message.guildId,
        adapterCreator: client.voice?.adapters?.get(message.guildId)
      });
      musicData.player = null;
    }

    if (!musicData.player) {
      musicData.player = createAudioPlayer();
      musicData.connection.subscribe(musicData.player);
    }

    let resource;

    if (url.endsWith(".mp3")) {
      resource = createAudioResource(url);
      message.reply("🎵 MP3 çalıyor!");
    } else if (["video", "playlist"].includes(play.yt_validate(url))) {
      try {
        const ytMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        const videoUrl = ytMatch
          ? `https://www.youtube.com/watch?v=${ytMatch[1]}`
          : url;

        // yt-dlp ile başlık al
        const titleProc = spawn("yt-dlp", ["--get-title", "--no-playlist", videoUrl]);
        const title = await new Promise((resolve) => {
          let out = "";
          titleProc.stdout.on("data", d => out += d.toString());
          titleProc.on("close", () => resolve(out.trim() || "Bilinmeyen"));
        });

        // yt-dlp ile direkt ses URL'ini al (HLS değil, direkt m4a/webm)
        const audioUrl = await new Promise((resolve, reject) => {
          const proc = spawn("yt-dlp", [
            "-f", "140/bestaudio[protocol!=m3u8][protocol!=m3u8_native]",
            "--no-playlist",
            "--get-url",
            videoUrl
          ]);
          let out = "";
          proc.stdout.on("data", d => out += d.toString());
          proc.stderr.on("data", () => {});
          proc.on("close", code => {
            const url = out.trim().split("\n")[0];
            if (url) resolve(url);
            else reject(new Error("URL alınamadı"));
          });
        });

        resource = createAudioResource(audioUrl);
        message.reply(`🎵 Çalıyor: **${title}**`);
      } catch (err) {
        console.error("YouTube hata:", err);
        return message.reply("❌ YouTube videosu yüklenemedi.");
      }
    } else {
      return message.reply("❌ Geçersiz link. YouTube veya .mp3 linki gir.");
    }

    musicData.player.play(resource);

    musicData.player.once(AudioPlayerStatus.Idle, () => {
      console.log("🎵 Şarkı bitti.");
    });
  }
};
