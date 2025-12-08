require("dotenv").config();

exports.proxies = {
  "/api/v1/predict/pneumonia": {
    protected: true,
    target: process.env.PREDICT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/api/v1/predict/pneumonia`]: "/predict",
    },
  },
};