const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/droidcam', // Ruta de proxy (puedes cambiarla)
    createProxyMiddleware({
      target: 'http://192.168.0.101:4747', // Dirección IP de DroidCam
      changeOrigin: true,
    })
  );
};
