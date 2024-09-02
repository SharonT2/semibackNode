//---Desde aquí haremos todas las consultas
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const bcrypt = require('bcrypt');


//estableciendo la tabla a consultar
const TABLA = 'Users';//estableciendo la tabla a consul
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

    function allData () {
        return db.allData(TABLA);
    }

    async function oneData (id) {
        const respuesta = await db.oneData(TABLA, id, ID);
        console.log("este dato ", respuesta)
        return respuesta;
    }


    async function createUser(req) {
        // Extraer campos de texto del req.body
        const { name, lastName, email, password, birthDay, isAdmin } = req.body;

        let linkphoto = null;
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
                linkphoto = `https://${params.Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`; // La URL pública del archivo subido
            } catch (err) {
                console.error('Error subiendo archivo a S3:', err);
                throw err;
            }
        }

        // Encriptar la contraseña antes de guardarla
        const saltRounds = 5;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Construir el objeto residente
        const usuario = {
            name: name,
            lastName: lastName,
            linkphoto: linkphoto, // Agrega el archivo aquí
            email: email,
            password: hashedPassword,
            birthDay: birthDay,
            isAdmin: isAdmin
        };
    
        // Llamar a la función de base de datos para actualizar o insertar el usuario
        const respuesta = await db.addUser(TABLA, usuario, ID);
    
        return respuesta; // Retorna la respuesta de la base de datos
    }


    async function updateUser(req) {
        // Extraer campos de texto del req.body
        const { id, name, lastName, email, password, birthDay, isAdmin } = req.body;

        let linkphoto = null;
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
                linkphoto = `https://${params.Bucket}.s3.${process.env.S3_REGION}.amazonaws.com/${fileName}`; // La URL pública del archivo subido
            } catch (err) {
                console.error('Error subiendo archivo a S3:', err);
                throw err;
            }
        }

        // Encriptar la contraseña antes de guardarla
        const saltRounds = 5;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Construir el objeto residente
        const usuario = {
            id: id,
            name: name,
            lastName: lastName,
            linkphoto: linkphoto, // Agrega el archivo aquí
            email: email,
            password: hashedPassword,
            birthDay: birthDay,
            isAdmin: isAdmin
        };
    
        // Llamar a la función de base de datos para actualizar o insertar el usuario
        const respuesta = await db.updateUsers(TABLA, usuario, ID);
    
    
        return respuesta; // Retorna la respuesta de la base de datos
    }

    function deleteUser (body) {
        return db.deleteUser(TABLA, body, ID);
    }

    return {
        allData,
        oneData,
        createUser,
        updateUser,
        deleteUser
    }
}