require("./server")()

const Discord = require("discord.js");
const client = new Discord.Client({ disableMentions: "everyone "}) // Disables the bot from pinging everyone.
const keys = require("./keys");

// Command Handling
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.cooldown = new Set();

// Database - For custom prefixes and XP System.
let Hexo = require("hexo-db");
client.db = new Hexo.Database(process.env.hexodb || keys.hexodb);

["command", "event"].forEach(handler => require(`./handlers/${handler}`)(client));

client.login(process.env.token || keys.token) // Log in the BOT