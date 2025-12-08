const NodeCache = require("node-cache");
const debug = require('debug')('predict-service:cache');

// Configuración: Los datos viven 10 minutos (600 segundos) en memoria
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

/**
 * Genera una clave única basada en los datos clínicos.
 * Si cambia la medicación o el ID, la clave será distinta.
 */
exports.generateKey = (data) => {
    // Usamos el ID del paciente y sus prescripciones para crear la firma
    const key = `pred_${data.patient_id}_${JSON.stringify(data.prescriptions)}`;
    return key;
};

exports.get = (key) => {
    const value = cache.get(key);
    if (value) {
        debug(`HIT: Encontrado en caché -> ${key}`);
        return value;
    }
    return null;
};

exports.set = (key, value) => {
    debug(`MISS: Guardando en caché -> ${key}`);
    return cache.set(key, value);
};