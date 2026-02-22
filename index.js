require("dotenv").config();
const { Client } = require("@jubbio/core");
const playCommand = require("./commands/play");

const client = new Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "MESSAGE_CONTENT",
    "GUILD_VOICE_STATES"
  ]
});

client.on("ready", () => {
  console.log(`${client.user.username} aktif!`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "play") {
    playCommand.execute(client, message, args);
  }
});

client.login(process.env.TOKEN);