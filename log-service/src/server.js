const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
require('dotenv').config();

const logRoutes = require('./routes/logRoutes');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Conectar a la DB antes de escuchar
connectDB().then(() => {
    
    // Configurar rutas base
    app.use('/api/v1', logRoutes);

    app.listen(PORT, () => {
        console.log(`Log Service escuchando en puerto ${PORT}`);
    });
});