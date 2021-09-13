const sanityClient = require('@sanity/client');
const config = require('config');
const { DateTime } = require('luxon');
const projectId = config.get('SANITY_PROJECT_ID') || process.env.SANITY_PROJECT_ID;
const token = config.get('SANITY_TOKEN') || process.env.SANITY_TOKEN;

const client = sanityClient({
  projectId,
  token,
  dataset: 'production',
  apiVersion: '2021-09-13',
  useCdn: false,
});

const getTime = date => {
  return DateTime.fromISO(date).setLocale('ru').toLocaleString(DateTime.TIME_SIMPLE);
};

module.exports = { client, getTime };
