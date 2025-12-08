const axios = require('axios');
const cacheService = require('../services/cache.service');

// URL del servicio de tu compañero (se configura en .env)
const PYTHON_SERVICE_URL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';

exports.getPrediction = async (req, res) => {
    try {
        const patientData = req.body;
        
        // 1. Validaciones básicas
        if (!patientData.patient_id || !patientData.prescriptions) {
            return res.status(400).json({ error: "Faltan datos obligatorios (patient_id, prescriptions)." });
        }

        // 2. LÓGICA DE CACHÉ
        const cacheKey = cacheService.generateKey(patientData);
        const cachedResponse = cacheService.get(cacheKey);

        if (cachedResponse) {
            // ¡Ahorramos una llamada a la IA!
            return res.status(200).json({
                source: 'cache',
                ...cachedResponse
            });
        }

        // 3. Si no está en caché, llamamos a la IA (Python)
        // Le pasamos el header del plan (inyectado por el Gateway)
        const userPlan = req.headers['x-user-plan'] || 'FREEMIUM';
        
        console.log(`Consultando modelo IA (Plan: ${userPlan})...`);
        
        // Simulamos la llamada a Python (Reemplazar con la URL real)
        const responseIA = await axios.post(`${PYTHON_SERVICE_URL}/predict`, patientData, {
             // Opcional: pasar params si el servicio Python lo requiere
             params: { mode: userPlan }
        });
        
        const prediction = responseIA.data;

        // 4. Filtrar respuesta según el Plan (Requerimiento del TP)
        // FREEMIUM: Solo true/false y score. PREMIUM: Incluye explicación.
        let finalResponse = {
            pneumonia: prediction.pneumonia,
            score: prediction.score
        };

        if (userPlan === 'PREMIUM') {
            finalResponse.explanation = prediction.explanation || "Explicación detallada generada por IA...";
        }

        // 5. Guardar el resultado limpio en Caché
        cacheService.set(cacheKey, finalResponse);

        return res.status(200).json({
            source: 'model',
            ...finalResponse
        });

    } catch (error) {
        console.error('Error en Predict Controller:', error.message);
        // Manejo de error si el servicio de Python está caído
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ error: "El servicio de IA no está disponible en este momento." });
        }
        return res.status(500).json({ error: "Error interno procesando la predicción." });
    }
};