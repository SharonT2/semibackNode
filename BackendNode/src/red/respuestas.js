exports.success = function (req, res, mensaje, status){
    const statusCode = status || 200;
    const mensajeOk = mensaje || '';
    res.status(statusCode).send({
        error: false,
        status: statusCode,
        body: mensajeOk
    });
}

exports.error = function (req, res, mensaje, status){
    const statusCode = status || 500;
    const mensajeError = mensaje || 'Error interno';
    res.status(statusCode).send({
        error: true,
        status: statusCode,
        body: mensajeError
    });
}


exports.login = function (req, res, mensaje, id, usuario, status){
    const statusCode = status || 200;
    const mensajeOk = mensaje || '';
    res.status(statusCode).send({
        message: mensaje,
        user_id: id,
        user: usuario
    });
}

exports.respuestaMessage = function (req, res, mensaje, status){
    const statusCode = status || 200;
    const mensajeOk = mensaje || '';
    res.status(statusCode).send({
        message: mensaje,
    });
}


exports.respuestaBusquedaUser = function (req, res, data, status){
    const statusCode = status || 200;
    res.status(statusCode).send({
        "nombre": data.name,
        "apellido": data.lastname,
        "foto_perfil": data.linkphoto,
        "email": data.email
    });
}



exports.mostrarTodo = function (req, res, data, status){
    const statusCode = status || 200;
    res.status(statusCode).send({
        data
    });
}
