module.exports = {
  name: "roller",

  async execute(client, message) {

    const guildId = message.guildId;

    try {

      const response = await client.rest.request(
        "GET",
        `/bot/guilds/${guildId}/roles`
      );

      console.log("ROLLER RESPONSE:", response);

      // Eğer response.data varsa onu kullan
      const existingRoles = Array.isArray(response)
        ? response
        : response.data || [];

      const createRole = async (name, color) => {

        const found = existingRoles.find(r => r.name === name);

        if (found) {
          console.log(`ROL ZATEN VAR: ${found.name} → ${found.id}`);
          return found;
        }

        const role = await client.rest.request(
          "POST",
          `/bot/guilds/${guildId}/roles`,
          { name, color }
        );

        console.log(`ROL OLUŞTU: ${role.name} → ${role.id}`);
        return role;
      };

      await createRole("📜 Çırak", 0x3A3A3A);
      await createRole("🏛 Konsey", 0x2F2F2F);

      message.reply("✅ Roller kontrol edildi.");

    } catch (err) {
      console.error("ROL HATA:", err);
      message.reply("❌ Rol işlemi sırasında hata oluştu.");
    }
  }
};