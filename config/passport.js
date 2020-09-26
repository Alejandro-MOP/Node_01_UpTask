const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al Modelo donde se va a autenticar
const Usuarios = require('../models/Usuarios');

//Local strategy - Login con credenciales propias (user, pass)
passport.use(
    new LocalStrategy(
        //Configuramos user y pass
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        //consulta a bd para validación
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne( { where: { email, activo: 1 } } );
                //password incorrecto
                if (!usuario.verificarPassword(password)) {
                    return done(null, false, {
                        message: 'El password ingresado es incorrecto, intenta de nuevo'
                    })
                }
                //user y pass correctos
                return done(null, usuario);

            } catch (error) {
                //Si no existe el usuario
                return done(null, false, {
                    message: 'Esa cuenta no existe dentro de Uptask'
                })
            }
        }
    )
);

//Serializar 
passport.serializeUser((usuario, callback) => callback(null, usuario) );

//Des-serializar usuario
passport.deserializeUser((usuario, callback) => callback(null, usuario) );

module.exports = passport;