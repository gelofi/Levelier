// Command Handling
const { readdirSync } = require("fs");
// const ascii = require("ascii-table") Optional

// Create Tables - Optional
/*
let table = new ascii("Commands");
table.setHeading ("Command", "Load Status");
*/

module.exports = (client) => {
  readdirSync("./commands/").forEach((dir) => {
    // Only get JS files
    let command = readdirSync(`./commands/${dir}/`).filter(file => file.endsWith(".js"));
    
    // Loop over the commands folder, get each command.
    for (let file of command){
      var pull = require(`../commands/${dir}/${file}`);
      if (pull.name) {
        client.commands.set(pull.name, pull)
      //table.addRow(file, '!')
      } /* Optional 
      else {
      table.addRow(file, '? -> missing file, or a name!')
      }
      */
      if (pull.aliases && Array.isArray(pull.aliases)){
        pull.aliases.forEach(alias => client.aliases.set(alias, pull.name))
      }
    }
  });
  // console.log(table.toString()) Log the table - Optional
  console.log("-- Events loaded ! --");
}
  