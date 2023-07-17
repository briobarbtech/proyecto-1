// File Systeme is required
const fs = require("fs");
// Path is required
const path = require("path");
// frutas.json route is saved in "route" the variable
const route = path.join(__dirname, "frutas.json");

// This is a function to write into frutas.json using FileSystem
function writeDB(contenido) {
    return new Promise((resolve, reject) => {
        fs.writeFile(route, JSON.stringify(contenido, null, "\t"), "utf8", (error) => {
            if (error) reject(new Error("Error. No se puede escribir"));

            resolve(true);
        });
    });
}
// This is a function to read frutas.json using FileSystem
function readDB() {
    return new Promise((resolve, reject) => {
        fs.readFile(route, "utf8", (error, result) => {
            if (error) reject(new Error("Error. No se puede leer"));

            resolve(JSON.parse(result));
        });
    });
}
// This is a function to get higher number from a list. It can be use to generate an Id
function idGenerator(items) {
    let higherID = 0;
    
    items.forEach(item => {
        if (Number(item.id) > higherID) {                   // we loop through the item list to find the higher id and we to icrement into 1
            higherID = Number(item.id);
        }
    });
    return higherID + 1;
}

// This function is useful to find an item from the database using the id
async function findOneById(id) {
    if (!id) throw new Error("Error: Id undefined");                                                                            // If id does not exist we throw an error
    const items = await readDB();                                                                                               // We get all items from the database
    const item = items.find((item) => item.id === id)                                                                           // We search into items the item with with the same id that we receive as a parameter

    if (!item) throw new Error("Error. Item not found");                                                                        // If the item does not exist we throw an error
    return item;
}

// This function is useful for getting all the items in the database.
async function findAll() {
    const items = await readDB();                                                                                               // We get all items from the database
    return items;
}

// This function is used to add items to the database.
async function addItem(item) {
    if (!item?.nombre || !item?.imagen || !item?.importe || !item?.stock) throw new Error("Error: Can't create. Data is missing") // If is missing some data we throw an error
    
    let items = await readDB();                                                                                                 // We get items from the database
    const itemWithId = { id: idGenerator(items), ...item };                                                                     // We create an item with a new id generated with idGenerator function, and we add received data

    items.push(itemWithId);                                                                                                     // add the new item to items list
    await writeDB(items);                                                                                                       // and we rewrite the database with the data

    return itemWithId;

}

// This function is used to update items from the database
async function updateItem(item) {
    if (!item?.id || !item?.imagen || !item?.nombre || !item?.importe || !item?.stock) throw new Error("Error: Can't create. Data is missing") // If is missing some data we throw an error
    let items = await readDB();                                                                                                 // We get items from the database
    const i = items.findIndex((element) => element.id === item.id);                                                             // We try to get the item index
    if (i < 0) throw new Error("Error: Id is not valid")                                                                        // If the index does not exist we throw a new error
    items[i] = item;                                                                                                            // Else update the item with the new data
    await writeDB(items);                                                                                                       // and we rewrite the database with the data

    return items[i];
}

// This function is used to remove items from the database
async function destroyItem(id) {
    if (!id) throw new Error("Error: Id is undefined");

    let items = await readDB();                                                                                                 // We get items from the database
    const i = items.findIndex((element) => element.id === Number(id))                                                           // We try to get the item index
    if (i < 0) throw new Error("Error: Id is not valid")                                                                        // If the index does not exist we throw a new error

    const item = items[i]                                                                                                       // The item will be delete is saved into a variable to be returned at the end
    items.splice(i, 1);                                                                                                         // The item is removed
    await writeDB(items)                                                                                                        // and we rewrite the database with the remaining data 

    return item;                                                                                                                // Item deleted is returned to check which item was deleted
}

module.exports = { findOneById, findAll, addItem, updateItem, destroyItem }