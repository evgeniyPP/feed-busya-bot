const token = process.env.BOT_TOKEN;

const Bot = require('node-telegram-bot-api');
const db = require('./db');
const { getSimpleTime, shouldFeed } = require('./time');

let bot;
let addFeedMode = false;

const DEFAULT_KEYBOARD = [['Когда кормили?', 'Я покормил(-a)']];

if (process.env.NODE_ENV === 'production') {
  bot = new Bot(token);
  bot.setWebHook(process.env.HEROKU_URL + bot.token);
} else {
  bot = new Bot(token, { polling: true });
}

console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode');

bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, 'Добро пожаловать в прислугу Буси! 😹', {
    reply_markup: {
      keyboard: DEFAULT_KEYBOARD,
    },
  });
});

bot.onText(/^Я покормил\(\-a\)$/, msg => {
  addFeedMode = true;
  bot.sendMessage(msg.chat.id, 'Чем?', {
    reply_markup: {
      keyboard: [
        ['сухим кормом 🧆', 'консервами 🥫'],
        ['домашней едой 🥘', 'ничем'],
      ],
    },
  });
});

bot.onText(/^сухим кормом 🧆$/, (msg, match) => addFeed(msg, match));

bot.onText(/^консервами 🥫$/, (msg, match) => addFeed(msg, match));

bot.onText(/^домашней едой 🥘$/, (msg, match) => addFeed(msg, match));

bot.onText(/^ничем$/, msg => {
  addFeedMode = false;
  bot.sendMessage(msg.chat.id, 'Ну ладно... 😼', {
    reply_markup: {
      keyboard: DEFAULT_KEYBOARD,
    },
  });
});

bot.onText(/^Когда кормили\?$/, msg => {
  const query = '*[_type == "feed"] | order(when desc) [0] {who, when, what}';

  db.fetch(query).then(({ who, when, what }) => {
    const time = getSimpleTime(when);
    const shouldFeedMsg = shouldFeed(when) ? 'Пора бы покормить 😾' : 'Пока хватит 😺';

    bot.sendMessage(
      msg.chat.id,
      `Последний раз кормил(-а) ${who} в ${time} ${what}. ${shouldFeedMsg}`,
      {
        reply_markup: {
          keyboard: DEFAULT_KEYBOARD,
        },
      }
    );
  });
});

bot.on('text', msg => {
  if (addFeedMode) {
    addFeed(msg, msg.text);
  }
});

function addFeed(msg, what) {
  if (!addFeedMode) {
    return;
  }

  addFeedMode = false;
  db.create({
    _type: 'feed',
    who: msg.from.first_name,
    when: new Date(),
    what,
  })
    .then(() => {
      bot.sendMessage(msg.chat.id, 'Молодец 😻', {
        reply_markup: {
          keyboard: DEFAULT_KEYBOARD,
        },
      });
    })
    .catch(error => console.error(error));
}

module.exports = bot;
