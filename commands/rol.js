module.exports = {
  name: "rol",

  async execute(client, message, args) {

    if (!args[0]) {
      return message.reply("❌ Kullanıcı ID yaz.");
    }

    if (!args[1]) {
      return message.reply("❌ Rol ID yaz.");
    }

    const userId = args[0];
    const roleId = args[1];

    try {

      await client.rest.addGuildMemberRole(
        message.guildId,
        userId,
        roleId
      );

      message.reply("✅ Rol başarıyla verildi.");

    } catch (err) {
      console.error("ROL HATA:", err);
      message.reply("❌ Rol verilemedi.");
    }
  }
};