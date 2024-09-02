//----Variables globales del sistema
require('dotenv').config();
module.exports = {
    app: {
        port: process.env.PORT || 4000, 
    },

    jwt: {
        secret: process.env.JET_SECRET || 'notasecreta!'
    },

    //Conection BDD
    mysql: {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_BDD || 'ejemplo'


    }

    
}