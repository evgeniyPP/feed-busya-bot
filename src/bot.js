const token = process.env.BOT_TOKEN;

const Bot = require('node-telegram-bot-api');
const db = require('./db');
const { getSimpleTime, shouldFeed } = require('./time');

let bot;

if (process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, 'Добро пожаловать в прислугу Буси!)', {
    reply_markup: {
      keyboard: [['Когда кормили?', 'Я покормил(-a)']],
    },
  });
});

bot.onText(/^Я покормил\(\-a\)$/, msg => {
  db.create({
    _type: 'feed',
    who: msg.from.first_name,
    when: new Date(),
  })
    .then(() => bot.sendMessage(msg.chat.id, 'Молодец'))
    .catch(error => console.error(error));
});

bot.onText(/^Когда кормили\?$/, msg => {
  const query = '*[_type == "feed"] | order(when desc) [0] {who, when}';

  db.fetch(query).then(({ who, when }) => {
    const time = getSimpleTime(when);
    const shouldFeedMsg = shouldFeed(when) ? 'Пора бы покормить.' : 'Пока хватит.';

    bot.sendMessage(msg.chat.id, `Последний раз кормил(-а) ${who} в ${time}. ${shouldFeedMsg}`);
  });
});

module.exports = bot;
