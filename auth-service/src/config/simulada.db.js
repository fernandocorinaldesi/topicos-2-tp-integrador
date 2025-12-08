/**
 * Base de datos simulada de usuarios y API Keys.
 * Aquí definimos quién es PREMIUM y quién es FREEMIUM.
 */
const users = [
    {
        id: "medico_premium_01",
        name: "Dr. Gregory House",
        apiKey: "key-premium-123", // Esta es la key que usarás en Postman
        subscription: "PREMIUM",   // 50 RPM + Explicación
        roles: ["medic", "admin"]
    },
    {
        id: "estudiante_freemium_01",
        name: "Estudiante Juan",
        apiKey: "key-freemium-456", // Key para probar límites bajos
        subscription: "FREEMIUM",   // 5 RPM, sin explicación
        roles: ["student"]
    }
];

// Token secreto para comunicación entre microservicios (Gateway -> Auth)
const serviceSecret = process.env.AUTH_SERVICE_SECRET || "secreto_interno";

module.exports = { users, serviceSecret };