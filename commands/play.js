const { 
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType
} = require("@jubbio/voice");

const MUSIC_CHANNEL_ID = "546336747034783744"; // 👈 değiştir

module.exports = {
  name: "play",

  async execute(client, message, args) {

    if (!args[0]) {
      return message.reply("❌ Link gir.");
    }

    const connection = joinVoiceChannel({
      channelId: MUSIC_CHANNEL_ID,
      guildId: message.guildId,
      adapterCreator: client.voice.adapters.get(message.guildId)
    });

    const player = createAudioPlayer();

    client.musicPlayer = player;
    client.musicConnection = connection;

    const resource = createAudioResource(args[0], {
      inputType: StreamType.Raw
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log("🎵 Çalıyor!");
    });

    player.on("error", console.error);

    message.reply("🎶 Çalmaya başladım!");
  }
};