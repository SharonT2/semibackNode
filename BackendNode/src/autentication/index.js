const jwt = require('jsonwebtoken')
config = require('../config')

const secret = config.jwt.secret;

function asignarToken(data){

    return jwt.sign(data, secret) //Retornará token
}







// function verificarToken(data){

//     return jwt.verify(data, secret) //Retornará token
// }


// const chequearToken = {
//     confirmarToken: function(req){
//         const decodificado = decodificarCabecera(req.params.cabecera);
//     }
// }

// function obtenerToken(autorizacion){
//     if (!autorizacion) {
//         throw new Error('Sin token')
//     }

//     if (autorizacion.indexOf('Beareer') === -1) {
//         throw new Error('Formato Inválido')
//     }

//     let token = autorizacion.replace('Bearer', '')
//     return token;
// }


// function decodificarCabecera(req){
//     const autorizacion = req.headers.autorizacion || '';
//     const token = obtenerToken(autorizacion);
//     const decodificado = verificarToken(token);

//     req.user = decodificado;
//     return decodificado;

// }

module.exports = {
    asignarToken
    // chequearToken
}