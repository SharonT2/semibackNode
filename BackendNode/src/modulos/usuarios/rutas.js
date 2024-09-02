const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Ejemplo de configuración básica
const respuesta = require('../../red/respuestas');
//const controlador = require('./controlador'); //controlador para la bdd
const controlador = require('./index');

const router = express.Router();

// Middlewares para manejar JSON y datos URL-encoded
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Rutas establecidas

//Obtener datos de usuario, esto se liga en app.js donde ten    go rutas generaeles
router.get('/usuarios', allUsers);
router.get('/obtener_usuario/:id', oneUser);

// Actualizar o añadir un usuario
router.post('/registro', upload.any(), createUser);
router.put('/actualizar_usuario', upload.any(), updateUser);
router.delete('/eliminaUsuario:id', deleteUser);

//Para obtener todos los usuarios
async function allUsers(req, res, next){
    //res.send('usuarios funcinando')
    try {
        const items = await controlador.allData()//se comunica con la funcion de la bdd
        respuesta.respuestaMessage(req, res, "Usuario registrado exitosamente", 200);
    } catch (error) {
        //respuesta.error(req, res, error, 500)
        next(err); 
    }

};

//Para buscar al usuario por id
async function oneUser(req, res, next){
    try {
        const items = await controlador.oneData(req.params.id);
        console.log("========= ", items.name)
        respuesta.respuestaBusquedaUser(req, res, items[0] , 200);

    } catch (err) {
        //respuesta.error(req, res, err, 500)
        next(err);
    }
};

async function createUser(req, res, next) {
    try {
        console.log(req.body)
        const item = await controlador.createUser(req);
        respuesta.respuestaMessage(req, res, "Usuario creado correctamente", 200)
    } catch (error) {
        next(error);
    }
}



async function updateUser(req, res, next) {
    try {
        const item = await controlador.updateUser(req);
        respuesta.respuestaMessage(req, res, "Usuario actualizado correctamente", 200)
    } catch (error) {
        next(error);
    }
}

//Para eliminar al usuario por id
async function deleteUser(req, res, next){
    try {
        const items = await controlador.deleteUser(req.body);
        respuesta.respuestaMessage(req, res, "Usuario eliminado correctamente", 200)
    } catch (err) {
        //respuesta.error(req, res, err, 500)
        next(err);                //------------------Agregar después para un mensaje a usuario más
    }

};
module.exports = router;