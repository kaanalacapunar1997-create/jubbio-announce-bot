const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@jubbio/voice");

// 🎯 Müzik ses kanalının ID'si
const VOICE_CHANNEL_ID = "546336747034783744";

module.exports = {
  name: "play",

  async execute(client, message, args) {

    if (!args[0]) {
      return message.reply("❌ Direkt .mp3 linki gir.");
    }

    const url = args[0];

    if (!url.endsWith(".mp3")) {
      return message.reply("❌ Sadece .mp3 link destekleniyor.");
    }

    if (!client.music) client.music = {};

    if (!client.music[message.guildId]) {
      client.music[message.guildId] = {
        connection: null,
        player: null
      };
    }

    const musicData = client.music[message.guildId];

    // Ses kanalına bağlan
    if (!musicData.connection) {
      musicData.connection = joinVoiceChannel({
        channelId: VOICE_CHANNEL_ID,
        guildId: message.guildId,
        adapterCreator: client.voice.adapters.get(message.guildId)
      });
    }

    // Player oluştur
    if (!musicData.player) {
      musicData.player = createAudioPlayer();
      musicData.connection.subscribe(musicData.player);
    }

    const resource = createAudioResource(url);

    musicData.player.play(resource);

    musicData.player.once(AudioPlayerStatus.Idle, () => {
      console.log("🎵 Şarkı bitti.");
    });

    message.reply("🎵 MP3 çalıyor!");
  }
};