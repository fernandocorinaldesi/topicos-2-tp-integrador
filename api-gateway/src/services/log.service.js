const { getDB } = require('../db/mongoClient');

async function logToMongo(datosLog, esInfoCritica = false) {
    try {
        const db = await getDB();
        await db.collection('logs').insertOne({
            ...datosLog,
            createdAt: new Date()
        });
    } catch (error) {
        console.error('Error al guardar el log en Mongo:', error);
        console.error('Datos:', datosLog);
        if (esInfoCritica) throw error;
    }
}

const borrarInformacionSensible = (objeto) => {

    // Prevención de elementos a loguear
    
    // Passwords
    delete objeto.password;
    delete objeto.password_current;
    delete objeto.password_new;
    delete objeto.password_new_confirm;

    // Tokens
    delete objeto.token;
    delete objeto.refreshToken;

    return objeto;
}

const logProxyReq = async ({
    file, req
}) => {
    file = file.replace('.proxy.js', '');
    
    const bodyLog = borrarInformacionSensible({ ...req.body });

   /* await logToMongo(datosLog = {
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
    });*/
}

const logProxyRes = async ({
    file, req, res, responseBody
}) => {
    file = file.replace('.proxy.js', '');

    responseBody = borrarInformacionSensible(responseBody);

    /*await logToMongo(datosLog = {
        hash: res.uniqueHash,
        origin: file,
        tipo: 'res',
        endpoint: req.baseUrl + req.path,
        status: res.statusCode,
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
    });*/
}

module.exports = {
    logProxyReq,
    logProxyRes
}