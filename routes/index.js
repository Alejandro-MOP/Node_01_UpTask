const express = require('express');
const router = express.Router();

//importar controlador
const proyectosController = require('../controllers/proyectosController');

module.exports = function() {

    //rutas para la app
    router.get('/', proyectosController.proyectosHome );
    router.get('/nuevo-proyecto', proyectosController.formularioProyecto)
    router.post('/nuevo-proyecto', proyectosController.nuevoProyecto);
    
    return router;
}