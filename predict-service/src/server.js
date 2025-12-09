const express = require('express');
const cors = require('cors');
require('dotenv').config();

const predictRoutes = require('./routes/predictRoutes');

const app = express();
const PORT = process.env.PORT || 3002; // Usamos el puerto 3002

app.use(express.json());
app.use(cors());

// Rutas
app.use('/', predictRoutes);

// Health check
app.get('/health', (req, res) => res.send('Predict Service OK'));

app.listen(PORT, () => {
    console.log(`Predict Service (con Caché) escuchando en puerto ${PORT}`);
});