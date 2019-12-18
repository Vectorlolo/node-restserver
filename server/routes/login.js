const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/* const { duracionToken, SEEDToken } = require('../server')
 */

const Usuario = require('../models/usuario')
const app = express()

//==============ENTORNO===============
//=======Vencimiento del token========
//60 s 
//60 min
//24 h
//30 d
const duracionToken = (process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30)

//========SEED de autenticacion========

const SEEDToken = (process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo')








app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: { message: '(Usuario) o contraseña incorrectos' }
            })
        }

        if (!bcrypt.compare(body.password, usuarioDB.password)) {
            return res.status(500).json({
                ok: false,
                err: { message: 'Usuario o (contraseña) incorrectos' }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB,
        }, process.env.SEED, { expiresIn: duracionToken });

        res.json({
            ok: true,
            usuarioDB,
            token
        })


    })



})










module.exports = app;