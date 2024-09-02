//---Desde aquí haremos todas las consultas

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
//estableciendo la tabla a consultar
const TABLA = 'Songs';//estableciendo la tabla a consul
const ID = 'id'
// Configura tus credenciales de AWS y región
const s3Client = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY
    },
});


module.exports = function (dbInyect){
    // Funtiones a llamar desde rutas.js, una ruta lo llamara para obtener los datos de la base de datos    
    let db = dbInyect;
    if (!db) {
        db = require('../../DB/mysql')
    }

    //para obtener todas las canciones conectando a la bdd
    function allSongs () {
        return db.allSongs(TABLA, ID);
    }


    //searchSongs
    //para obtener todas las canciones conectando a la bdd
    function searchSongs (name) {
        return db.searchSongs(name, TABLA, ID);
    }

    //para obtener una cancion conectando a la bdd
    function oneSong (id) {
        return db.oneSong(TABLA, id, ID);
    }


    async function createSong(req) {
        // Extraer campos de texto del req.body
        const { id, name, timeDuration, artist } = req.body;
        let linkImage = "";
        let linkMp3 = "";

        if (req.files && req.files.length > 0) {
            const file = req.files[0];
            const fileName = `${Date.now()}_${file.originalname}`;

            // Configura los parámetros de S3
            const params = {
                Bucket: 'multimedia-semi1-a-g8', // Ajusta el nombre del bucket
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            try {
                // Crear el comando PutObject
                const command = new PutObjectCommand(params);
                // Enviar el comando usando el cliente S3
                const uploadResult = await s3Client.send(command);
                linkImage = `https://${params.Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`; // La URL pública del archivo subido
            } catch (err) {
                console.error('Error subiendo archivo a S3:', err);
                throw err;
            }
        }


        if (req.files && req.files.length > 0) {
            const file = req.files[1];
            const fileName = `${Date.now()}_${file.originalname}`;

            // Configura los parámetros de S3
            const params = {
                Bucket: 'multimedia-semi1-a-g8', // El nombre del bucket
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            try {
                // Crear el comando PutObject
                const command = new PutObjectCommand(params);
                // Enviar el comando usando el cliente S3
                const uploadResult = await s3Client.send(command);
                linkMp3 = `https://${params.Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`; // La URL pública del archivo subido
            } catch (err) {
                console.error('Error subiendo archivo a S3:', err);
                throw err;
            }
        }
    
        // Construir el objeto usuario (o canción)
        const cancion = {
            id: id,
            name: name,
            linkImage: linkImage,
            timeDuration: timeDuration, // Agrega el array de enlaces de archivos aquí
            artist: artist,
            linkMp3: linkMp3
        };
    
        // Llamar a la función de base de datos para actualizar o insertar el usuario
        const respuesta = await db.createSong(TABLA, cancion, ID);

        return respuesta; // Retorna la respuesta de la base de datos
    }





    
    async function updateSong(paramId, req) {
        // Extraer campos de texto del req.body
        const { id, name, timeDuration, artist } = req.body;
        let linkImage = "";
        let linkMp3 = null;
        if (req.files && req.files.length > 0) {
            const file = req.files[0];
            const file2 = req.files[1];
            const fileName = `${Date.now()}_${file.originalname}`;
            const fileName2 = `${Date.now()}_${file2.originalname}`;

            // Configura los parámetros de S3
            const params = {
                Bucket: 'multimedia-semi1-a-g8', // Ajusta el nombre del bucket
                Key: fileName,
                Body: file.buffer,
                ContentType: file2.mimetype,
            };

            const params2 = {
                Bucket: 'multimedia-semi1-a-g8', // Ajusta el nombre del bucket
                Key: fileName2,
                Body: file2.buffer,
                ContentType: file2.mimetype,
            };

            try {
                // Crear el comando PutObject
                const command = new PutObjectCommand(params);
                // Enviar el comando usando el cliente S3
                const uploadResult = await s3Client.send(command);
                linkImage = `https://${params.Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`; // La URL pública del archivo subido
                linkMp3 = `https://${params2.Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName2}`; // La URL pública del archivo subido

            } catch (err) {
                console.error('Error subiendo archivo a S3:', err);
                throw err;
            }
        }

        // Construir el objeto cancion
        const cancion = {
            id: id,
            name: name,
            linkImage: linkImage,
            timeDuration: timeDuration, // Agrega el array de enlaces de archivos aquí
            artist: artist,
            linkMp3: linkMp3
        };
    
        // Llamar a la función de base de datos para actualizar o insertar el usuario
        const respuesta = await db.updateSong(TABLA, cancion, ID, paramId);
    
    
        return respuesta; // Retorna la respuesta de la base de datos
    }
    

    function deleteSong (paramId) {
        return db.deleteSong(TABLA, paramId, ID);
    }

    return {
        allSongs,
        oneSong,
        createSong,
        updateSong,
        deleteSong,
        searchSongs
    }
}