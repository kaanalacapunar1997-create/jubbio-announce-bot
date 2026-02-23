module.exports = {
  name: "yardim",

  async execute(client, message) {

    const helpMessage = `
🎵 **Müzik Komutları**

!play <mp3 link>  → MP3 çalar
!pause            → Müziği duraklatır
!resume           → Müziği devam ettirir
!stop             → Müziği tamamen durdurur

🎲 **Eğlence Komutları**

!rol              → Rastgele sayı atar
!roller           → Zar atar

📌 Bot Railway üzerinde 7/24 çalışmaktadır.
`;

    message.reply(helpMessage);
  }
};