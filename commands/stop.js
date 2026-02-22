module.exports = {
  name: "stop",

  async execute(client, message) {

    if (!client.musicPlayer) {
      return message.reply("❌ Çalan müzik yok.");
    }

    client.musicPlayer.stop();

    message.reply("⏹ Müzik durduruldu.");
  }
};