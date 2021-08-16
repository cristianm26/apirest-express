const inicioDebug = require('debug')('app:inicio');
const dbDebug = require('debug')('app:db');
const express = require('express');
const config = require('config');
require('dotenv').config()
const app = express();

const usuariosRoute = require('./routers/usuarios');
//const log = require('./logger');
const morgan = require('morgan');


app.use(express.json()); //body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/api/usuarios', usuariosRoute)

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

//Petición
app.get('/', (req, res) => {
    res.send('Hola Mundo ');
});



const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
})


