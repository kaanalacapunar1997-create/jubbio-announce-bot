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
      return message.reply("YouTube linki veya .mp3 linki gir.");
    }

    const url = args[0];

    const userChannelId = client.voiceStates.get(message.author.id);
    if (!userChannelId) {
      return message.reply("Once bir ses kanalina gir.");
    }

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
        return message.reply("Ses adaptoru bulunamadi.");
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
      message.reply("MP3 caliyor!");
    } else if (play.yt_validate(url) === "video") {
      try {
        const stream = await play.stream(url);
        resource = createAudioResource(stream.stream, {
          inputType: stream.type
        });
        const info = await play.video_info(url);
        const title = info.video_details.title;
        message.reply(`Caliyor: **${title}**`);
      } catch (err) {
        console.error("YouTube hata:", err);
        return message.reply("YouTube videosu yuklenemedi.");
      }
    } else {
      return message.reply("Gecersiz link. YouTube veya .mp3 linki gir.");
    }

    musicData.player.play(resource);

    musicData.player.once(AudioPlayerStatus.Idle, () => {
      console.log("Sarki bitti.");
    });
  }
};