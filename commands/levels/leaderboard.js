module.exports = {
  name: "leaderboard",
  aliases: ["lb", "top"],
  description: "Points system for Leuxitai - Leaderboard",
  run: async (client, message, args, Discord) => {

    const db = client.db

    let data = await db.all()
    data = data.filter(i => i.ID.startsWith(`xp_${message.guild.id}`)).sort((a, b) => b.data - a.data);
    if (data.length < 1) return message.channel.send("No members to be on the leaderboard yet!");
    data.length = 20;
    let lb = [];
    for (let i in data)  {
      let id = data[i].ID.split("_")[2];
      let user = await client.users.cache.get(`${id}`);
      user = user ? user.tag : "Unknown User#0000";
      let rank = data.indexOf(data[i]) + 1;
      let level = await db.get(`level_${message.guild.id}_${id}`);
      if (level == null) level = 1;
      let xp = data[i].data
      let xpreq = Math.floor(Math.pow(level / 0.1, 2));
      lb.push({
        user: { id, tag: user },
        rank, level, xp, xpreq
      });
    };

    const embed = new Discord.MessageEmbed()
    .setAuthor(`${message.guild.name} - Top 20 Leaderboard`, message.guild.iconURL)
    .setColor("RANDOM")
    lb.forEach(member => {
        embed.addField(
          `${member.rank}. ${member.user.tag}`, `**Level** - ${member.level}\n**XP** - ${(member.xp).replace(/['"]+/g, '')} / ${member.xpreq}`,
          true
        );
    });
    return message.channel.send(embed);
  }
};