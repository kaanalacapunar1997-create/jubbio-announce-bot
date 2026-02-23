module.exports = {
  name: "yardim",

  async execute(client, message) {

    const helpMessage = `
🎵 **Müzik Komutları**

!play <mp3 link> → Müzik çalar
!pause → Müziği duraklatır
!resume → Müziği devam ettirir
!stop → Müziği tamamen durdurur
!leave → Ses kanalından çıkar

👑 **Rol Komutları**

!rol <kullanıcıID> <rolID> → Kullanıcıya rol verir
!roller → Özel rolleri oluşturur

⚙️ **Diğer**

!ping → Bot gecikmesini gösterir
!yardim → Bu menüyü gösterir
`;

    message.reply(helpMessage);
  }
};