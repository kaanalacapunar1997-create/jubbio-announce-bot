module.exports = {
  name: "roller",

  async execute(client, message) {

    const guildId = message.guildId;

    try {
      const response = await client.rest.request(
        "GET",
        `/bot/guilds/${guildId}/roles`
      );

      console.log("ROLLER API YANIT:", JSON.stringify(response));

      const roles = Array.isArray(response)
        ? response
        : response.data || response.roles || [];

      if (roles.length === 0) {
        return message.reply("Sunucuda hiç rol bulunamadı.");
      }

      const list = roles
        .filter(r => r.name !== "@everyone")
        .map(r => `${r.name} → ID: ${r.id}`)
        .join("\n");

      message.reply(`**Sunucu Rolleri:**\n${list}`);

    } catch (err) {
      console.error("ROL HATA:", err);
      message.reply("❌ Roller alınırken hata oluştu.");
    }
  }
};
