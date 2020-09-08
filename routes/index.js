const express = require('express');
const router = express.Router();
const proyectosController = require('../controllers/proyectosController');
const { body } = require('express-validator/check');

module.exports = function() {

    router.get('/', proyectosController.proyectosHome );

    router.get('/nuevo-proyecto', proyectosController.formularioProyecto)

    router.post('/nuevo-proyecto',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.nuevoProyecto
    );
    
    //Listar proyecto
    router.get('/proyectos/:url', proyectosController.proyectoPorUrl);

    //Actualizar Proyecto
    router.get('/proyectos/editar/:id', proyectosController.formularioEditar);

    //Actualizar el nombre en proyecto
    router.post('/nuevo-proyecto/:id',
        body('nombre').not().isEmpty().trim().escape(),
        proyectosController.actualizarProyecto
    );

    //Eliminar proyecto
    router.delete('/proyectos/:url', proyectosController.eliminarProyecto);

    return router;
}