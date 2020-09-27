const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./config/db');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

require('dotenv').config({ path: 'variables.env'})

//importar modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

//Connexion BD
db.sync()
.then( () => console.log('Conectado a la BD') )
.catch( (error) => console.log(error) );


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


//
app.use(cookieParser());

//Sessions nos permite navegar en varias paginas sin volverse a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Agregar flash messages
app.use(flash());

//funcion vardump en applicacion
app.use( (req, res, next) =>{
    res.locals.vardump = helpers.vardump;
    res.locals.errores = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes() );


//Servidor y puerto

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 4000;



app.listen(port, host, () => {
    console.log('El servidor esta corriendo por el puerto: ', port);
});

//require('./handlers/email'); enviar mail para pruebas