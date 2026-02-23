module.exports = {
  name: "stop",

  async execute(client, message) {

    const musicData = client.music?.[message.guildId];

    if (!musicData || !musicData.player) {
      return message.reply("❌ Çalan müzik yok.");
    }

    musicData.player.stop();

    message.reply("⏹️ Müzik durduruldu.");
  }
};