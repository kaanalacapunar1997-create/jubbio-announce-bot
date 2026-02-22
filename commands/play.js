const path = require("path");
const { 
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@jubbio/voice");

module.exports = {
  name: "play",

  async execute(client, message) {

    const VOICE_CHANNEL_ID = "546336747034783744";
    const GUILD_ID = message.guildId;

    const connection = joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: client.voice.adapters.get(GUILD_ID)
    });

    const player = createAudioPlayer();

    const filePath = path.join(__dirname, "test.wav");
    const resource = createAudioResource(filePath);

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log("🎵 TEST ÇALIYOR");
    });

    player.on("error", console.error);

    message.reply("🎶 Test çalıyor...");
  }
};