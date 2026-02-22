const { spawn } = require("child_process");
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

    const VOICE_CHANNEL_ID = "546336747034783744"; // SENİN ODA ID
    const GUILD_ID = message.guildId;

    const connection = joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: client.voice.adapters.get(GUILD_ID)
    });

    const player = createAudioPlayer();

    const ytdlp = spawn("yt-dlp", [
      "-f", "bestaudio",
      "-o", "-",
      args[0]
    ]);

    ytdlp.stderr.on("data", data => {
      console.log("yt-dlp:", data.toString());
    });

    const resource = createAudioResource(ytdlp.stdout, {
      inputType: StreamType.Arbitrary
    });

    player.play(resource);
    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
      console.log("🎵 Çalıyor!");
    });

    player.on("error", (err) => {
      console.error("Player error:", err);
    });

    message.reply("🎶 Çalıyor...");
  }
};