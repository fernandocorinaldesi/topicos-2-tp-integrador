const debug = require('debug')('api-gateway:rules');
const authService = require('../services/auth.service');

// =================================================================
// CONFIGURACIÓN DE RATE LIMIT (EN MEMORIA)
// =================================================================
const requestLog = new Map();

// Límites definidos por el negocio (TP: Freemium 5, Premium 50)
const LIMITES_RPM = {
  FREEMIUM: 5,
  PREMIUM: 50
};

// Limpieza automática de logs viejos (cada 10 min)
setInterval(() => {
  const now = Date.now();
  const windowMs = 60 * 1000;
  for (const [userId, timestamps] of requestLog.entries()) {
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
    if (validTimestamps.length === 0) {
      requestLog.delete(userId);
    } else {
      requestLog.set(userId, validTimestamps);
    }
  }
}, 10 * 60 * 1000);

exports.rutaSiemprePermitida = (_1, _2, next) => {
  next();
};

/**
 * Middleware de seguridad principal:
 * 1. Valida API Key contra Auth Service.
 * 2. Aplica Rate Limit según el plan devuelto (Freemium/Premium).
 */
exports.rutaProtegida = async (req, res, next) => {
  
  // 1. OBTENER API KEY
  // Según enunciado: "header HTTP 'Authorization' indicando la API key"
  const apiKey = req.headers['authorization'];

  if (!apiKey) {
      return res.status(401).json({ error: 'Unauthorized', message: 'Falta el header Authorization con la API Key.' });
  }
  
  try {
    const path = req.originalUrl; // path completo
    const method = req.method;

    // 2. CONSULTAR AL AUTH SERVICE
    // Le enviamos la apiKey tal cual viene
    const result = await authService.validarApiKey(apiKey, path, method);

    // Si Auth Service dice que la key no existe o es inválida
    if (!result.data || !result.data.valid) {
      console.warn(`API Gateway :: API Key inválida: ${apiKey}`);
      return res.status(401).json({ error: 'Unauthorized', message: 'API Key no válida.' });
    }

    // Si la key existe pero no tiene permisos para esta ruta específica
    if (!result.data.routeAccess) {
      console.warn(`API Gateway :: Acceso denegado :: Usuario ${result.data.user_id}`);
      return res.status(403).json({ error: 'Forbidden', message: 'No tiene permisos para este recurso.' });
    }

    // =================================================================
    // 3. LOGICA DE RATE LIMITING (Freemium vs Premium)
    // =================================================================
    
    const userId = result.data.user_id; // ID interno del usuario
    const userPlan = (result.data.subscription || 'FREEMIUM').toUpperCase(); 
    
    const limitePermitido = LIMITES_RPM[userPlan] || LIMITES_RPM.FREEMIUM;
    
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minuto

    let timestamps = requestLog.get(userId) || [];
    timestamps = timestamps.filter(ts => now - ts < windowMs);

    // Verificar límite
    if (timestamps.length >= limitePermitido) {
        console.warn(`API Gateway :: Límite excedido :: Usuario ${userId} (${userPlan})`);
        
        res.set('Retry-After', 60);
        return res.status(429).json({
            error: 'Too Many Requests',
            message: `Plan ${userPlan}: Límite de ${limitePermitido} RPM excedido.`
        });
    }

    // Si pasa, registramos el uso
    timestamps.push(now);
    requestLog.set(userId, timestamps);

    // Inyectamos datos del usuario en la request para que los use el LogService o el Proxy
    req.user = { id: userId, plan: userPlan };

    console.log(`API Gateway :: OK :: Usuario ${userId} (${userPlan}) :: ${timestamps.length}/${limitePermitido} RPM`);
    
    return next();

  } catch (error) {
    console.error(`API Gateway :: Error validando API Key: ${error.message}`);
    // Si el Auth Service está caído
    return res.status(500).json({ error: 'Internal Server Error', message: 'Error validando credenciales.' });
  }
};