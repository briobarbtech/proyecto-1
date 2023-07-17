// Express is required
const express = require("express");
const server = express();
const path = require("path");
require('dotenv').config({ path: path.join(__dirname, ".env") });
// Data.Manager is required
const { getOneById, getAllItems,createItem, destroyItem } = require('./database/data.manager.js');



// Middlewares

server.use(express.json());
server.use(express.urlencoded({ extended: true }))

/*  Routes CRUD */

/* // obtener todos los productos
server.get('/clothes', (req, res) => {
    getAllItems()
        .then((items) => res.status(200).send(items))
        .catch((e) => { console.log(e.message), res.status(400) })
}) */
// obtener un producto por su ID
server.get('/clothes/:id', (req, res) => {
    const { id } = req.params;
    getOneById(Number(id))
        .then((item) => res.status(200).send(item))
        .catch((e) => { console.log(e.message), res.status(400) })
})
// obtener uno o más productos por parte de su nombre

server.get('/clothes', (req, res) => {
    const { name, category } = req.query;
    getAllItems({ name, category })
        .then((items) => res.status(200).send(items))
        .catch((e) => { console.log(e.message), res.status(400).send("Something went wrong") })
})
// obtener todos los productos de una categoría específica
// crear un nuevo producto
server.post('/clothes', (req, res) => {
    const { nombre, precio, categoria } = req.body;
    createItem({ nombre, precio, categoria })
        .then((item) => res.status(201).send(item))
        .catch((e) => { console.log(e.message), res.status(400).send("Something went wrong") });
})
// modificar el precio de un producto (*)
// eliminar un producto
server.delete('/clothes/:id', (req, res) => {
    const { id } = req.params;
    destroyItem(id)
        .then((item) => res.status(200).send(item))
        .catch((e) => res.status(400).send(e.message));
})
// manejar errores sobre cualquier posible endpoint erróneo o inexistente
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>Error 404: La URL indicada no existe en este servidor</h3>`);
});

// "server" is configured to listen
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Server is running on: http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
})