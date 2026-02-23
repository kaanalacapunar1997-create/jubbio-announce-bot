module.exports = {
  name: "skip",

  async execute(client, message) {

    const musicData = client.music?.[message.guildId];
    if (!musicData) return message.reply("❌ Çalan müzik yok.");

    musicData.player.stop();

    message.reply("⏭️ Şarkı geçildi.");
  }
};