const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./config/db');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');

//Connexion BD
db.sync()
.then( () => console.log('Conectado a la BD') )
.catch( (error) => console.log(error) );

//importar modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

//crear app express
const app = express();

//donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar Pug (Template Engine)
app.set('view engine', 'pug');

//habilitar body parser para leer formularios
app.use(bodyParser.urlencoded({ extended: true }));

//Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

//Agregar flash messages
app.use(flash());

//
app.use(cookieParser());

//Sessions nos permite navegar en varias paginas sin volverse a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

//funcion vardump en applicacion
app.use( (req, res, next) =>{
    res.locals.vardump = helpers.vardump;
    res.locals.errores = req.flash();
    next();
});

app.use('/', routes() );

app.listen(4000);