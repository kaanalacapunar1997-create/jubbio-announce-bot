const { spawn } = require("child_process");
const { 
  joinVoiceChannel
} = require("@jubbio/voice");

module.exports = {
  name: "play",

  async execute(client, message, args) {

    const VOICE_CHANNEL_ID = "546336747034783744"; // SENİN ODA
    const GUILD_ID = message.guildId;

    // Önce kanala gir
    const connection = joinVoiceChannel({
      channelId: VOICE_CHANNEL_ID,
      guildId: GUILD_ID,
      adapterCreator: client.voice.adapters.get(GUILD_ID)
    });

    message.reply("🔊 Odaya girdim. yt-dlp test ediliyor...");

    // yt-dlp var mı test et
    const ytdlp = spawn("yt-dlp", ["--version"]);

    ytdlp.stdout.on("data", data => {
      console.log("STDOUT:", data.toString());
    });

    ytdlp.stderr.on("data", data => {
      console.log("STDERR:", data.toString());
    });

    ytdlp.on("close", code => {
      console.log("EXIT CODE:", code);
      message.reply("yt-dlp exit code: " + code);
    });

    ytdlp.on("error", err => {
      console.log("SPAWN ERROR:", err);
      message.reply("yt-dlp spawn error!");
    });
  }
};