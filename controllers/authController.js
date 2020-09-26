const Usuarios = require('../models/Usuarios');
const passport = require('passport');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const OP = Sequelize.Op
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos Campos son Obligatorios'
});

exports.usuarioAutenticado = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }

    return res.redirect('/iniciar-sesion');
}

exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => res.redirect('/iniciar-sesion'));
}

exports.enviarToken = async (req, res) => {
    //verificar cuenta
    const { email } = req.body

    if (!email) {
        req.flash('error', 'Ingresa tu email por favor');        
        res.redirect('/reestablecer');
    }
    
    const usuario = await Usuarios.findOne( {where: { email } } );

    if (!usuario) {
        req.flash('error', 'No existe un cuenta con ese email');
        res.redirect('/reestablecer');
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    await usuario.save();

    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`; //console.log(resetUrl);

    enviarEmail.enviar({
        usuario,
        subject: 'Reestablecer Contraseña',
        resetUrl,
        documento: 'resetPassword'
    });

    req.flash('correcto', 'Revisa tu email, hemos enviado un enlace para reestablecer tu contraseña');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {

    const usuario = await Usuarios.findOne( { where: { token: req.params.token } } );

    if (!usuario) {
        req.flash('error', 'Enlace no válido');
        res.redirect('/reestablecer');
    }

    res.render('resetPassword', {
       nombrePagina: 'Reestablecer Contraseña' 
    });
}

exports.resetPassword = async (req, res) => {

    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [OP.gte] : Date.now() //Operador de Sequelize para mayor o igual que
            }
        }
    });

    // console.log(usuario);

    if (!usuario) {
        req.flash('error', 'El enlace para reestablecer contraseña ya no es válido, intenta de nuevo');
        res.redirect('/reestablecer');
    }

   const { password } = req.body;

   usuario.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
   usuario.token = null;
   usuario.expiracion = null;
   await usuario.save();

   req.flash('correcto', '¡Tu contraseña ha sido actualizada!')
   res.redirect('/iniciar-sesion');    
}