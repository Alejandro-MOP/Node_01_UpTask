const {Sequelize} = require('sequelize');
const db = require('../config/db');
const slug = require('slug');
const shorid = require('shortid');
const shortid = require('shortid');

const Proyectos = db.define('proyectos',{

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        
    },

    nombre: {
        type: Sequelize.STRING(100)
    },

    url: {
        type: Sequelize.STRING(100)
    }

}, { 
    hooks: {
        beforeCreate(proyecto){
           const url = slug(proyecto.nombre).toLowerCase();

           proyecto.url = `${url}-${shortid.generate()}`;
        }
    }
});

module.exports = Proyectos;