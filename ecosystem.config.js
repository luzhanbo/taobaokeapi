module.exports = {
  apps: [{
    name: 'open-demo',
    script: 'server/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      port: 9090
    }
  }
  ]
};
