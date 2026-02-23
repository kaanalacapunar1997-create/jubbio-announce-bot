module.exports = {
  name: "rol",

  async execute(client, message, args) {

    if (args.length < 2) {
      return message.reply("Kullanım: !rol @kullanıcı RolAdı");
    }

    // Etiketli kullanıcıyı al
    const mentioned = message.mentions?.users?.[0];
    if (!mentioned) {
      return message.reply("❌ Kullanıcıyı etiketle.");
    }

    const roleName = args.slice(1).join(" ");

    try {

      // Rolleri API'den çek
      const roles = await client.rest.getGuildRoles(message.guildId);
      const role = roles.find(r => r.name.toLowerCase() === roleName.toLowerCase());

      if (!role) {
        return message.reply("❌ Böyle bir rol yok.");
      }

      // Rolü ver
      await client.rest.addGuildMemberRole(
        message.guildId,
        mentioned.id,
        role.id
      );

      message.reply(`✅ ${mentioned.username} kullanıcısına **${role.name}** rolü verildi.`);

    } catch (err) {
      console.error("ROL HATASI:", err);
      message.reply("❌ Rol verilemedi.");
    }
  }
};