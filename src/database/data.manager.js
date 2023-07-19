const { connectToDB, disconnect } = require('../../connection_db.js');

async function generateId() {
    try {
        const db = await connectToDB("muebles");
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
        const db = await connectToDB("muebles")
        const item = await db.findOne({ codigo: id });
        if (!item) throw new Error("El código no corresponde a un mueble registrado");
        return item
    } catch (e) {
        throw new Error("El código no corresponde a un mueble registrado")
    } finally {
        disconnect()
    }
}

// TODO: Filters;
async function getAllItems(query) {
    try {
        const db = await connectToDB("muebles")
        if (!query?.categoria && !query?.precio_gte && !query?.precio_lte) {
            const items = await db.find().toArray();
            return items
        } else if (query.categoria) {
            const items = await db.find({ categoria: { $eq: query.categoria } }).sort({nombre: 1}).toArray();
            return items;
        } else if (query.precio_gte) {
            const items = await db.find({ precio: { $gte: query.precio_gte } }).sort({ precio: 1 }).toArray();
            return items;
        } else if (query.precio_lte) {
            const items = await db.find({ precio: { $lte: query.precio_lte } }).sort({ precio: -1 }).toArray();
            return items;
        }
    } catch (e) {
        throw new Error(e)
    } finally {
        disconnect()
    }
}
async function createItem(props) {
    if (!props?.nombre || !props?.precio || !props?.categoria) throw new Error("Faltan datos relevantes")
    let newItem = { codigo: await generateId(), ...props };
    try {
        const db = await connectToDB("muebles");
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
        const db = await connectToDB("muebles");
        const item = await db.findOne({ codigo: { $eq: Number(id) } });
        if (!item) throw new Error("El código no corresponde a un mueble registrado");
        await db.deleteOne({ codigo: { $eq: Number(id) } })
        return item;
    } catch (e) {
        throw new Error("El código no corresponde a un mueble registrado");
    } finally {
        await disconnect()
    }
}
async function updateItem(params) {
    // nombre, precio, categoria
    if (!params?.nombre || !params?.precio || !params?.categoria) throw new Error("Faltan datos relevantes")
    try {
        const db = await connectToDB("muebles");
        const item = await db.findOne({ codigo: { $eq: params.codigo } })
        if (!item) throw new Error("El código no corresponde a un mueble registrado")
        await db.updateOne({ codigo: { $eq: params.codigo } }, { $set: params })
        return params;
    } catch (e) {
        throw new Error("El código no corresponde a un mueble registrado");
    } finally {
        await disconnect();
    }
}
module.exports = { getOneById, getAllItems, createItem, destroyItem, updateItem };