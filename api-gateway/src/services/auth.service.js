// const encryptService = require('./encrypt')
const axios = require('axios');
require('dotenv').config();

/**
 * Middleware para que API-Gateway consulte a API-Authorization 
 * si el jwt está autorizado a acceder a ese endpoint method-ruta.
 * @todo [1] revisar el tema encriptar la API-Key con cifrado simétrico.
 * @param {json} token 
 * @param {string} path 
 * @returns {json} Resultado que devuelve la API-Authorization
 */
exports.isEndpointAllowed = async (token, path, method) => {

    const result = await axios.post(
        `${process.env.API_AUTORIZACION_BASE_URL}/auth/validar_acceso`,
        {
            token,
            path,
            method
        },
        {
            headers: {
                "X-API-Key": process.env.API_AUTORIZACION_API_KEY,
                "X-API-User": process.env.API_AUTORIZACION_API_USER
            }
        });

    return result;
}