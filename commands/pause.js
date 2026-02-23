module.exports = {
  name: "pause",

  async execute(client, message) {

    const musicData = client.music?.[message.guildId];

    if (!musicData || !musicData.player) {
      return message.reply("❌ Çalan müzik yok.");
    }

    const success = musicData.player.pause();

    if (success) {
      message.reply("⏸️ Müzik duraklatıldı.");
    } else {
      message.reply("❌ Müzik zaten duraklatılmış.");
    }
  }
};