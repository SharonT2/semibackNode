const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const respuesta = require('../../red/respuestas');
const controlador = require('./index'); // Asegúrate de incluir la funcionalidad de playlists en el controlador

const router = express.Router();
// Rutas para playlists
//router.get('/playlists_usuario/:id', allSongPlaylist);//con base a un id de la playlist se mostraran todas las cancioens pertencientes a esa
router.get('/playlist/:id/canciones', songPlaylist);//con base a un id de la playlist se mostraran todas las cancioens pertencientes a esa
router.post('/add_song_to_playlist', addSongPlaylist);//una canción se añadira a una playlist en especifico
router.delete('/remove_song_from_playlist', deleteSongPlaylist);//una canción se eliminará de una playlist en especifico

// Funciones para playlists

async function songPlaylist(req, res, next) {
    try {
        console.log("---------", req.body);
        const items = await controlador.songPlaylist(req.params.id);

        // Enviar solo el array de canciones de la playlist en formato JSON
        res.status(200).json(items);
    } catch (error) {
        next(error);
    }
}


// Agregar una canción a una playlist
async function addSongPlaylist(req, res, next) {
    try {
        console.log("---------",req.body)
        console.log(req.body);
        const { idUser, idSong } = req.body;
        const item = await controlador.addSongPlaylist(req.body);
        respuesta.respuestaMessage(req, res, 'Canción agregada a la playlist correctamente', 201);
    } catch (error) {
        next(error);
    }
}

async function deleteSongPlaylist(req, res, next) {
    
    try {
        const { idPlaylist, idSong } = req.body;

        // Verifica si idPlaylist e idSong están definidos
        if (typeof idPlaylist === 'undefined' || typeof idSong === 'undefined') {
            respuesta.respuestaMessage(req, res, 'Datos indefinidos en la entrada', 201);

        }
        
        // Imprimir valores para depuración
        console.log("idPlaylist:", idPlaylist, "idSong:", idSong);

        // Llama a la función para eliminar la canción de la playlist
        await controlador.deleteSongPlaylist(idPlaylist, idSong);

        // Respuesta exitosa
        respuesta.respuestaMessage(req, res, 'Canción eliminada a la playlist correctamente', 201);
    } catch (error) {
        console.error(error);
        next(error);
    }
}





module.exports = router;
