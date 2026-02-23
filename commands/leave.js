module.exports = {
  name: "leave",

  async execute(client, message) {

    if (!client.musicConnection) {
      return message.reply("❌ Bot zaten ses kanalında değil.");
    }

    try {
      client.musicPlayer?.stop();
      client.musicConnection.destroy();

      client.musicConnection = null;
      client.musicPlayer = null;

      message.reply("👋 Ses kanalından çıktım.");
    } catch (err) {
      console.error(err);
      message.reply("❌ Çıkarken hata oluştu.");
    }
  }
};