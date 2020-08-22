const Proyectos = require('../models/Proyectos');
const slug = require('slug');

exports.proyectosHome = (req, res) => {

    res.render('index', {
        nombrePagina: 'Proyectos'
    });
}

exports.formularioProyecto = (req, res) => {

    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto'
    });
}

exports.nuevoProyecto = async (req, res) => {
    //Enviar a consola console.log(req.body);
    //Validar el input no este vacio
    const { nombre } = req.body;

    let errores = [];

    if(!nombre){
        errores.push({'texto': 'Agrega un nombre al Proyecto'});
    }

    //si hay errores
    if(errores.length > 0){

        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores
        });

    }else{
        //Insertar en BD
        //const url = slug(nombre).toLowerCase(); crear la url
        const proyecto = await Proyectos.create({ nombre });
        res.redirect('/');            
    }
}