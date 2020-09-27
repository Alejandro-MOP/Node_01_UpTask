const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res) => {

    res.render('crearCuenta', {
        nombrePagina: 'Crear Cuenta en Uptask'

    })
}


exports.crearCuenta = async (req, res) => {

    const { email, password } = req.body;

    try {

        await Usuarios.create({
            email,
            password
        });

        //url de confirmacion de cuenta creada
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`; //console.log(resetUrl);

        //crear objeto de usuario
        const usuario = {
            email
        }

        //enviar mail
        enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta Uptask',
            confirmarUrl,
            documento: 'confirmarCuenta'
        });

        req.flash('correcto', 'Hemos enviado un correo para confirmar tu cuenta, revisa tambien en la bandeja de SPAM');
        res.redirect('/iniciar-sesion');
        
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));

        res.render('crearCuenta',{
            errores: req.flash(),
            nombrePagina: 'Crear Cuenta en Uptask',
            email,
            password
        })
    }
    

}

exports.formIniciarSesion = (req, res) => {

    //console.log(res.locals.errores ); debugear mensajes de error de passport

    const { error } = res.locals.errores;

    res.render('iniciarSesion', {
        nombrePagina: 'Inicia sesión en UpTask',
        error
    })
}

exports.formRestablecerPassword = (req, res) => {

    res.render('reestablecer',{
        nombrePagina: 'Reestablecer Contraseña'
    })
}

exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne( { where: { email: req.params.correo } } );

    if (!usuario) {
        req.flash('error', 'No válido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}