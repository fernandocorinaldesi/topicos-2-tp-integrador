require('dotenv').config();

const app = require("./app");
const http = require('http');
const debug = require('debug')('api-gateway');

const HTTP_PORT = process.env.NODE_HTTP_PORT || 8080;
const HOST = process.env.HOST || '0.0.0.0';

var server = http.createServer(app);

server.listen(HTTP_PORT, HOST);

server.on('listening', () => {
    const addr = server.address();
    debug(`NODE:: Servidor HTTP escuchando ${addr.address}:${addr.port}.`);
});

server.on('error', (error) => {

    // Errores distintos de listen
    if (error.syscall !== 'listen') {
        // Imprimir traza y dejar que Node gestione el error.
        debug('NODE:: Error al iniciar la aplicación.');
        debug(error);
        throw error;
    }

    // Manejar explícitamente el error listen
    switch (error.code) {
        case 'EACCES':
            debug(`NODE:: Error al ejecutar la aplicación: se requieren mayores privilegios.`);
            debug(error);
            process.exit(1);
        case 'EADDRINUSE':
            debug(`NODE:: Error al ejecutar la aplicación: la dirección está en uso.`);
            debug(error);
            process.exit(1);
        // Si el error no es ninguno de los dos indicados, mostrar la traza completa.
        default:
            throw error;
    }
});

process.on('SIGTERM', () => {
    console.log('Se recibió SIGTERM. Apagando el servicio...');

    // Cerrar conexiones a las bases.
    process.exit(0);
});