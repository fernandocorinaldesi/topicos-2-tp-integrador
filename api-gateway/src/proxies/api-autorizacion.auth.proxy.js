require("dotenv").config();

exports.proxies = {
  "/login": {
    protected: false,
    target: process.env.API_AUTORIZACION_BASE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/login`]: "/auth/login",
    },
  },
  "/forgotpassword": {
    protected: false,
    target: process.env.API_AUTORIZACION_BASE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/forgotpassword`]: "/auth/forgotpassword",
    },
  },
  "/forgotpasswordconfirm": {
    protected: false,
    target: process.env.API_AUTORIZACION_BASE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/forgotpasswordconfirm`]: "/auth/forgotpasswordconfirm",
    },
  },
  "/refreshtoken": {
    protected: false,
    target: process.env.API_AUTORIZACION_BASE_URL,
    changeOrigin: true,
    pathRewrite: {
      [`^/refreshtoken`]: "/auth/refreshtoken",
    },
  },
};