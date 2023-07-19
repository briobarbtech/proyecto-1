// Express is required
const express = require("express");
const server = express();
const path = require("path");
require('dotenv').config({ path: path.join(__dirname, ".env") });
// Data.Manager is required
const { getOneById, getAllItems, createItem, destroyItem, updateItem } = require('./database/data.manager.js');

// Middlewares

server.use(express.json());
server.use(express.urlencoded({ extended: true }))

/*  Routes CRUD */

// POST	http://127.0.0.1:3005/api/v1/muebles	Crea un nuevo registro

server.post('/api/v1/muebles', (req, res) => {
    const { nombre, precio, categoria } = req.body;
    createItem({ nombre, precio, categoria })
        .then((item) => res.status(201).send(JSON.stringify({ message: "Registro creado", payload: item })))
        .catch((e) => res.status(400).send(JSON.stringify({ message: e.message })));
})

// PUT	http://127.0.0.1:3005/api/v1/muebles/1	Modifica un registro en específico
//TODO
server.put('/api/v1/muebles/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, precio, categoria } = req.body;
    let newItem = { codigo: Number(id) };
    if (nombre) newItem.nombre = nombre;
    if (precio) newItem.precio = precio;
    if (categoria) newItem.categoria = categoria;
    updateItem(newItem)
        .then((mueble) => res.status(200).send(JSON.stringify({ message: 'Registro actualizado', payload: mueble })))
        .catch((e) => res.status(400).send(JSON.stringify({ message: e.message })));
})

// DELETE	http://127.0.0.1:3005/api/v1/muebles/1	Elimina un registro en específico
server.delete('/api/v1/muebles/:id', (req, res) => {
    const { id } = req.params;
    destroyItem(Number(id))
        .then((item) => res.status(200).send(JSON.stringify({ message: 'Registro eliminado' })))
        .catch((e) => res.status(400).send(JSON.stringify({ message: e.message })));
})

// GET	http://127.0.0.1:3005/api/v1/muebles/1	Obtiene un registro en específico
server.get('/api/v1/muebles/:id', (req, res) => {
    const { id } = req.params;
    getOneById(Number(id))
        .then((item) => res.status(200).send(JSON.stringify({ message: "Exito", payload: item })))
        .catch((e) => res.status(400).send(JSON.stringify({ message: e.message })))
})

// GET	http://127.0.0.1:3005/api/v1/muebles	Obtiene los registros (permite filtros)
server.get('/api/v1/muebles', (req, res) => {
    const { categoria, precio_gte, precio_lte } = req.query;
    getAllItems({categoria, precio_gte: Number(precio_gte),precio_lte: Number(precio_lte)})
        .then((items) => res.status(200).send(JSON.stringify({message:"Éxito", payload: items })))
        .catch((e) => res.status(400).send(JSON.stringify({ message: e.message })))
})

// GET	http://127.0.0.1:3005/api/v1/muebles/1	Obtiene un registro en específico
/*
server.get('/api/v1/muebles/:id', (req, res) => {
    const { id } = req.params;
    getOneById(Number(id))
        .then((item) => res.status(200).send(JSON.stringify({ payload: item })))
        .catch((e) => res.status(400))
})
// GET	http://127.0.0.1:3005/api/v1/muebles	Obtiene los registros (permite filtros)
server.get('/api/v1/muebles', (req, res) => {
    const { categoria, precio_gte, precio_lte } = req.query;
    getAllItems({ categoria, precio_gte, precio_lte })
        .then((items) => res.status(200).send(JSON.stringify({ payload: items })))
        .catch((e) => { console.log(e.message), res.status(500).send(JSON.stringify({ message: "Se ha generado un error en el servidor" })) })
})
// POST	http://127.0.0.1:3005/api/v1/muebles	Crea un nuevo registro

server.post('/api/v1/muebles', (req, res) => {
    const { nombre, precio, categoria } = req.body;
    createItem({ nombre, precio, categoria })
        .then((item) => res.status(201).send(JSON.stringify(item)))
        .catch((e) => { console.log(e.message), res.status(400).send("Something went wrong") });
})
// PUT	http://127.0.0.1:3005/api/v1/muebles/1	Modifica un registro en específico
//TODO
server.put('/api/v1/muebles/:id', (req, res) => {
    const { id } = req.params;
    updateItem(Number(id))
        .then((mueble) => res.status(200).send(JSON.stringify({ message: 'Registro actualizado', payload: mueble })))
        .catch((e) => {
            if (e.name === "400") {
                res.status(400).send({ message: e.message })
            } else if (e.name == "500") {
                res.status(500).send({ message: e.message })
            }
        });
})
// DELETE	http://127.0.0.1:3005/api/v1/muebles/1	Elimina un registro en específico
server.delete('/api/v1/muebles/:id', (req, res) => {
    const { id } = req.params;
    destroyItem(Number(id))
        .then((item) => res.status(200).send(JSON.stringify({ message: 'Registro eliminado' })))
        .catch((e) => res.status(500).send({ message: e.message }));
})
// manejar errores sobre cualquier posible endpoint erróneo o inexistente
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>Error 404: La URL indicada no existe en este servidor</h3>`);
}); */

// "server" is configured to listen
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Server is running on: http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
})


// Obtener los registros de todos los muebles (sin ordenar)
// Obtener los registros de los muebles filtrados y ordenados por una categoría
// Obtener los registros de los muebles por precio mayor o igual que un valor y ordenados por el precio de forma ascendente
// Obtener los registros de los muebles por precio menor o igual que un valor y ordenados por el precio de forma descendente
// Obtener el registro de un mueble por su código
// Crear un nuevo registro de un mueble (contemplar la validación del esquema)
// Actualizar el registro de un mueble por su código (contemplar la validación del esquema)
// Eliminar el registro de un mueble por su código
// Controlar las rutas inexistentes
