module.exports = {
  name: "stop",

  async execute(client, message) {

    const musicData = client.music?.[message.guildId];
    if (!musicData) return message.reply("❌ Çalan müzik yok.");

    musicData.queue = [];
    musicData.player.stop();
    musicData.connection.destroy();

    delete client.music[message.guildId];

    message.reply("⏹️ Müzik durduruldu.");
  }
};