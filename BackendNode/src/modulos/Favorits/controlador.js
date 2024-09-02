const TABLA = 'Favorits';
const ID = 'id';


module.exports = function (dbInyect){
    // Funtiones a llamar desde rutas.js, una ruta lo llamara para obtener los datos de la base de datos    
    let db = dbInyect;
    if (!db) {
        db = require('../../DB/mysql')
    }

    //para obtener todas las canciones conectando a la bdd
    function allFavorits (idUser) {
        return db.allFavorits(idUser, TABLA, ID);
    }

    async function addFavorit(body) {
        // Construir el objeto usuario (o canción)
        // Llamar a la función de base de datos para actualizar o insertar el usuario
        const respuesta = await db.addFavorit(body, TABLA, ID);
        return respuesta; // Retorna la respuesta de la base de datos
    }

    function deleteFavorit (id) {
        return db.deleteFavorit(TABLA, id, ID);
    }

    return {
        allFavorits,
        addFavorit,
        deleteFavorit
    }
}


