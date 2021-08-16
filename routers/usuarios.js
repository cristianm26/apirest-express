const express = require('express');
const Joi = require('joi');
const router = express.Router();

const usuarios = [
    { id: 1, nombre: 'Cristian' },
    { id: 2, nombre: 'Dario' },
    { id: 3, nombre: 'Paola' },
    { id: 4, nombre: 'Hugo' }
];

router.get('/', (req, res) => {
    res.send(usuarios);
})

/* router.get('/api/usuarios/:year/:mes', (req, res) => {
    res.send(req.query);
});
 */
router.get('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

router.post('/', (req, res) => {

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

router.put('/:id', (req, res) => {
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

router.delete('/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if (!usuario) {
        res.status(404).send('El usuario no fue encontrado');
        return;
    }

    const index = usuarios.indexOf(usuario);
    usuarios.splice(index, 1);

    res.send(usuario)

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

module.exports = router;