module.exports = {
  name: "leave",

  async execute(client, message) {

    if (!client.musicConnection) {
      return message.reply("❌ Bot zaten ses kanalında değil.");
    }

    try {
      // Müziği durdur
      if (client.musicPlayer) {
        client.musicPlayer.stop();
      }

      // Kanaldan çık
      client.musicConnection.destroy();

      // Hafızayı temizle
      client.musicPlayer = null;
      client.musicConnection = null;

      message.reply("👋 Ses kanalından çıktım.");

    } catch (err) {
      console.error(err);
      message.reply("❌ Çıkarken hata oluştu.");
    }
  }
};