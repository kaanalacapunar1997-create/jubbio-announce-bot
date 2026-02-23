module.exports = {
  name: "yardim",

  async execute(client, message) {

    const helpMessage = `
🎵 **Müzik Komutları**
\`!play <mp3 link>\` → Müzik çalar
\`!pause\` → Müziği duraklatır
\`!resume\` → Müziği devam ettirir
\`!stop\` → Müziği tamamen durdurur
\`!skip\` → Sıradaki şarkıya geçer
\`!leave\` → Ses kanalından çıkar

👑 **Rol Komutları**
\`!roller\` → Özel rolleri oluşturur
\`!rol <kullanıcıID> <rolID>\` → Kullanıcıya rol verir

⚙️ **Diğer Komutlar**
\`!ping\` → Bot gecikmesini gösterir
\`!kur\` → Sistem kurulumunu yapar
\`!yardim\` → Bu menüyü gösterir
`;

    message.reply(helpMessage);
  }
};