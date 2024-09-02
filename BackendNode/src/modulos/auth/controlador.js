//---Desde aquí haremos todas las consultas
//estableciendo la tabla a consultar

const bcrypt = require('bcrypt');//Encriptar la contraseña
const auth = require('../../autentication')
const TABLA = 'Users';//estableciendo la tabla a consul
const ID = 'id'

module.exports = function (dbInyect){
    // Funtiones a llamar desde rutas.js, una ruta lo llamara para obtener los datos de la base de datos    
    let db = dbInyect;
    if (!db) {
        db = require('../../DB/mysql')
    }

    async function login(usuario, password) {
        console.log(usuario, password);
        const data = await db.query(TABLA, { email: usuario });
        console.log("-----", data)
        // Compara directamente la contraseña proporcionada con la almacenada
        //console.log(password, data.password)
        return bcrypt.compare(password, data.password)
        .then(resultado => {
            if (resultado == true) {
                //Generar un token
                return data//se cambio sin token, ahora tenemos la data para identificar el id//jme asignara la autenticacion de mi token para iniciar sesión y tambien la data mandada
            }else{
                //Generar error
                throw new Error ('Informacion Invalida')
            }
                
            
        })
    }    

    async function updateUsers (data) {
         //establecemos los parametros que se mandaran a autentication
        const authData = {
        idA: data.idA
        }
        if (data.usuario) {//se añadira el usuario
            authData.usuario = data.usuario
        }

        if (data.passwordUser) {//se añadira la contraseña
            authData.passwordUser = await bcrypt.hash(data.passwordUser.toString(), 5)//e eencriptara la contraseña
        }
        return db.updateUsers(TABLA, authData, ID);
    }


    return {
        updateUsers,
        login
    }
}