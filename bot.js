var fetch = require('node-fetch');
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

bot.onText(/^\/get_recipes (.+)$/, function (msg, match) {
 var ingredients = match[1].split(" ");
 var url;
 ingredients.map( (ingredient) => {
  url = 'http://food2fork.com/api/search?key=ac1dade071c008a757442d968333ebc6&q=' + ingredient;
})
  var chatId = msg.chat.id;
  var resp = ""

  fetch(url)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        var recipe = getRecipes(json);
        resp = "Recipes containing: " + ingredients + "\n" + recipe.title + "\n" + recipe.source_url;
        console.log(resp)
        bot.sendMessage (chatId, resp);
    });
})

var getRecipes = function(json) {
  // console.log(json.recipes[0].title);
  var recipeTitle = json.recipes[0]
  return recipeTitle
}
