# Plataforma de Predicción Médica - Microservicios

\<a href="[http://www.unpaz.edu.ar](http://www.unpaz.edu.ar)"\>\<img src="[https://es.wikipedia.org/wiki/Archivo:Logo_UNLP.jpg](https://es.wikipedia.org/wiki/Archivo:Logo_UNLP.jpg)" title="UNLP" alt="UNLP"\>\</a\>

# Empezando con TP integrador para Tópicos de Ingeniería de Software 2

## Tabla de contenidos

  - [Empezando](https://www.google.com/search?q=%23Empezando)
      - [Requerimientos](https://www.google.com/search?q=%23Requerimientos)
      - [Dependencias](https://www.google.com/search?q=%23Dependencias)
      - [Diseño](https://www.google.com/search?q=%23Dise%C3%B1o)
      - [Despliegue](https://www.google.com/search?q=%23Despliegue)
      - [Uso](https://www.google.com/search?q=%23Uso)
      - [Contacto](https://www.google.com/search?q=%23Contacto)
      - [Licencia](https://www.google.com/search?q=%23Licencia)

### Empezando

La idea de este repo es implementar una arquitectura de **Microservicios** . Para ello se desarrolló una plataforma que ofrece servicios Web (APIs) para la predicción de probabilidad de neumonía en pacientes, integrando lógica de negocio en Node.js con un modelo de Inteligencia Artificial en Python.

Funciones disponibles:

  * Predicción de Neumonía (Integración con IA/LLM).
  * Gestión de suscripciones (Freemium vs Premium).
  * Sistema de Caché inteligente para optimizar recursos.
  * Auditoría y Logging centralizado.

Detalles generales y de diseño de la App:

  * Se utilizó **Node.js** para el Gateway y los servicios de orquestación.
  * Se implementó un **API Gateway** con patrón de Proxy Reverso y Rate Limiting en memoria.
  * La comunicación entre servicios es vía HTTP (REST) con seguridad interna (Service Secrets).
  * Para la persistencia de logs se utilizó **MongoDB**.
  * Se implementó una capa de **Caché** para evitar consultas repetitivas al modelo de IA.

### Requerimientos

  - Node.js (v18 o superior) instalado.
  - MongoDB (Corriendo localmente o en Docker).
  - Python 3.x (Para el servicio de inferencia).
  - Postman (Para pruebas de integración).

### Dependencias

  - **Express** (Framework web).
  - **Axios** (Comunicación HTTP entre microservicios).
  - **Http-proxy-middleware** (Enrutamiento en Gateway).
  - **Rate-limiter-flexible** (Gestión de cuotas Freemium/Premium).
  - **Node-cache** (Almacenamiento temporal en memoria).
  - **Mongoose** (Driver para MongoDB).

### Diseño

A diferencia de una arquitectura monolítica por capas, aquí dividimos el sistema por **Servicios**.

Servicio      | Puerto | Descripción
\--------------------- | -------------------- | ---------------------  
**API Gateway** | `8080` | Punto de entrada único. Se encarga del enrutamiento, validación de API Keys y Rate Limiting (5 RPM para Freemium, 50 RPM para Premium).
**Auth Service** | `3001` | Servicio de identidad. Valida las credenciales y determina el plan de suscripción del usuario.
**Predict Service** | `3002` | Orquestador principal. Gestiona la caché de predicciones y se comunica con el servicio de IA.
**Log Service** | `3003` | Servicio de auditoría asíncrono. Registra tiempos de respuesta y eventos en MongoDB.
**Model Service** | `5000` | (Externo/Python) Contenedor que ejecuta el modelo de Machine Learning y LLM.

#### Diagrama de Arquitectura

Flujo de una petición de predicción:

`Cliente` -\> `Gateway` -\> `Auth (Validar)` -\> `Gateway` -\> `Predict (Cache/IA)` -\> `Respuesta` -\> `Log (Async)`

*(Aquí puedes insertar una imagen de tu diagrama si lo deseas)*

### Despliegue

A continuación se enumerarán y explicarán los pasos para desplegar la aplicación en un entorno de desarrollo local.

#### 1- Descargar el código fuente

Desde la consola ejecutar el comando git clone (o descargar el ZIP):
`git clone <url-de-tu-repo>`

#### 2- Configurar Variables de Entorno (.env)

Cada carpeta de servicio (`api-gateway`, `auth-service`, `predict-service`, `log-service`) debe tener su propio archivo `.env` en la raíz. Puedes usar los `.env.example` como guía.

#### 3- Instalar dependencias

Debes ingresar a la carpeta de cada servicio y ejecutar la instalación.

```bash
cd api-gateway && npm install
cd ../auth-service && npm install
cd ../predict-service && npm install
cd ../log-service && npm install
```

#### 4- Ejecutar los servicios

Recomendamos abrir 4 terminales distintas para ver los logs de cada servicio en tiempo real. En cada carpeta ejecutar:

```bash
npm run dev
```

#### 5- Prueba de conexión

Una vez levantados los servicios, el sistema estará escuchando peticiones en el puerto `8080`.

### Uso

Para interactuar con la plataforma, utiliza Postman o curl apuntando al Gateway.

**Endpoint:** `POST http://localhost:8080/api/v1/predict/pneumonia`

**Header:** `Authorization: key-premium-123`

**Body (JSON):**

```json
{
  "patient_id": "12345",
  "prescriptions": ["Amoxicillin"],
  "clinical_notes": "Tos persistente."
}
```

### Contacto

Puedes enviar un mail a alguna de las siguientes direcciones:

  - fcorinaldesi@unpaz.edu.ar
  - corinaldesifernando@gmail.com

### Licencia

[](http://badges.mit-license.org)

  - **[MIT license](http://opensource.org/licenses/mit-license.php)**