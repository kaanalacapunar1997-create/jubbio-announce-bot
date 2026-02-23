module.exports = {
  name: "kur",

  async execute(client, message) {

    const guildId = message.guildId;
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    try {

      const create = async (data) => {
        const ch = await client.rest.request(
          "POST",
          `/bot/guilds/${guildId}/channels`,
          data
        );
        await sleep(1200);
        return ch;
      };

      // =========================
      // ANA ALAN
      // =========================
      await create({ name: "━━━ 📢 ANA ALAN ━━━", type: 0 });
      await create({ name: "duyurular", type: 0 });
      await create({ name: "genel-chat", type: 0 });
      await create({ name: "oyun-sohbet", type: 0 });
      await create({ name: "klip-paylasim", type: 0 });

      // =========================
      // TOPLULUK
      // =========================
      await create({ name: "━━━ 🤝 TOPLULUK ━━━", type: 0 });
      await create({ name: "takim-bul", type: 0 });
      await create({ name: "strateji", type: 0 });
      await create({ name: "turnuva", type: 0 });

      // =========================
      // SES ODALARI
      // =========================
      await create({ name: "Genel Ses 1", type: 2 });
      await create({ name: "Genel Ses 2", type: 2 });
      await create({ name: "Ranked Oda", type: 2 });
      await create({ name: "Turnuva Odasi", type: 2 });

      message.reply("🔥 WTCN tarzı sunucu kuruldu!");

    } catch (err) {
      console.error("WTCN HATA:", err);
      message.reply("❌ Kurulum sırasında hata oluştu.");
    }
  }
};