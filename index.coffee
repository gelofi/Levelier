keys =
  token: ""
  prefix: "!"
  hexodb: ""

# Set up your credentials above!
# Or set it up at the .env file!

# Client Requirements
Discord = require "discord.js"
bot = new Discord.Client disableMentions: "everyone"
# Cooldown
cooldown = new Set()
cooldownTime = 30 * 1000
# Database
Hexo = require "hexo-db"
db = new Hexo.Database process.env.hexodb or keys.hexodb

bot.on "ready", () -> console.log "#{bot.user.username} is now online!"

bot.on "message", (message) ->
  
  if message.channel.type is "dm" then return # Ignore DMs
  if message.author.bot then return # Ignore bots

  # XP Function!
  # This will catch messages and give out random XP
  # to talking members.
  
  xp = (message) ->
    try
      if cooldown.has message.author.id then return
      cooldown.add message.author.id
      randXP = Math.floor(Math.random() * 14) + 1
      XP = await db.get "xp_#{message.guild.id}_#{message.author.id}"
      if XP == null then await db.set "xp_#{message.guild.id}_#{message.author.id}", 1
      await db.set "xp_#{message.guild.id}_#{message.author.id}", parseInt(XP) + randXP
      level = await db.get "level_#{message.guild.id}_#{message.author.id}"
      if level == null then await db.set "level_#{message.guild.id}_#{message.author.id}", 1
      next = Math.floor Math.pow parseInt level  / 0.1, 2

      if xp > next
        await db.set "level_#{message.guild.id}_#{message.author.id}", parseInt(level) + 1
        message.reply "you leveled up to #{parseInt(level) + 1}! GG!"
        
      timeout = -> cooldown.delete message.author.id
      setTimeout timeout, cooldownTime
    catch err
      console.error err
      console.log "XP Error Occurred. But this was handled successfully."
  
  # Call the function
  xp message
  
  # Get the prefix from the database.
  prefix = await db.get "prefix_#{message.guild.id}"
  # If there is no prefix set for the guild, the prefix is the one set in credentials.
  if prefix == null then prefix = process.env.prefix or keys.prefix
  
  # Now ignore messages not starting with the prefix.
  if not message.content.startsWith prefix then return

  args = message.content.slice(prefix.length).trim().split(/ +/g)
  
  switch args[0]
    
    # Ping Command
    when "ping", "p", "lat", "latency"
      m = await message.channel.send "Pinging..."
      ping = m.createdTimestamp
      m.edit "**#{ping - message.createdTimestamp}ms**"
      break
      
    # Prefix Command
    when "prefix", "sp"
      if not message.member.hasPermission "MANAGE_GUILD"
        return message.reply "you don't have the **Manage Server** permission to use this command."
      if not args[1] then return message.reply "please define the new prefix."
      if args[2] then return message.reply "prefixes with spaces aren't allowed."
      if args[1].length > 3 then return message.reply "prefixes have a three character limit."
      
      await db.set "prefix_#{message.guild.id}", args[1]
      message.channel.send "Prefix set to **#{args[1]}** successfully."
      break
      
    # Rank Command
    when "rank", "rk", "r", "points", "lvl", 'level'
      # Members
      member = message.mentions.users.first() or message.author
      if member.bot then return message.reply "bots aren't eligible for XP!"
      
      # Ranking
      every = await db.all()
      every = every.filter((i) -> i.ID.startsWith "xp_#{message.guild.id}_").sort (a, b) -> b.data - a.data
      ranking = every.map((x) -> x.ID).indexOf "xp_#{message.guild.id}_#{member.id}" + 1
      
      # Data
      level = await db.get "level_#{message.guild.id}_#{member.id}"
      exp = await db.get "xp_#{message.guild.id}_#{member.id}"
      neededXP = Math.floor Math.pow(parseInt(level) / 0.1, 2)
      
      message.channel.send "**#{member.tag}** - **Rank** #{ranking}\n**Level** #{level} - **XP** - #{exp} / #{neededXP}"
      break
      
    when "leaderboard", "lb", "top", "levels"
      data = await db.all()
      data = data.filter((i) -> i.ID.startsWith "xp_#{message.guild.id}_" ).sort (a, b) => b.data - a.data
      if data.length < 1 then return message.channel.send "No members to be on the leaderboard yet!"
      data.length = 10;
      lb = [];
      for i of data
        id = (data[i].ID).split("_")[2]
        user = await bot.users.cache.get("#{id}")
        user = user.tag or "Unknown User#0000"
        rank = data.indexOf(data[i]) + 1
        level = await db.get "level_#{message.guild.id}_#{id}"
        if level == null then level = 1
        xp = data[i].data
        xpreq = Math.floor(Math.pow(parseInt(level) / 0.1, 2))
        lb.push({
          user: { id, tag: user },
          rank, level, xp, xpreq
        });

      embed = new Discord.MessageEmbed()
      .setAuthor "#{message.guild.name} - Top 20 Leaderboard", message.guild.iconURL()
      .setColor "RANDOM"
      lb.forEach (member) -> 
        embed.addField "#{member.rank}. #{member.user.tag}", "**Level** - #{member.level}\n**XP** - #{(member.xp).replace(/\"+/g, '')} / #{member.xpreq}"
      message.channel.send(embed);
      break
      
bot.login(process.env.token || keys.token)
