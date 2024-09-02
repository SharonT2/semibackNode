const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const respuesta = require('../../red/respuestas');
const controlador = require('./index'); // Asegúrate de incluir la funcionalidad de playlists en el controlador

const router = express.Router();

// Rutas para playlists
router.get('/playlists_usuario/:id', allPlaylists);
router.get('/:id', onePlaylist);//no esta en uso
router.post('/create_playlist', upload.any(), createPlaylist);
router.put('/update_playlist/:id', upload.any(), updatePlaylist);
router.delete('/delete_playlist/:id', deletePlaylist);

// Funciones para playlists
async function allPlaylists(req, res, next) {
    try {
        const items = await controlador.allPlaylists(req.params.id);
        //respuesta.success(req, res, items, 200);
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
}

async function onePlaylist(req, res, next) {
    try {
        const items = await controlador.onePlaylist(req.params.id);
        respuesta.success(req, res, items, 200);
    } catch (error) {
        next(error);
    }
}

async function createPlaylist(req, res, next) {
    try {
        console.log(req.body)
        const item = await controlador.createPlaylist(req);
        respuesta.respuestaMessage(req, res, 'Playlist creada correctamente', 201);
    } catch (error) {
        next(error);
    }
}

async function updatePlaylist(req, res, next) {
    try {
        const item = await controlador.updatePlaylist(req.params.id, req);
        respuesta.respuestaMessage(req, res, 'Playlist actualizada correctamente', 201);
    } catch (error) {
        next(error);
    }
}


async function deletePlaylist(req, res, next) {
    try {
        console.log(req.body)
        await controlador.deletePlaylist(req.params.id);
        respuesta.respuestaMessage(req, res, 'Playlist eliminada correctamente', 201);
    } catch (error) {
        next(error);
    }
}




module.exports = router;
