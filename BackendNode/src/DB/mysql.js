const mysql = require('mysql');
const config = require('../config');//para el desarrollo
const { error } = require('../red/respuestas');

// const prueba = {
//     id: 1,
//     nombre: 'juan',
//     edad: 20
// }

const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

let conectionBDD;

function conectionMysql(){
    conectionBDD = mysql.createConnection(dbconfig)

    conectionBDD.connect((err) => {
        if (err) {
            console.log('[db err]', err);
            setTimeout(conectionMysql, 200);
        }else{
            console.log('Base de datos conectada')
        }
    });

    conectionBDD.on('error', err => {
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            conectionMysql()
        }else{
            throw err;
        }
    })
}

conectionMysql()





//------------------------------------Para usuarios---------------------


//Obteniendo todos usuarios
function allData(tabla){
    //return prueba
    return new Promise((resolve, reject) => {
        conectionBDD.query(`SELECT* FROM ${tabla}`, (error, result) => {
            return error ? reject(error) : resolve(result);//si existe error lo devolverá sino el resultado
        });
    })
}

//Obteniendo un solo dato
function oneData(tabla, id, idTable){
    //return prueba
    return new Promise((resolve, reject) => {
        conectionBDD.query(`SELECT* FROM ${tabla} WHERE ${idTable}=${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);//si existe error lo devolverá sino el resultado
        })
    });
}

//añadiendo un dato
function addUser(tabla, data) {
    return new Promise((resolve, reject) => {
        conectionBDD.query(`INSERT INTO ${tabla} SET ?`, data, (error, result) => {
            return error ? reject(error) : resolve(result); // si existe error lo devolverá, sino el resultado
        });
    });
}




function updateUsers(tabla, data, idTable) {
    return new Promise((resolve, reject) => {
        // Filtrar campos con valores diferentes de null
        const fields = Object.keys(data)
            .filter(key => data[key] !== null)
            .map(key => `${key} = ?`)
            .join(", ");
        
        const values = Object.values(data).filter(value => value !== null);

        // Verificar si hay algo que actualizar
        if (fields.length === 0) {
            return reject(new Error("No hay campos para actualizar"));
        }

        const sql = `UPDATE ${tabla} SET ${fields} WHERE ${idTable} = ?`;
        values.push(data[idTable]); // Añadir el valor del ID al final

        // Ejecutar la consulta de actualización
        conectionBDD.query(sql, values, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}



function deleteUser(tabla, data, idTable){
    //return prueba
    return new Promise((resolve, reject) => {
        conectionBDD.query(`DELETE FROM ${tabla} WHERE ${idTable}=${data.idUsuario}`, (error, result) => {
            return error ? reject(error) : resolve(result);//si existe error lo devolverá sino el resultado
        })
    });
}


function query(tabla, consulta){
    //return prueba
    return new Promise( (resolve, reject) => {
        conectionBDD.query(`SELECT* FROM ${tabla} WHERE ?`, consulta, (error, result) => {
            return error ? reject(error) : resolve(result[0]);//si existe error lo devolverá sino el resultado
        })
    });
}




//----------------------------------Para canciones-------------------------

//Obteniendo todas canciones
function allSongs(tabla){
    //return prueba
    return new Promise((resolve, reject) => {
        conectionBDD.query(`SELECT* FROM ${tabla}`, (error, result) => {
            return error ? reject(error) : resolve(result);//si existe error lo devolverá sino el resultado
        });
    })
}

function searchSongs(name, tabla, id){
    console.log("---- ", name, tabla);

    return new Promise((resolve, reject) => {
        // Usar un marcador de posición `?` para el valor de `name`
        const sql = `SELECT * FROM ${tabla} WHERE name = ?`;

        // Pasar el valor de `name` como parámetro
        conectionBDD.query(sql, [name], (error, result) => {
            return error ? reject(error) : resolve(result); // si existe error lo devolverá sino el resultado
        });
    });
}


//Obteniendo un solo dato
function oneSong(tabla, id, idTable){
    //return prueba
    return new Promise((resolve, reject) => {
        conectionBDD.query(`SELECT* FROM ${tabla} WHERE ${idTable}=${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);//si existe error lo devolverá sino el resultado
        })
    });
}


//Actualizando un dato
function createSong(tabla, data ) {
    return new Promise((resolve, reject) => {
        conectionBDD.query(`INSERT INTO ${tabla} SET ?`, data, (error, result) => {
            return error ? reject(error) : resolve(result); // si existe error lo devolverá, sino el resultado
        });
    });
}

