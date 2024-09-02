const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const config = require('./config');
const usuarios = require('./modulos/usuarios/rutas');
const songs = require('./modulos/songs/rutas');
const playlists = require('./modulos/playlists/rutas');
const favorits = require('./modulos/Favorits/rutas');
const songsPlaylists = require('./modulos/songsPlaylists/rutas');

const auth = require('./modulos/auth/rutas');
const error = require('./red/errors');

const app = express();


var corOptions = {
    origin: '*',
    optionSuccessStatus: 200
}

//----Middleware
app.use(cors(corOptions));
app.use(morgan('dev'));
app.use(express.json());//para poder trabajar con json
app.use(express.urlencoded({ extended: true}))
app.use(cors())

//------Configuración respectiva
app.set('port', config.app.port);

//------Rutas
app.use('/', auth);//para Login
app.use('/', usuarios);//para usuarios
app.use('/', songs);//para canciones
app.use('/', playlists);//para plaulist
app.use('/', favorits);
app.use('/', songsPlaylists);


app.use(error)


module.exports = app;