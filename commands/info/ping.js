module.exports = {
  name: "ping",
  aliases: ["p", "lat", "latency"],
  description: "Returns the average latency of the bot.",
  run: async (bot, message, args) => {
    let m = await message.channel.send("Pinging...");
    let ping = m.createdTimestamp
    m.edit(`Pong! **${ping - message.createdTimestamp}ms**`)
  }
}