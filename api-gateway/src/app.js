// =======================================
// === IMPORTS
// =======================================

// Generales
const express = require('express');
const app = express();
const utilsError = require('./config/errorHandler');
require('dotenv').config();

// Logs
const path = require('path');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');

// Seguridad
const helmet = require("helmet");
// const rateLimit = require('./config/seguridad/rateLimit');
const cors = require('cors');

// =======================================
// === SEGURIDAD
// =======================================
app.use(helmet());

app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true, // this is new
}));

// Rutas del gateway
const gatewayRouter = require('./routes/gatewayRouter');

// =======================================
// === API GATEWAY
// === Cada ruta es un middleware http proxy
// =======================================
app.use(gatewayRouter);

// =======================================
// === LOGS DE APLICACIÓN
// =======================================
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',// rotacion diaria
  path: path.join(__dirname, 'log')
});
app.use(morgan('combined', { stream: accessLogStream }));

// =======================================
// === RUTAS
// =======================================
// app.use(router);

// =======================================
// === MIDDLEWARES GENERALES
// =======================================
app.use(express.json());

// ?? ###### JWT APP LEVEL MIDDLEWARE
app.use((req, res, next) => {
   next();
});

// =======================================
// === CIERRE DE CONEXIÓN MONGO
// =======================================

// Manejo de cierre de conexión al terminar la aplicación
process.on('SIGINT', async () => {
  const { mongoCliente } = require('./db/mongoClient');
  if (mongoCliente) {
      await mongoCliente.close();
      console.log('Conexión a MongoDB cerrada.');
  }
  process.exit(0);
});

// =======================================
// === GESTIÓN DE ERRORES
// =======================================

// Gestión de errores / excepciones
app.use(utilsError.errorHandler);

// 404
app.use((req, res, next)=>{
    res.status(404).json({error: true, mensaje: "Ruta no encontrada."});
});

// =======================================
// === APP
// =======================================
module.exports = app;