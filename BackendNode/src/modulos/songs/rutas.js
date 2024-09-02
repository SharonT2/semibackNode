const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const respuesta = require('../../red/respuestas');
const controlador = require('./index');

const router = express.Router();

//Rutas para obtener datos de canciones
router.get('/songs', allSongs);
router.get('/ver_cancion/:id', oneSong);
router.get('/buscar_canciones', searchSongs);
router.post('/cargar_cancion', upload.any(), createSong);//createSong
router.put('/actualizar_cancion/:id', upload.any(), updateSong);
router.delete('/delete_cancion/:id', deleteSong);

//

//Para obtener todas las canciones
async function allSongs(req, res, next) {
    //res.send('residentes funcinando')
    try {
        const items = await controlador.allSongs()//se comunica con la funcion de la bdd
        respuesta.mostrarTodo(req, res, items.body, 200);
    } catch (error) {
        //respuesta.error(req, res, error, 500)
        next(err);
    }

};


async function searchSongs(req, res, next) {
    try {
        const items = await controlador.searchSongs(req.body.name); // Se comunica con la función de la BDD

        const canciones = items.map(row => ({
            id: row.id,
            name: row.name,
            linkImage: row.linkImage,
            timeDuration: row.timeDuration,
            artist: row.artist,
            linkMp3: row.linkMp3
        }));

        // Enviar solo el array de canciones en formato JSON
        res.status(200).json(canciones);
    } catch (error) {
        // Manejo de errores
        next(error);
    }
}

//Para buscar una canción por id
async function oneSong(req, res, next) {
    try {
        const items = await controlador.oneSong(req.params.id);
        respuesta.success(req, res, items[0], 200);
    } catch (err) {
        //respuesta.error(req, res, err, 500)
        next(err);
    }

};


async function createSong(req, res, next) {
    try {
        console.log(req.body)
        const item = await controlador.createSong(req);
        console.log(item);
        respuesta.respuestaMessage(req, res, "Cancion creada exitosamente", 200);
    } catch (error) {
        next(error);
    }
}

async function updateSong(req, res, next) {
    try {
        const item = await controlador.updateSong(req.params.id, req);
        console.log(item);
        respuesta.respuestaMessage(req, res, "Cancion actualizada correctamente", 200)
    } catch (error) {
        next(error);
    }
}


//Para eliminar al residente por id
async function deleteSong(req, res, next) {
    try {
        console.log("--------- ", req.params.id)
        const items = await controlador.deleteSong(req.params.id);
        //respuesta.success(req, res, "La canción fue eliminada satisfactoriamente", 200);
        respuesta.respuestaMessage(req, res, "La canción fue eliminada satisfactoriamente", 200);
    } catch (err) {
        //respuesta.error(req, res, err, 500)
        next(err);                //------------------Agregar después para un mensaje a residente más
    }

};



module.exports = router;