function updateSong(tabla, data, idTable, idValue) {
    return new Promise((resolve, reject) => {
        // Filtrar campos con valores diferentes de null
        const fields = Object.keys(data)
            .filter(key => key !== idTable && data[key] !== null) // Excluir el campo del identificador
            .map(key => `${key} = ?`)
            .join(", ");
        
        const values = Object.values(data)
            .filter((value, index) => Object.keys(data)[index] !== idTable && value !== null);

        // Verificar si hay algo que actualizar
        if (fields.length === 0) {
            return reject(new Error("No hay campos para actualizar"));
        }

        // Verificar que el valor del ID no sea nulo o indefinido
        if (idValue === null || idValue === undefined) {
            return reject(new Error("El identificador (ID) no puede ser nulo o indefinido"));
        }

        const sql = `UPDATE ${tabla} SET ${fields} WHERE ${idTable} = ?`;
        values.push(idValue); // Añadir el valor del ID al final

        // Ejecutar la consulta de actualización
        conectionBDD.query(sql, values, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}



function deleteSong(tabla, id, idTable){
    //return prueba
    return new Promise((resolve, reject) => {
        conectionBDD.query(`DELETE FROM ${tabla} WHERE ${idTable}=${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);//si existe error lo devolverá sino el resultado
        })
    });
}








//----------------------------------Para playlist-------------------------

//Obteniendo todas ls playlist
function allPlaylists(idUser, tabla){
    //return prueba
    return new Promise((resolve, reject) => {
        conectionBDD.query(`SELECT* FROM ${tabla} WHERE idUser=${idUser}`, (error, result) => {
            return error ? reject(error) : resolve(result);//si existe error lo devolverá sino el resultado
        });
    })
}

//Obteniendo un solo dato
function onePlaylist(tabla, id, idTable){
    //return prueba
    return new Promise((resolve, reject) => {
        conectionBDD.query(`SELECT* FROM ${tabla} WHERE ${idTable}=${id}`, (error, result) => {
            return error ? reject(error) : resolve(result);//si existe error lo devolverá sino el resultado
        })
    });
}


function createPlaylist(tabla, data, idTable) {
    return new Promise((resolve, reject) => {
        conectionBDD.query(`INSERT INTO ${tabla} SET ?`, data, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

function updatePlaylist(tabla, data, id, idTable) {
    return new Promise((resolve, reject) => {
        conectionBDD.query(`UPDATE ${tabla} SET ? WHERE id = ?`, [data, id], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

// Eliminar una playlist



// Eliminar una playlist con transacciones
async function deletePlaylist(playlistsTable, playlistId, idTable) {
    return new Promise((resolve, reject) => {
        conectionBDD.beginTransaction((err) => {
            if (err) {
                return reject(err);
            }

            // Primero, elimina todas las canciones de la playlist
            conectionBDD.query(`DELETE FROM PlaylistSongs WHERE idPlaylist = ?`, [playlistId], (error, result) => {
                if (error) {
                    return conectionBDD.rollback(() => {
                        reject(error);
                    });
                }

                // Luego, elimina la playlist
                conectionBDD.query(`DELETE FROM ${playlistsTable} WHERE ${idTable} = ?`, [playlistId], (error, result) => {
                    if (error) {
                        return conectionBDD.rollback(() => {
                            reject(error);
                        });
                    }

                    // Si ambas operaciones tuvieron éxito, confirma la transacción
                    conectionBDD.commit((err) => {
                        if (err) {
                            return conectionBDD.rollback(() => {
                                reject(err);
                            });
                        }
                        resolve('Playlist y canciones eliminadas correctamente');
                    });
                });
            });
        });
    });
}


//----------------------------------Para favoritos-------------------------

//Obteniendo todas canciones
function allFavorits(idUser, tabla){
    //return prueba
    return new Promise((resolve, reject) => {
        conectionBDD.query(`SELECT* FROM ${tabla} WHERE idUser = ?`, [idUser], (error, result) => {
            return error ? reject(error) : resolve(result);//si existe error lo devolverá sino el resultado
        });
    })
}


//ver lo de nisert con la data qie ata estoy enviando para guardar
function addFavorit(data, tabla, idTable) {
    return new Promise((resolve, reject) => {
        conectionBDD.query(`INSERT INTO ${tabla} SET ?`, data, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


// Eliminar un favorito
function deleteFavorit(tabla, id, idTable) {
    return new Promise((resolve, reject) => {
        conectionBDD.query(`DELETE FROM ${tabla} WHERE ${idTable} = ?`, [id], (error, result) => {
            return error ? reject(error) : resolve(result); // si existe error lo devolverá, sino el resultado
        });
    });
}



//----------------------------------Para canciones de playlists en especifico-------------------------

//Obteniendo todas canciones
function songPlaylist(id, tabla, idTable){
    //return prueba
    return new Promise((resolve, reject) => {
        conectionBDD.query(`SELECT* FROM ${tabla} WHERE idPlaylist = ?`, [id], (error, result) => {
            return error ? reject(error) : resolve(result);//si existe error lo devolverá sino el resultado
        });
    })
}


//ver lo de nisert con la data qie ata estoy enviando para guardar
function addSongPlaylist(data, tabla, idTable) {
    //console.log("ññññññññ", data)
    return new Promise((resolve, reject) => {
        conectionBDD.query(`INSERT INTO ${tabla} SET ?`, data, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


function deleteSongPlaylist(tabla, idPlaylist, idSong) {
    return new Promise((resolve, reject) => {
        const sql = `DELETE FROM ${tabla} WHERE idPlaylist = ? AND idSong = ?`;
        const values = [idPlaylist, idSong];

        conectionBDD.query(sql, values, (error, result) => {
            return error ? reject(error) : resolve(result); // si existe error lo devolverá, sino el resultado
        });
    });
}


module.exports = {
    //usuarios
    allData,
    oneData,
    addUser,
    updateUsers,
    deleteUser,
    //autenticar
    query,
    //canciones
    allSongs,
    oneSong,
    createSong,
    updateSong,
    deleteSong,
    searchSongs,
    //playlists
    allPlaylists,
    onePlaylist,
    createPlaylist,
    updatePlaylist,
    deletePlaylist,
    //Favoritos
    allFavorits,
    addFavorit,
    deleteFavorit,
    //SongPlaylistEspecifica
    songPlaylist,
    addSongPlaylist,
    deleteSongPlaylist
    

}