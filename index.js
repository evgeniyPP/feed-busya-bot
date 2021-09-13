require('dotenv').config();

var bot = require('./src/bot');
require('./src/web')(bot);
