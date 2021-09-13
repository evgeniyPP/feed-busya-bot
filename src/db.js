const sanityClient = require('@sanity/client');

module.exports = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  token: process.env.SANITY_TOKEN,
  dataset: 'production',
  apiVersion: '2021-09-13',
  useCdn: false,
});
