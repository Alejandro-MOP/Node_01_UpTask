const Usuarios = require('../models/Usuarios');

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