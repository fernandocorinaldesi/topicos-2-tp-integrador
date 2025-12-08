const { MongoClient } = require('mongodb');
let mongoCliente;

async function connectToMongo() {
    if (!mongoCliente) {
        const URL = `mongodb://${process.env.API_GATEWAY_MONGO_BD_USER}:${process.env.API_GATEWAY_MONGO_BD_PASSWORD}@${process.env.API_GATEWAY_MONGO_BD_HOST}:${process.env.API_GATEWAY_MONGO_BD_PORT}/${process.env.API_GATEWAY_MONGO_BD_DATABASE}`;
        console.log('Conectando a MongoDB...');
        mongoCliente = new MongoClient(URL);
        await mongoCliente.connect();
        console.log('Conexión a MongoDB establecida.');
    }
    return mongoCliente.db(`${process.env.API_GATEWAY_MONGO_BD_DATABASE}`);
}

async function getDB() {
    if (!mongoCliente) {
        await connectToMongo();
    }
    return mongoCliente.db(`${process.env.API_GATEWAY_MONGO_BD_DATABASE}`);
}

module.exports = {
    connectToMongo,
    getDB
};