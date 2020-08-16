module.exports = {
  name: 'setprefix',
  aliases: ["sp", "prefix"],
  description: "Changes the prefix of the bot",
  run: async (client, message, args, Discord) => {
      
    const db = client.db
    const keys = require("../../keys");
    
    let prefix = await db.fetch(`prefix_${message.guild.id}`)
    if(prefix == undefined) prefix = process.env.prefix || keys.prefix;
    // Check if the member has the Manage Server permission. ---------- // IF not, send the message below.
    if(!message.member.hasPermission('MANAGE_GUILD')) return message.reply("you don't have enough permissions to change my prefix!");
    if(!args[0]) return message.reply("please define the new prefix you desire to set!");
    if(args[1]) return message.reply("prefixes with spaces are not allowed!")
    if(args[0].length > 3) return message.channel.send("No prefixes more than 3 characters!")

    if(args[0] === (process.env.prefix || keys.prefix)) {
      db.delete(`prefix_${message.guild.id}`)
      return await message.channel.send("The prefix has been reset successfully.")
    }
      
    await db.set(`prefix_${message.guild.id}`, args[0])
    message.channel.send(`**Prefix** is changed to \`${args[0]}\` successfully.`)
    }
}