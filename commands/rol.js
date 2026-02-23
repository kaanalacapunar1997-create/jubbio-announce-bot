module.exports = {
  name: "rol",

  async execute(client, message, args) {

    const guildId = message.guildId;
    const roleName = args.join(" ");

    if (!roleName)
      return message.reply("Rol ismi yaz.");

    try {

      // Rolleri çek
      const roles = await client.rest.request(
        "GET",
        `/bot/guilds/${guildId}/roles`
      );

      const role = roles.find(r =>
        r.name.toLowerCase() === roleName.toLowerCase()
      );

      if (!role)
        return message.reply("Rol bulunamadı.");

      await client.rest.request(
        "PUT",
        `/bot/guilds/${guildId}/members/${message.author.id}/roles/${role.id}`
      );

      message.reply(`✅ ${role.name} rolü verildi!`);

    } catch (err) {
      console.error("ROL VERME HATA:", err);
      message.reply("❌ Rol verilirken hata oluştu.");
    }
  }
};