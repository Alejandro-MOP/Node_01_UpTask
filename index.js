const express = require('express');
const routes = require('./routes');

//crear app express
const app = express();

app.use('/', routes() );

app.listen(4000);

