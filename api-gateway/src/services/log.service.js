// api-gateway/src/services/log.service.js (CÓDIGO MODIFICADO)

const axios = require('axios');
const LOG_SERVICE_BASE_URL = process.env.LOG_SERVICE_BASE_URL || 'http://localhost:3003'; // Usar variable de entorno

const borrarInformacionSensible = (objeto) => {
    delete objeto.password;
    delete objeto.password_current;
    delete objeto.password_new;
    delete objeto.password_new_confirm;
    delete objeto.token;
    delete objeto.refreshToken;
    return objeto;
}

// Función centralizada para enviar log al servicio externo
async function sendLogToService(datosLog) {
    try {
        // Llama al Log Service externo.
        // No esperamos la respuesta para no bloquear al cliente.
        axios.post(`${LOG_SERVICE_BASE_URL}/api/v1/log`, datosLog)
            .catch(error => {
                // ogueamos el error de forma asíncrona
                console.error('Error al enviar log al Log Service:', error.message);
            });
    } catch (error) {
        // En caso de error de conexión, el request principal no debe fallar
        console.error('Error FATAL al contactar Log Service:', error.message);
    }
}

const logProxyReq = async ({ file, req }) => {
    file = file.replace('.proxy.js', '');
    const bodyLog = borrarInformacionSensible({ ...req.body });

    // Guardamos el tiempo de inicio para calcular la duración después
    req.startTime = Date.now();

    const datosLog = {
        hash: req.uniqueHash,
        origin: file,
        tipo: 'req',
        endpoint: req.baseUrl + req.path,
        data: {
            req: {
                method: req.method,
                originalUrl: req.originalUrl,
                body: bodyLog
            }
        }
    };
 
}

const logProxyRes = async ({ file, req, res, responseBody }) => {
    file = file.replace('.proxy.js', '');
    responseBody = borrarInformacionSensible(responseBody);
    
    // Calculamos la duración total
    const durationMs = req.startTime ? Date.now() - req.startTime : -1;
    
    const datosLog = {
        hash: res.uniqueHash,
        origin: file,
        tipo: 'res',
        endpoint: req.baseUrl + req.path,
        status: res.statusCode,
        durationMs: durationMs, 
        data: {
            req: {
                method: req.method,
                originalUrl: req.originalUrl
            },
            res: {
                statusCode: res.statusCode,
                body: responseBody
            }
        }
    };
    
    // Enviamos el log completo de forma asíncrona
    await sendLogToService(datosLog);
}

module.exports = {
    logProxyReq,
    logProxyRes
}