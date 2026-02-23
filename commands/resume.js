module.exports = {
  name: "resume",

  async execute(client, message) {

    const musicData = client.music?.[message.guildId];

    if (!musicData || !musicData.player) {
      return message.reply("❌ Devam edecek müzik yok.");
    }

    musicData.player.unpause();

    message.reply("▶️ Müzik devam ediyor.");
  }
};