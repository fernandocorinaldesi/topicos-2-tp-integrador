const fs = require('fs');
const path = require('path');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const crypto = require('crypto');

const { rutaProtegida, rutaSiemprePermitida } = require('../config/gatewayRules');
const { logProxyReq, logProxyRes } = require('../services/log.service');

const router = express.Router();

// Cargar todas las rutas de los servicios
const proxiesDirectory = path.join(__dirname, '..', 'proxies');

function generateUniqueHash() {
  return crypto.randomBytes(16).toString('hex');
}

fs.readdirSync(proxiesDirectory).forEach(file => {

  // Lee el objeto proxy del archivo
  const servicioRutas = require(path.join(proxiesDirectory, file)).proxies;

  // Por cada uno de los proxy crea un http proxy con el path
  Object.keys(servicioRutas).forEach((ruta) => {

    const rutaProxyConfig = servicioRutas[ruta];

    // Verificar que el proxy tenga la propiedad reglaProteccion y las requeridas por createMiddleware
    if (!rutaProxyConfig.hasOwnProperty('protected') || typeof rutaProxyConfig.protected !== 'boolean') {
      throw new Error(`Falta la propiedad 'protected' de la ruta '${ruta}'`);
    }
    if (!rutaProxyConfig.hasOwnProperty('target')) {
      throw new Error(`Falta la propiedad 'target' de la ruta '${ruta}'`);
    }
    if (!rutaProxyConfig.hasOwnProperty('changeOrigin')) {
      throw new Error(`Falta la propiedad 'changeOrigin' de la ruta '${ruta}'`);
    }
    if (!rutaProxyConfig.hasOwnProperty('pathRewrite')) {
      throw new Error(`Falta la propiedad 'pathRewrite' de la ruta '${ruta}'`);
    }

    // Crear el middleware proxy
    const { protected, ...opcionesProxyMiddleware } = rutaProxyConfig;
    const reglaProteccion = protected ? rutaProtegida : rutaSiemprePermitida;
    if (protected) {
      console.log(`API Gateway :: Nueva ruta protegida: ${ruta}`);
    }
    router.use(
      ruta,
      reglaProteccion,
      // express.json(),
      createProxyMiddleware({
        ...opcionesProxyMiddleware,

        // Manejo de la petición
        onProxyReq: (proxyReq, req, res) => {

          // Generar un hash para asociar req y res.
          const uniqueHash = generateUniqueHash();
          req.uniqueHash = uniqueHash;
          res.uniqueHash = uniqueHash;

          if (req.body && Object.keys(req.body).length > 0) {
            const bodyData = JSON.stringify(req.body);
            //proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
          }

          logProxyReq({ file, req });
          console.info(`[${res.uniqueHash} ${new Date()}] [ ${req.method} ${req.originalUrl} ] Petición enviada. Esperando respuesta...`);
        },

        // Manejo de la respuesta
        onProxyRes: (proxyRes, req, res) => {
          let chunks = [];
          proxyRes.on('data', chunk => chunks.push(chunk));

          proxyRes.on('end', () => {
            let responseBody = Buffer.concat(chunks).toString('utf8');

            // Sólo se loguean respuestas arrays, boolean, json o string.
            if (Array.isArray(responseBody) || typeof responseBody === "boolean") {
              logProxyRes({ file, req, res, responseBody });
            } else {
              if (typeof responseBody == 'string') {
                // JSON.parse tira una excepción si no puede convertir algo a json.
                try {
                  // Si no es array se intenta convertir a json.
                  responseBody = JSON.parse(responseBody);
                  logProxyRes({ file, req, res, responseBody });
                } catch (e) {
                  // es string pero no puede ser parseado a json, igual se loguea.
                  if (proxyRes.statusCode === 304) {
                    responseBody = 'no-modificado' + responseBody;
                  }
                  logProxyRes({ file, req, res, responseBody });
                }
              }
            }

            console.info(`[${res.uniqueHash} ${new Date()}] [ ${proxyRes.statusCode} ${req.method} ${req.originalUrl} ] Respuesta recibida.`);
          });
        }
      }));
  });

});

module.exports = router;