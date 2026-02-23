module.exports = {
  name: "rol",

  async execute(client, message) {

    const random = Math.floor(Math.random() * 100) + 1;

    message.reply(`🎲 Attığın sayı: **${random}**`);
  }
};