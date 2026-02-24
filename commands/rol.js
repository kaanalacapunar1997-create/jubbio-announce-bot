module.exports = {
  name: "rol",

  async execute(client, message, args) {

    if (args.length < 2) {
      return message.reply("Kullanım: !rol @kullanıcı <rol adı>");
    }

    // Kullanıcı ID'sini mention'dan çıkar
    const userMention = args[0];
    const userId = userMention.replace(/[<@>]/g, "");

    // Rol adını birleştir (birden fazla kelime olabilir)
    const roleName = args.slice(1).join(" ").toLowerCase();

    try {
      // Sunucudaki rolleri çek
      const response = await client.rest.request(
        "GET",
        `/bot/guilds/${message.guildId}/roles`
      );

      const roles = Array.isArray(response)
        ? response
        : response.data || response.roles || [];

      // Emoji ve özel karakterleri temizleyerek karşılaştır
      const stripEmoji = str => str.replace(/[\u{1F000}-\u{1FFFF}|\u{2600}-\u{27BF}|\uFE0F|\u200D]/gu, "").trim().toLowerCase();
      const role = roles.find(r => stripEmoji(r.name) === stripEmoji(roleName) || r.name.toLowerCase().includes(roleName));

      if (!role) {
        return message.reply(`❌ "${args.slice(1).join(" ")}" adında bir rol bulunamadı.`);
      }

      await client.rest.request(
        "PUT",
        `/bot/guilds/${message.guildId}/members/${userId}/roles/${role.id}`
      );

      message.reply(`✅ <@${userId}> kullanıcısına **${role.name}** rolü verildi.`);

    } catch (err) {
      console.error("ROL HATASI:", err);
      message.reply("❌ Rol verilemedi.");
    }
  }
};
