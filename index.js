const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');

//crear app express
const app = express();

//donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar Pug (Template Engine)
app.set('view engine', 'pug');

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//habilitar body parser para leer formularios
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes() );

app.listen(4000);