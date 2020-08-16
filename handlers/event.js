// Event Handling
let fs = require("fs");
module.exports = client => {
  fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err) // Catch inbound errors
    files.forEach((file) => {
      let events = require(`./../events/${file}`); // Get the events
      client.on(events.name, (...args) => events.run(...args, client));
    });
  })
}