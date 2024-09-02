const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const TABLA = 'Playlists';
const ID = 'id';

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

    //allPlaylists
    //para obtener todas las canciones conectando a la bdd
    function allPlaylists (parId) {
        return db.allPlaylists(parId, TABLA, ID);
    }
    //para obtener todas las canciones conectando a la bdd
    function songPlaylist (parId) {
        return db.songPlaylist(parId, TABLA, ID);
    }

    //para obtener una cancion conectando a la bdd
    function onePlaylist (id) {
        return db.onePlaylist(TABLA, id, ID);
    }


    async function createPlaylist(req) {
        // Extraer campos de texto del req.body
        const { id, name, description, idUser } = req.body;
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
    
        // Construir el objeto usuario (o canción)
        const data = {
            id: id,
            name: name,
            description: description,
            linkPhoto: linkImage,
            idUser: idUser
        };
    
        // Llamar a la función de base de datos para actualizar o insertar el usuario
        const respuesta = await db.createPlaylist(TABLA, data, ID);

        return respuesta; // Retorna la respuesta de la base de datos
    }








    async function updatePlaylist (id, req) {
        // Extraer campos de texto del req.body
        const { name, description, idUser } = req.body;
        let linkImage = "";

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
    
        // Construir el objeto usuario (o canción)
        const data = {
            name: name,
            description: description,
            linkPhoto: linkImage,
            idUser: idUser
        };
    
        // Llamar a la función de base de datos para actualizar o insertar el usuario
        const respuesta = await db.updatePlaylist(TABLA, data, id, ID);
        
        return respuesta; // Retorna la respuesta de la base de datos
    }
    

    function deletePlaylist (id) {
        return db.deletePlaylist(TABLA, id, ID);
    }

    return {
        allPlaylists,
        songPlaylist,
        onePlaylist,
        createPlaylist,
        updatePlaylist,
        deletePlaylist
    }
}


