module.exports = {
  name: "rol",

  async execute(client, message, args) {

    if (args.length < 2) {
      return message.reply("Kullanım: !rol <kullanıcıID> <RolAdı>");
    }

    const guild = client.guilds.cache.get(message.guildId);
    if (!guild) return message.reply("❌ Sunucu bulunamadı.");

    const userId = args[0];
    const roleName = args.slice(1).join(" ");

    try {
      // Rolleri REST ile çekiyoruz (cache yerine)
      const roles = await client.rest.getGuildRoles(message.guildId);
      const role = roles.find(r => r.name === roleName);

      if (!role) {
        return message.reply("❌ Böyle bir rol bulunamadı.");
      }

      await client.rest.addGuildMemberRole(
        message.guildId,
        userId,
        role.id
      );

      message.reply(`✅ ${roleName} rolü başarıyla verildi.`);
    } catch (err) {
      console.error("ROL HATA:", err);
      message.reply("❌ Rol verilemedi.");
    }
  }
};