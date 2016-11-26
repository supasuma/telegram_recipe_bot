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


bot.on('message', function (msg) {
  var chatId = msg.chat.id;
  var resp = "Recipe bot in action"
  bot.sendMessage(chatId, resp);
})

bot.onText(/^\/get_recipes (.+)$/, function (msg, match) {
 var ingredients = match[1].split(" ");
 var url ='http://food2fork.com/api/search?key=' + config.food2fork.apiKey + '&q='
 var stuff = ''

 ingredients.map( (ingredient) => {
  stuff += ingredient + ",";
})
  var chatId = msg.chat.id;
  var resp = ""
  fetch(url+stuff)
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        var recipe = getRecipes(json);
        resp = "Recipes containing: " + ingredients.join(", ") + "\n" + recipe.title + "\n" + recipe.source_url;
        bot.sendMessage (chatId, resp);
    });
})

var getRecipes = function(json) {
  var rand = Math.floor( Math.random() * json.count );
  var recipeObject = json.recipes[rand];

  return recipeObject;
}

bot.onText(/\/help/, function(msg, match) {
  var fromId = msg.from.id;
  bot.sendMessage(fromId, "This bot has one command.\n/get_recipes where you can then enter 1 or more ingredients separated by a space \nFor example get_recipes chicken mango");
});
