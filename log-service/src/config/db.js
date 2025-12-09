const { MongoClient } = require('mongodb');
require('dotenv').config();
const connStrDocker = `mongodb://admin:admin@mongo:27017/admin`;
//const client = new MongoClient(connStrDocker);


const client = new MongoClient(process.env.MONGO_URI);

let db;

async function connectDB() {
    if (!db) {
        try {
            await client.connect();
            db = client.db(process.env.MONGO_DB_NAME);
            console.log('Log Service :: Conectado a MongoDB');
        } catch (error) {
            console.error('Log Service :: Error conectando a Mongo:', error);
            process.exit(1);
        }
    }
    return db;
}

module.exports = { connectDB };