const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


exports.agregarTarea = async (req, res, next) =>{
    //Encontrar el proyecto actual
    const proyecto = await Proyectos.findOne( { where: { url: req.params.url } } );

    //leer el valor del input "tarea"
    const { tarea } = req.body;
    const estado = 0;
    const proyectoId = proyecto.id;

    //Inserción en BD y redireccionamiento
    const resultado = await Tareas.create( { tarea, estado, proyectoId } );

    if (!resultado) { return next(); }

    res.redirect(`/proyectos/${req.params.url}`);

}
