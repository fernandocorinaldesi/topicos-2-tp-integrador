const { users, serviceSecret } = require('../config/simulada.db');
const debug = require('debug')('auth-service:controller');

exports.validateApiKey = (req, res) => {
    // 1. Obtener datos del body (que envía el Gateway)
    const { apiKey, path, method } = req.body;
    
    // 2. Seguridad entre servicios (Opcional pero recomendado)
    // Verificamos que quien nos llama sea realmente el Gateway
    const gatewaySecret = req.headers['x-service-secret'];
    if (gatewaySecret !== serviceSecret) {
        console.warn('Auth Service :: Intento de acceso no autorizado desde origen desconocido.');
        return res.status(403).json({ 
            valid: false, 
            message: "Acceso denegado: Origen no confiable." 
        });
    }

    debug(`Validando API Key: ${apiKey}`);

    // 3. Buscar usuario por API Key
    // (Aquí harías la consulta a MongoDB: db.users.findOne({ apiKey: apiKey }))
    const user = users.find(u => u.apiKey === apiKey);

    // CASO A: Usuario no encontrado
    if (!user) {
        return res.status(401).json({
            valid: false,
            message: "API Key no válida."
        });
    }

    // CASO B: Validación de permisos (RBAC simple)
    // Por ahora permitimos todo, pero aquí podrías filtrar por 'path'
    const routeAccess = true; 

    if (!routeAccess) {
        return res.status(403).json({
            valid: true,
            routeAccess: false,
            user_id: user.id,
            message: "Sin permisos para esta ruta."
        });
    }

    // CASO C: Éxito (Usuario encontrado y validado)
    // Devolvemos la info crítica: user_id y subscription (para el Rate Limit del Gateway)
    return res.status(200).json({
        valid: true,
        routeAccess: true,
        user_id: user.id,
        subscription: user.subscription, // IMPORTANTE: 'FREEMIUM' o 'PREMIUM'
        name: user.name
    });
};