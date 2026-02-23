module.exports = {
  name: "leave",

  async execute(client, message) {

    const musicData = client.music?.[message.guildId];

    if (!musicData || !musicData.connection) {
      return message.reply("❌ Bot zaten ses kanalında değil.");
    }

    try {
      // Player durdur
      if (musicData.player) {
        musicData.player.stop();
      }

      // Bağlantıyı kapat
      musicData.connection.destroy();

      // Sunucu müzik verisini temizle
      delete client.music[message.guildId];

      message.reply("👋 Ses kanalından ayrıldım.");

    } catch (err) {
      console.error(err);
      message.reply("⚠️ Çıkarken hata oluştu.");
    }
  }
};