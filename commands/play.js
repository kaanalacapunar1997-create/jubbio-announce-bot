const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType
} = require("@jubbio/voice");
const play = require("play-dl");

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

    if (!musicData.connection) {
      const adapterCreator = client.voice?.adapters?.get(message.guildId);
      if (!adapterCreator) {
        return message.reply("❌ Ses adaptörü bulunamadı.");
      }
      musicData.connection = joinVoiceChannel({
        channelId: userChannelId,
        guildId: message.guildId,
        adapterCreator
      });
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
        // youtu.be veya playlist linkinden video ID'sini çıkar
        let videoUrl = url;
        const ytMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (ytMatch) {
          videoUrl = `https://www.youtube.com/watch?v=${ytMatch[1]}`;
        }
        const stream = await play.stream(videoUrl);
        resource = createAudioResource(stream.stream, {
          inputType: stream.type
        });
        const info = await play.video_info(videoUrl);
        const title = info.video_details.title;
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
