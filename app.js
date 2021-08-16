const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
require('dotenv').config()
const app = express();
const Joi = require('joi');

//const log = require('./logger');
const morgan = require('morgan');


app.use(express.json()); //body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuracion de Entornos
console.log('Aplicación:' + config.get('nombre'));
console.log('BD Server:' + config.get('configDB.host'));

// Uso de middleware de tercero - Morgan
if (app.get('env') === 'development') {
    app.use(morgan('tiny'));
    inicioDebug('Morgan esta habilitado')
}

// Trabajos con la base de datos
dbDebug('Conectando con la bd..')
//app.use(log);

/* app.use(function (req, res, next) {
    console.log('Autenticado');
    next();
})
 */
const usuarios = [
    { id: 1, nombre: 'Cristian' },
    { id: 2, nombre: 'Dario' },
    { id: 3, nombre: 'Paola' },
    { id: 4, nombre: 'Hugo' }
];

//Petición
app.get('/', (req, res) => {
    res.send('Hola Mundo ');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
})

/* app.get('/api/usuarios/:year/:mes', (req, res) => {
    res.send(req.query);
});
 */
app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.post('/api/usuarios', (req, res) => {

    const schema = Joi.object({
        nombre: Joi.string().min(3).required(),
    });
    const { error, value } = validarUsuario(req.body.nombre)
    if (!error) {
        const usuario = {
            id: usuarios.length + 1,
            nombre: value.nombre
        }
        usuarios.push(usuario);
        res.send(usuario)
    } else {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
    }
    /*  if (!req.body.nombre || req.body.nombre.length <= 2) {
         res.status(400).send('Debe de ingresar un nombre, que tenga minimo 3 caracteres');
         return;
     }
     */
})

app.put('/api/usuarios/:id', (req, res) => {
    // Encontrar si existe el objecto usuario
    //let usuario = usuarios.find(u => u.id === parseInt(req.params.id));
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }


    const { error, value } = validarUsuario(req.body.nombre)
    if (error) {
        const mensaje = error.details[0].message;
        res.status(400).send(mensaje);
        return;
    }

    usuario.nombre = value.nombre;
    res.send(usuario);

})

app.delete('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario)

})



const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
})


function existeUsuario(id) {
    return (usuarios.find(u => u.id === parseInt(id)));
}

function validarUsuario(nombre) {
    const schema = Joi.object({
        nombre: Joi.string().min(3).required(),
    });
    return (schema.validate({ nombre }))
}