module.exports = {
  apps : [{
    script: 'serve',
    name: '4202-welshsynonyms-frontend',
    env: {
      PM2_SERVE_PATH: 'dist/welshsynonyms',
      PM2_SERVE_PORT: 4202,
      PM2_SERVE_SPA: 'true',
      //PM2_SERVE_HOMEPAGE: 'dist/firstaidcu/index.html'
    }
  },
  {
    script: 'backend/server.js',
    name: '8082-welshsynonyms-backend'
  }]
};
