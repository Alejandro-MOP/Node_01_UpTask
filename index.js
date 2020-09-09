const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./config/db');
const helpers = require('./helpers');



//Connexion BD
db.sync()
    .then( () => console.log('Conectado a la BD') )
    .catch( (error) => console.log(error) );

//importar modelo
require('./models/Proyectos');
require('./models/Tareas');

//crear app express
const app = express();

//donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar Pug (Template Engine)
app.set('view engine', 'pug');

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//funcion vardump en applicacion
app.use( (req, res, next) =>{

    res.locals.vardump = helpers.vardump;
    next();
});

//habilitar body parser para leer formularios
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', routes() );

app.listen(4000);