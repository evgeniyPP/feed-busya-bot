const { DateTime } = require('luxon');

const ONE_HOUR_IN_SECONDS = 60 * 60;

const dateOptions = { locale: 'ru', zone: 'UTC+3' };

const getSimpleTime = date => {
  return DateTime.fromISO(date, dateOptions).toLocaleString(DateTime.TIME_SIMPLE);
};

const shouldFeed = date => {
  const seconds = DateTime.fromISO(date, dateOptions).toSeconds();
  const currentSeconds = DateTime.fromJSDate(new Date(), dateOptions).toSeconds();
  const remindSeconds = ONE_HOUR_IN_SECONDS * process.env.REMIND_TIME || 6;

  return currentSeconds - seconds > remindSeconds;
};

module.exports = { getSimpleTime, shouldFeed };
