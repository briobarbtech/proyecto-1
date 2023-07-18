const { connectToDB, disconnect } = require('../../connection_db.js');

async function generateId() {
    try {
        const db = await connectToDB("prendas");
        if (!db) throw new Error("Cannot connect to database")
        const lastItem = await db.find().sort({ codigo: -1 }).limit(1).toArray();
        return Number(lastItem[0].codigo) + 1;
    } catch (e) {
        throw new Error(e)
    } finally {
        await disconnect();
    }
}

async function getOneById(id) {
    if (!id) throw new Error("Error: Id is undefined")
    try {
        const db = await connectToDB("prendas")
        if (!db) throw new Error("Cannot connect to database")
        return await db.findOne({ codigo: id });
    } catch (e) {
        throw new Error(e)
    } finally {
        disconnect()
    }

}
async function getAllItems(query) {
    try {
        const db = await connectToDB("prendas")
        if (!db) throw new Error("Cannot connect to database")
        const items = await db.find().toArray();
        if (!items) throw new Error("There not exist")
        return items
    } catch (e) {
        throw new Error(e)
    } finally {
        disconnect()
    }
}
async function createItem(props) {
    let newItem = { codigo: await generateId(), ...props };
    try {
        const db = await connectToDB("prendas");
        if (!db) throw new Error("Cannot connect to database")
        await db.insertOne(newItem);
        return newItem;
    } catch (e) {
        throw new Error(e);
    } finally {
        await disconnect()
    }
}
async function destroyItem(id) {
    try {
        const db = await connectToDB("prendas");
        const item = await db.findOne({ codigo: { $eq: Number(id) } });
        if (!item) throw new Error({ name: "400", message: "Item not found" });
        await db.deleteOne({ codigo: { $eq: Number(id) } })
        return item;
    } catch (e) {
        throw new Error({ name: "500", message: "Se ha generado un error en el servidor", error: e });
    } finally {
        await disconnect()
    }
}
async function updateItem(params) {
    // nombre, precio, categoria
    if (!params?.nombre || !params?.precio || !params?.categoria) throw new Error("Faltan datos relevantes")
    try {
        const db = await connectToDB("prendas");
        const item = await db.findOne({ codigo: { $eq: Number(params.codigo) } })
        if (!item) throw new Error({ name: "400", message: "El código no corresponde a un mueble registrado" })
        item.precio = params.precio;
        await db.updateOne({ codigo: { $eq: Number(params.codigo) } }, { $set: item })
        return item;
    } catch (e) {
        throw new Error({ name: "500", message: "Se ha generado un error en el servidor", error: e });
    } finally {
        await disconnect();
    }
}
module.exports = { getOneById, getAllItems, createItem, destroyItem, updateItem };