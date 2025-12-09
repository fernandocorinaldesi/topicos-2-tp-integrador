const { connectDB } = require('../config/db');

exports.createLog = async (req, res) => {
    try {
        const logData = req.body;
        
        // Validar 
        if (!logData || Object.keys(logData).length === 0) {
            return res.status(400).json({ error: 'Body vacío' });
        }

        const db = await connectDB();
        const collection = db.collection('logs');

        // Agregamos timestamp de recepción 
        const newLog = {
            ...logData,
            receivedAt: new Date()
        };

        // Insertar en Mongo
        await collection.insertOne(newLog);

        // Respondemos 201 Created
        return res.status(201).json({ status: 'ok', id: newLog._id });

    } catch (error) {
        console.error('Log Service :: Error guardando log:', error);
        return res.status(500).json({ error: 'Error interno guardando log' });
    }
};