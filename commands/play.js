const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus
} = require("@jubbio/voice");

const play = require("play-dl");

module.exports = {
  name: "play",

  async execute(client, message, args) {

    if (!args[0]) {
      return message.reply("❌ SoundCloud linki gir.");
    }

    const url = args[0];

    const validation = await play.so_validate(url);
    if (!validation || validation !== "track") {
      return message.reply("❌ Geçerli bir SoundCloud linki değil.");
    }

    const userVoiceChannelId = client.voiceStates.get(message.author.id);

    if (!userVoiceChannelId) {
      return message.reply("❌ Önce bir ses kanalına gir.");
    }

    if (!client.music) client.music = {};

    if (!client.music[message.guildId]) {
      client.music[message.guildId] = {
        queue: [],
        playing: false,
        connection: null,
        player: null
      };
    }

    const musicData = client.music[message.guildId];

    musicData.queue.push(url);
    message.reply("🎵 Şarkı kuyruğa eklendi.");

    if (musicData.playing) return;

    async function playNext() {

      if (musicData.queue.length === 0) {
        musicData.playing = false;
        return;
      }

      musicData.playing = true;

      const nextUrl = musicData.queue.shift();

      if (!musicData.connection) {
        musicData.connection = joinVoiceChannel({
          channelId: userVoiceChannelId,
          guildId: message.guildId,
          adapterCreator: client.voice.adapters.get(message.guildId)
        });
      }

      if (!musicData.player) {
        musicData.player = createAudioPlayer();
        musicData.connection.subscribe(musicData.player);
      }

      try {
        const stream = await play.stream(nextUrl);

        const resource = createAudioResource(stream.stream, {
          inputType: stream.type
        });

        musicData.player.play(resource);

        musicData.player.once(AudioPlayerStatus.Idle, () => {
          playNext();
        });

      } catch (err) {
        console.error(err);
        playNext();
      }
    }

    playNext();
  }
};