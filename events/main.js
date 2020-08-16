const keys = require("./../keys");
const Discord = require("discord.js");

module.exports = {
  name: "message",
  run: async (message, client) => {
    
    let db = client.db;
    if (message.channel.type == "dm") return; // Prevents DMs
    if (message.author.bot) return; // Prevents bots
    
    let prefix = await db.fetch(`prefix_${message.guild.id}`); // Get the PREFIX from the database.
    if (prefix == null) prefix = process.env.prefix || keys.prefix; // IF no PREFIX was found THEN the PREFIX is the defined prefix at keys.json
    
    if (!message.content.startsWith(prefix)) return; // IF a MESSAGE doesn't start WITH the PREFIX, don't operate.
    
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (!message.member) message.member = await message.guild.fetchMember(message); // Fetch new members.
    const cmd = args.shift().toLowerCase() // Make it case insensitive
    if (cmd.length === 0) return;
    // Get the CMD \\ Command
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd))
    if (command) command.run(client, message, args, Discord)
  }
}