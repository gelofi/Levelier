module.exports = {
  name: "ready",
  run: async (client) => {
    console.log(`${client.user.tag} is now online!`)
  }
}