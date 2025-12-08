const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();

// Rutas
const authRoutes = require('./routes/authRoutes');

const PORT = process.env.PORT || 3001; 

app.use(cors());
app.use(express.json());

// Logging básico de requests
app.use((req, res, next) => {
    console.log(`Auth Service :: ${req.method} ${req.url}`);
    next();
});

// Configurar rutas
app.use('/auth', authRoutes);

// Manejo de 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint no encontrado en Auth Service' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Auth Service escuchando en el puerto ${PORT}`);
    console.log(`Modo simulado: Usuarios cargados en memoria.`);
});