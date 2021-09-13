const sanityClient = require('@sanity/client');
const config = require('config');
const projectId = config.get('SANITY_PROJECT_ID');
const token = config.get('SANITY_TOKEN');

const client = sanityClient({
  projectId,
  token,
  dataset: 'production',
  apiVersion: '2021-09-13',
  useCdn: false,
});

const trycatch = async cb => {
  try {
    await cb();
  } catch (error) {
    console.error(error);
  }
};

module.exports = { client, trycatch };
