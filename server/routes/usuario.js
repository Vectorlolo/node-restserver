const express = require('express')

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario')
const { verificaToken, verificaAdmin } = require('../middleware/autenticacion')

const app = express()



app.get('/usuario', verificaToken, (req, res) => {

    /*   return res.json({
        usuario: req.usuario,
        nombre: req.usuario.nombre,
        email: req.usuario.email,
    })

 */


    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 7;
    limite = Number(limite)
    Usuario.find({ estado: true }, 'nombre email role estado google img') // como segundo parametro ,pasado como string , se mostraran los campos que le ponga
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                })
            })
        })



});

app.post('/usuario', [verificaToken, verificaAdmin], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })


    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // usuarioDB.password = null;
        res.json({
            ok: true,
            usuario: usuarioDB
        })


    });
});




app.put('/usuario/:id', [verificaToken, verificaAdmin], (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);



    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })


});

app.delete('/usuario/:id', [verificaToken, verificaAdmin], (req, res) => {

    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                usuarioDB
            })
        }

        res.json({
            ok: true,
            usuarioDB
        })

    })

    /* Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    massage: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuarioBorrado
        });

    });
 */


});



module.exports = app;