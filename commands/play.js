const { 
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@jubbio/voice");

module.exports = {
  name: "play",

  async execute(client, message, args) {

    if (!args[0]) {
      return message.reply("❌ Link gir.");
    }

    const VOICE_CHANNEL_ID = "546336747034783744";
    const GUILD_ID = message.guildId;

    const connection = joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: client.voice.adapters.get(GUILD_ID)
    });

    const player = createAudioPlayer();

    // SADECE URL VER
    const resource = createAudioResource(args[0]);

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log("🎵 Çalıyor!");
    });

    player.on("error", console.error);

    message.reply("🎶 Çalıyor...");
  }
};