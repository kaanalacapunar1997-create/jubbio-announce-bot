module.exports = {
  name: "rol",

  async execute(client, message, args) {

    if (args.length < 2) {
      return message.reply("Kullanım: !rol <kullanıcıID> <rolID>");
    }

    const userId = args[0];
    const roleId = args[1];

    try {

      await client.rest.request(
        "PUT",
        `/bot/guilds/${message.guildId}/members/${userId}/roles/${roleId}`
      );

      message.reply("✅ Rol başarıyla verildi.");

    } catch (err) {
      console.error("ROL HATASI:", err);
      message.reply("❌ Rol verilemedi.");
    }
  }
};