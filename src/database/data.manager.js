const { connectToDB, disconnect } = require('./mongodb.js');

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
        disconnect()
    }
}
async function destroyItem(id) {
    try {
        const db = await connectToDB("prendas");
        if (!db) throw new Error("Cannot connect to database")
        const item = await db.findOne({ codigo: { $eq: Number(id) } });
        if (!item) throw new Error("Item not found");
        await db.deleteOne({ codigo: { $eq: Number(id) } })
        return item;
    } catch (e) {
        throw new Error(e);
    } finally {
        disconnect()
    }
}
module.exports = { getOneById, getAllItems, createItem, destroyItem };