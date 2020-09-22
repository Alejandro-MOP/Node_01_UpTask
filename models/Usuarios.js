const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');
const bcrypt = require('bcrypt-nodejs');

const Usuarios = db.define('usuarios', {

    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    email: {
        type: Sequelize.STRING(60),
        allowNull: false, //campo vacío
        unique:true,
        validate: {
            isEmail: {
                msg: 'Agrega un Email Válido'
            },
            notEmpty: {
                msg: 'El email no puede estar vácio'
            },
            isUnique: (value, next) => {
                let self = this;
                Usuarios.findOne( { where: { email: value } } )
                    .then( usuario => {
                        if (usuario && self.id !== usuario.id) {
                            return next('El email ya se encuentra registrado');
                        }
                        return next();
                    })
                    .catch(error => {
                        return next(error);
                    })
            }
        },
    },

    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vácio'
            }
        }
    }
}, {
    hooks: {
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10));
        }
    }
});

Usuarios.hasMany(Proyectos); //Cardinalidad 1 =>muchos

Usuarios.prototype.verificarPassword = function(password){
    return bcrypt.compareSync(password, this.password)
};

module.exports = Usuarios;