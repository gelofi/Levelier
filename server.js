let server = (require("express"))();
let http = require("http");

server.get("/", (req, res) => {
  console.log("Pinging...");
  res.json({ operational: true });
})

const ping = () => {
  server.listen(3000, () => {
    console.log("Server is up and running.")
  })
}

/*

Enable this if you will host on Repl.
let domain = "" // change your domain here if you will host on Repl.

setInterval(() => {
  http.get(domain)
}, 180000) // every 5 minutes
*/

module.exports = ping