const express = require('express')
const mongoose = require('mongoose');


const app = express()
const bodyParser = require('body-parser')

// ===================================


//=================PUERTO=============
const port = process.env.PORT || 3000;

//==============ENTORNO===============
const ubicacionPuerto = process.env.NODE_ENV || 'dev'


//==============ENTORNO===============
//=======Vencimiento del token========
//60 s 
//60 min
//24 h
//30 d
const duracionToken = (process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30)

//========SEED de autenticacion========

const SEEDToken = (process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo')


//============BASE DE DATOS============
let urlDB;
if (ubicacionPuerto === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}


// ===================================



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


//configuracion global de rutas
app.use(require('./routes/index'));




mongoose.connect(urlDB, { useNewUrlParser: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos ONLINE')
    });

app.listen(port, () => {
    console.log(`Escuchando puerto ${ port }`);
})

module.exports = {
    duracionToken,
    SEEDToken
}