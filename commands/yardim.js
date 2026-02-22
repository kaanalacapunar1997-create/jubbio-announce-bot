module.exports = {
  name: "yardim",
  execute(message) {
    const commandList = message.client.commands.map(cmd => `!${cmd.name}`).join("\n");

    message.reply(
      `📌 **Komut Listesi**\n\n${commandList}`
    );
  }
};