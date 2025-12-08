const axios = require('axios');
require('dotenv').config();

const AUTH_URL = process.env.API_AUTORIZACION_BASE_URL || 'http://localhost:3001';

/**
 * Consulta al Auth Service si la API Key es válida.
 */
exports.validarApiKey = async (apiKey, path, method) => {
    try {
        // Hacemos POST al servicio de autorización
        // Enviamos 'apiKey' en el body
        const response = await axios.post(
            `${AUTH_URL}/auth/validate`,
            {
                apiKey, 
                path,
                method
            },
            {
                // Headers internos de seguridad 
                headers: {
                    "X-Service-Secret": process.env.AUTH_SERVICE_SECRET || "secreto_interno"
                }
            }
        );
        return response; // axios devuelve la data en response.data
    } catch (error) {
        // Manejo de errores si el Auth Service responde 401/403
        if (error.response) {
            return error.response;
        }
        throw error;
    }
}