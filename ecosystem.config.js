module.exports = {
  apps : [{
    name: 'welshsynonyms-frontend',
    script: 'node_modules/@angular/cli/bin/ng',
    args: 'serve --port 4202',
    instances: 1,
    autorestart: true,
    watch: '.'
  }],

  deploy : {
  }
};
