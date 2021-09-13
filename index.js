const TelegramBot = require('node-telegram-bot-api');
const config = require('config');
const token = config.get('BOT_TOKEN');
const bot = new TelegramBot(token, { polling: true });
const { client, trycatch } = require('./helpers');

bot.onText(/\/start/, msg => {
  bot.sendMessage(msg.chat.id, 'Добро пожаловать в прислугу Буси!)', {
    reply_markup: {
      keyboard: [['Когда кормили?', 'Я покормил']],
    },
  });
});

bot.onText(/^Я покормил$/, msg => {
  bot.sendMessage(msg.chat.id, 'Молодец!)', {
    reply_markup: {
      keyboard: [['Когда кормили?', 'Я покормил']],
    },
  });
});

bot.on(
  'message',
  trycatch(async msg => {
    const res = await client.create({
      _type: 'post',
      title: msg.text,
    });

    bot.sendMessage(msg.chat.id, 'Doc was published!');
  })
);
