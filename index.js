const TelegramBot = require('node-telegram-bot-api');
const config = require('config');
const token = config.get('BOT_TOKEN');
const bot = new TelegramBot(token, { polling: true });
const { client, getTime } = require('./helpers');

bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, 'Добро пожаловать в прислугу Буси!)', {
    reply_markup: {
      keyboard: [['Когда кормили?', 'Я покормил']],
    },
  });
});

bot.onText(/^Я покормил$/, msg => {
  client
    .create({
      _type: 'feed',
      who: msg.from.first_name,
      when: new Date(),
    })
    .then(() => bot.sendMessage(msg.chat.id, 'Молодец'))
    .catch(error => console.error(error));
});

bot.onText(/^Когда кормили\?$/, msg => {
  const query = '*[_type == "feed"] | order(when desc) [0] {who, when}';

  client.fetch(query, {}).then(({ who, when }) => {
    bot.sendMessage(msg.chat.id, `Последний раз кормил(-а) ${who} в ${getTime(when)}`);
  });
});
