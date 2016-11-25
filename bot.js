
var Bot = require('node-telegram-bot-api');
var bot;

var config = require('./config')

if (process.env.NODE_ENV === 'production') {
  bot = new Bot(config.telegramCredentials.token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new Bot(config.telegramCredentials.token, { polling: true });
}

console.log('bot server started in the ' + process.env.NODE_ENV + ' mode');

//THEY ALL WORK WITH OR WITHOUT CALLBACK!

// Any kind of message
bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  // photo can be: a file path, a stream or a Telegram file_id
  var resp = "Recipe bot in action"
  bot.sendMessage(chatId, resp);
})
