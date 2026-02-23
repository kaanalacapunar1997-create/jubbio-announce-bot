module.exports = {
  name: "rol",

  async execute(client, message, args) {

    const guild = client.guilds.cache.get(message.guildId);
    if (!guild) return message.reply("❌ Sunucu bulunamadı.");

    const authorMember = guild.members.cache.get(message.author.id);
    if (!authorMember) return message.reply("❌ Üye bilgisi alınamadı.");

    // Yetki kontrolü (isteğe bağlı)
    if (!authorMember.permissions.has("MANAGE_ROLES")) {
      return message.reply("❌ Rol verme yetkin yok.");
    }

    const mentionedUser = message.mentions?.users?.first?.();
    if (!mentionedUser) {
      return message.reply("❌ Bir kullanıcı etiketle.");
    }

    const targetMember = guild.members.cache.get(mentionedUser.id);
    if (!targetMember) {
      return message.reply("❌ Kullanıcı bulunamadı.");
    }

    const roleName = args.slice(1).join(" ");
    if (!roleName) {
      return message.reply("❌ Verilecek rol adını yaz.");
    }

    const role = guild.roles.cache.find(r => r.name === roleName);
    if (!role) {
      return message.reply("❌ Böyle bir rol bulunamadı.");
    }

    try {
      await targetMember.roles.add(role);
      message.reply(`✅ ${mentionedUser.username} kullanıcısına **${role.name}** rolü verildi.`);
    } catch (err) {
      console.error(err);
      message.reply("❌ Rol verilirken hata oluştu.");
    }
  }
};