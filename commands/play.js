const { spawn } = require("child_process");
const path = require("path");

const filePath = path.join(__dirname, "song.mp3");

const ytdlp = spawn("yt-dlp", [
  "-x",
  "--audio-format",
  "mp3",
  "-o",
  filePath,
  url
]);

ytdlp.stdout.on("data", data => {
  console.log("YTDLP STDOUT:", data.toString());
});

ytdlp.stderr.on("data", data => {
  console.log("YTDLP STDERR:", data.toString());
});

ytdlp.on("error", err => {
  console.log("SPAWN ERROR:", err);
});

ytdlp.on("close", async (code) => {
  console.log("YTDLP CLOSED WITH CODE:", code);

  if (code !== 0) {
    return message.reply("❌ İndirme başarısız.");
  }

  message.reply("Çalıyor...");

  const resource = createAudioResource(filePath);
  player.play(resource);
});