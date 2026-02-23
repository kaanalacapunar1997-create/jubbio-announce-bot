module.exports = {
  name: "yardim",

  async execute(client, message) {

    const helpMessage = `
📖 **Bot Komutları**

🎵 !play <link>
→ Şarkı çalar

⏹ !stop
→ Müziği durdurur

👋 !leave
→ Ses kanalından çıkar

📖 !yardim
→ Bu mesajı gösterir
`;

    message.reply(helpMessage);
  }
};