module.exports = {
  name: "yardim",

  async execute(client, message) {

    const helpMessage = `
**Muzik Komutlari**

!play <youtube linki> - YouTube videosu calar
!play <mp3 linki> - MP3 calar
!pause - Muzigi duraklatir
!resume - Muzigi devam ettirir
!skip - Sarkiyi gecer
!stop - Muzigi tamamen durdurur
!leave - Ses kanalindan cikar

**Rol Komutlari**

!rol <kullaniciID> <rolID> - Kullaniciya rol verir
!roller - Ozel rolleri olusturur

**Diger**

!ping - Bot gecikmesini gosterir
!yardim - Bu menuyu gosterir
`;

    message.reply(helpMessage);
  }
};
