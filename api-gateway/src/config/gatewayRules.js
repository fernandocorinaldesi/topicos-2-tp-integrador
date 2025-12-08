const debug = require('debug')('api-autorizacion');
const authService = require('../services/auth.service');

exports.rutaSiemprePermitida = (_1, _2, next) => {
  next();
};

/**
 * @description Lee el token jwt de req.headers.authorization y consulta a api-autorizacion
 * si el usuario tiene permitido el endpoint de req (originalUrl+method).
 * @returns next() si validación ok, next(error) si validación no ok.
 */
exports.rutaProtegida = async (req, res, next) => {
  
  // Extraer el token JWT del Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Verificar si el token tiene habilitado el acceso a path/method
  try {
    const path = req.originalUrl.slice(1);
    const method = req.method;

    const result = await authService.isEndpointAllowed(token, path, method);

    if (!result.data.jwtValid) {
      console.warn(`API Gateway :: JWT inválido.`);
      return res.status(401).json({ resultado: 'Unauthorized', ...result.data });
    }

    if (!result.data.routeAccess) {
      console.warn(`API Gateway :: Denegado :: Usuario ${result.data.user_id} :: ${method} ${path}.`);
      return res.status(403).json({ resultado: 'Forbidden', ...result.data });
    }

    console.log(`API Gateway :: Permitido :: Usuario ${result.data.user_id} :: ${method} ${path}.`);
    return next();
  } catch (error) {
    /** 
     * @todo Verificar si es un 400 de API Autorización por no enviar los API-Key.
    */
    const mensaje = `API Gateway :: Error en el llamado a authService.isEndpointAllowed  ${error.message}.`;
    console.error(mensaje);
    debug(mensaje);
    console.error(`API Gateway:: Req:`);
    console.error(req);
    console.error(`API Gateway:: Detalles del error:`);
    console.error(error);
    return next(error);
  }
};