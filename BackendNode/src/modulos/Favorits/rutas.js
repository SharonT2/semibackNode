const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const respuesta = require('../../red/respuestas');
const controlador = require('./index'); // Asegúrate de incluir la funcionalidad de playlists en el controlador

const router = express.Router();
// Rutas para playlists
router.get('/favoritas/:id/canciones', allFavorits);
router.post('/agregar_favorito', addFavorits);
router.delete('/favoritos/:id/cancion', deleteFavorits);

// Funciones para playlists
async function allFavorits(req, res, next) {
    try {
        const items = await controlador.allFavorits(req.params.id);
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
}

// Agregar una canción a favoritos
async function addFavorits(req, res, next) {
    try {
        console.log(req.body);
        const { idUser, idSong } = req.body;
        const item = await controlador.addFavorit(req.body);
        respuesta.success(req, res, 'Canción agregada a favoritos correctamente', 201);
    } catch (error) {
        next(error);
    }
}

async function deleteFavorits(req, res, next) {
    try {
        console.log(req.body)
        await controlador.deleteFavorit(req.params.id);
        respuesta.success(req, res, 'Canción eliminada correctamente de favoritos', 200);
    } catch (error) {
        next(error);
    }
}




module.exports = router;
