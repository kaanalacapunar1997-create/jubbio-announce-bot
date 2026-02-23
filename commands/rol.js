module.exports = {
  name: "rol",

  async execute(client, message, args) {

    if (!message.member.permissions?.has("MANAGE_ROLES")) {
      return message.reply("❌ Rol verme yetkin yok.");
    }

    const user = message.mentions?.users?.first?.();
    if (!user) {
      return message.reply("❌ Bir kullanıcı etiketle.");
    }

    const roleName = args.slice(1).join(" ");
    if (!roleName) {
      return message.reply("❌ Verilecek rol adını yaz.");
    }

    const guild = client.guilds.cache.get(message.guildId);
    const member = guild.members.cache.get(user.id);
    const role = guild.roles.cache.find(r => r.name === roleName);

    if (!role) {
      return message.reply("❌ Böyle bir rol bulunamadı.");
    }

    try {
      await member.roles.add(role);
      message.reply(`✅ ${user.username} kullanıcısına **${role.name}** rolü verildi.`);
    } catch (err) {
      console.error(err);
      message.reply("❌ Rol verilirken hata oluştu.");
    }
  }
};