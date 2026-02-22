const { 
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType
} = require("@jubbio/voice");

module.exports = {
  name: "play",

  async execute(client, message, args) {

    if (!args[0]) {
      return message.reply("❌ Link gir.");
    }

    const VOICE_CHANNEL_ID = "546336747034783744";

    const connection = joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: message.guildId,
      adapterCreator: client.voice.adapters.get(message.guildId)
    });

    const player = createAudioPlayer();

    const resource = createAudioResource(args[0], {
      inputType: StreamType.Raw,
      inlineVolume: false
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log("🎵 RAW PCM Çalıyor!");
    });

    player.on("error", console.error);

    message.reply("🎶 RAW mod test...");
  }
};