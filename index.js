require("dotenv").config();
const { Client, GatewayIntentBits } = require("@jubbio/core");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

// 🔥 BURAYA TAŞI
client.musicPlayer = null;
client.musicConnection = null;
require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("@jubbio/core");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith("!")) return;

  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  command.execute(client, message, args);
});

client.once("ready", () => {
  console.log("✅ Bot hazır!");
});
// 🔥 Manuel voice cache
client.userVoiceChannels = new Map();

client.on("voiceStateUpdate", (oldState, newState) => {
  if (newState.userId && newState.channelId) {
    client.userVoiceChannels.set(newState.userId, newState.channelId);
  }

  if (newState.userId && !newState.channelId) {
    client.userVoiceChannels.delete(newState.userId);
  }
});
client.login(process.env.BOT_TOKEN);
client.on("voiceStateUpdate", (oldState, newState) => {
  console.log("Voice Update:", newState);
});client.once("ready", () => {
  console.log("✅ Bot hazır!");
  console.log("Voice adapters:", client.voice.adapters);
});