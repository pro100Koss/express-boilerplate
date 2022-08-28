import path from 'path';
require('dotenv').config({path: path.dirname(__dirname) + '/.env'});

const port = (process.env.PORT && parseInt(process.env.PORT)) || 3000;

require('./app').default.run(port);
console.log('App running at http://localhost:%d', port);
