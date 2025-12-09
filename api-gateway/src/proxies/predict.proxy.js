require("dotenv").config();

exports.proxies = {
  "/api/v1/predict/pneumonia": {
    protected: true,
    target: process.env.PREDICT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      // CAMBIO: Reescribimos a string vacío "" (o sea, a la raíz)
      [`^/api/v1/predict/pneumonia`]: "", 
    },
  },
};