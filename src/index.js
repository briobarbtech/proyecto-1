// Express is required
const express = require("express");
const server = express();
// Data.Manager is required
const { findAll, findOneById, addItem, updateItem, destroyItem } = require('./database/data.manager.js');

// Dotenv is required
require('dotenv').config();


// Middlewares

server.use(express.json());
server.use(express.urlencoded({ extended: true }))

/*  Routes CRUD */

// Get all
server.get('/fruits', (req, res) => {
    findAll()
        .then((items) => res.status(200).send(items))
        .catch((e) => res.status(400).send(e.message))
})
// Get One
server.get('/fruits/:id', (req, res) => {
    const { id } = req.params;
    findOneById(Number(id))
        .then((item) => res.status(200).send(item))
        .catch((e) => res.status(400).send(e.message));
})
// Post
server.post('/fruits', (req, res) => {
    const { imagen, nombre, importe, stock } = req.body;
    addItem({ imagen, nombre, importe, stock })
        .then((item) => res.status(201).send(item))
        .catch((e) => res.status(400).send(e.message));
})
// Put
server.put('/fruits/:id', (req, res) => {
    const { id } = req.params;
    const { imagen, nombre, importe, stock } = req.body;
    updateItem({ id: Number(id), imagen, nombre, importe, stock })
        .then((item) => res.status(201).send(item))
        .catch((e) => res.status(400).send(e.message));
})
// Delete
server.delete('/fruits/:id', (req, res) => {
    const { id } = req.params;
    destroyItem(id)
        .then((item) => res.status(200).send(item))
        .catch((e) => res.status(400).send(e.message));
})

// Error managment
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>Error 404: La URL indicada no existe en este servidor</h3>`);
});

// "server" is configured to listen
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Server is running on: http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
})