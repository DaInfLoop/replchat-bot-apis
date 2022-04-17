const Client = require('../')
const client = new Client("replchat-helper", false)

client.on('debug', console.log)

client.on('ready', () => {
  console.log("replchat-helper is online!")
})

client.on('message', (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return
  const args = message.content.split(/ +/g)
  const command = args.shift();
  switch (command) {
    case '!eval':
      if (message.author.username == "DaInfLoop") {
        client.sendMessage(eval(args.join(' ')))
      }
      break;
    case '!hi':
      client.sendMessage(`Hi @${message.author.username}!`)
      break;
    case '!say':
      client.sendMessage(`${args.join(' ').split('@').join('@&#8203;') || 'Say something bruh'}`)
      break;
    case '!help':
      client.sendMessage(`# Hi there!
#### Who made me?
I was made by [DaInfLoop](https://replit.com/@DaInfLoop), a developer for replchat! I'm built using [replchat.js](https://replit.com/@DaInfLoop/replchat.js).

#### What can I do?
Here's my commands:
- !help (obvious)
- !hi (i say hi to you)
- !say (i say something)`)
  }
})

client.on('join', (username) => {
  client.sendMessage(`Hello, ${username}! :amongus:`)
})

client.on('leave', (username) => {
  client.sendMessage(`${username} has left...`)
})

client.login()
