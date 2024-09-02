const express = require('express');

const respuesta = require('../../red/respuestas');
//const controlador = require('./controlador'); //controlador para la bdd
const controlador = require('./index');

const router = express.Router();


//Obtener datos de usuario, esto se liga en app.js donde tengo rutas generaeles
router.post('/login', login);


//Para buscar al usuario por id
async function login(req, res, next){
    try {

        console.log("====",req.body)
        const data = await controlador.login(req.body.usuario, req.body.password);
        //respuesta.success(req, res, token, 200);
        console.log(data)
        respuesta.login(req, res, "Login successful", data.id, data.email, 200)
    } catch (err) {
        //respuesta.error(req, res, err, 500)
        next(err);  
    }

};



module.exports = router;