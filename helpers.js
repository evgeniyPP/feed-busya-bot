const sanityClient = require('@sanity/client');
const { DateTime } = require('luxon');

const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  token: process.env.SANITY_TOKEN,
  dataset: 'production',
  apiVersion: '2021-09-13',
  useCdn: false,
});

const getTime = date => {
  return DateTime.fromISO(date).setLocale('ru').toLocaleString(DateTime.TIME_SIMPLE);
};

module.exports = { client, getTime };
