
const TABLA = 'PlaylistSongs';
const ID = 'id';


module.exports = function (dbInyect){
    // Funtiones a llamar desde rutas.js, una ruta lo llamara para obtener los datos de la base de datos    
    let db = dbInyect;
    if (!db) {
        db = require('../../DB/mysql')
    }

    //para obtener todas las canciones conectando a la bdd
    function songPlaylist (id) {
        console.log("***********",id)
        return db.songPlaylist(id, TABLA, ID);
    }

    async function addSongPlaylist(body) {
        // Construir el objeto usuario (o canción)
        // Llamar a la función de base de datos para actualizar o insertar el usuario
        const respuesta = await db.addSongPlaylist(body, TABLA, ID);
        return respuesta; // Retorna la respuesta de la base de datos
    }

    function deleteSongPlaylist (idPlaylist, idSong) {
        return db.deleteSongPlaylist(TABLA, idPlaylist, idSong);
    }

    return {
        songPlaylist,
        addSongPlaylist,
        deleteSongPlaylist
    }
}


