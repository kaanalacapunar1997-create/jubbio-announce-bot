module.exports = {
  name: "rol",

  async execute(client, message, args) {

    if (!args.length) {
      return message.reply("Kullanım: !rol @kullanıcı RolAdı");
    }

    const guild = client.guilds.cache.get(message.guildId);
    if (!guild) return message.reply("❌ Sunucu bulunamadı.");

    // Etiketli kullanıcıyı al
    const mentioned = message.mentions?.users?.first?.();
    if (!mentioned) {
      return message.reply("❌ Kullanıcıyı etiketle.");
    }

    const roleName = args.slice(1).join(" ");
    if (!roleName) {
      return message.reply("❌ Rol adını yaz.");
    }

    try {

      // Rolleri fetch et (önemli)
      await guild.roles.fetch();

      const role = guild.roles.cache.find(
        r => r.name.toLowerCase() === roleName.toLowerCase()
      );

      if (!role) {
        return message.reply("❌ Böyle bir rol yok.");
      }

      const member = await guild.members.fetch(mentioned.id);

      await member.roles.add(role);

      message.reply(`✅ ${mentioned.username} kullanıcısına **${role.name}** rolü verildi.`);

    } catch (err) {
      console.error("ROL HATASI:", err);
      message.reply("❌ Rol verilemedi.");
    }
  }
};