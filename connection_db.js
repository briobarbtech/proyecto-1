require('dotenv').config();
const { MongoClient } = require("mongodb");
// Database connection
const client = new MongoClient(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    minPoolSize: 15
});
const database_name = process.env.DATABASE_NAME;

async function connect() {
    console.log("Connecting")
    let connection = null;
    try {
        connection = await client.connect();
        console.log('Connected successfully to database')


    } catch (error) {
        throw new Error(error)
    }
    return connection;
}

async function disconnect() {
    console.log("Disconnect success")
    try {
        await client.close();
    } catch (error) {
        throw new Error(error)
    }
}
async function connectToDB(collectionName) {
    const connection = await connect();
    const db = connection.db(database_name)
    const collection = db.collection(collectionName)
    return collection;
}
module.exports = {
    connectToDB,
    disconnect
}