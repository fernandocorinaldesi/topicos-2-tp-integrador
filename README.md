# Plataforma de Predicción Médica - Microservicios

<a href="http://www.unlp.edu.ar">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Logo_UNLP.jpg/960px-Logo_UNLP.jpg" title="UNLP" alt="UNLP" width="200">
</a>

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

La arquitectura se divide en servicios independientes comunicados vía HTTP (REST).

| Servicio | Puerto | Responsabilidad Principal |
| :--- | :---: | :--- |
| **API Gateway** | `8080` | **Entry Point**. Enrutamiento, Rate Limiting (5/50 RPM) y validación previa. |
| **Auth Service** | `3001` | **Identidad**. Valida API Keys y determina el plan (Freemium/Premium). |
| **Predict Service** | `3002` | **Orquestador**. Gestiona la lógica de negocio, Caché y conexión con IA. |
| **Log Service** | `3003` | **Auditoría**. Registro asíncrono de eventos en MongoDB. |
| **Model Service** | `5000` | **IA Core**. Contenedor externo (Python) con el modelo de ML/LLM. |
#### Diagrama de Arquitectura

Flujo de una petición de predicción:

`Cliente` -\> `Gateway` -\> `Auth (Validar)` -\> `Gateway` -\> `Predict (Cache/IA)` -\> `Respuesta` -\> `Log (Async)`

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