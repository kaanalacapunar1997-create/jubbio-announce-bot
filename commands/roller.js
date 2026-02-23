module.exports = {
  name: "roller",

  async execute(client, message) {

    const guildId = message.guildId;
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    try {

      const createRole = async (name, color) => {
        const role = await client.rest.request(
          "POST",
          `/bot/guilds/${guildId}/roles`,
          { name, color }
        );
        await sleep(1000);
        return role;
      };

      await createRole("📜 Çırak", 0x3A3A3A);
      await createRole("🕶 Tetkikçi", 0x1C1C1C);
      await createRole("🗡 Fedai", 0x000000);
      await createRole("🔫 Operasyon", 0x8B0000);
      await createRole("🩸 İnfaz", 0xB22222);
      await createRole("🧠 Akıl Odası", 0x4B0082);
      await createRole("🏛 Konsey", 0x2F2F2F);
      await createRole("👑 Baron", 0xFFD700);

      message.reply("🕴 Kurtlar Vadisi elit rolleri oluşturuldu.");

    } catch (err) {
      console.error("ROL HATA:", err);
      message.reply("❌ Rol oluşturulurken hata oluştu.");
    }
  }
};