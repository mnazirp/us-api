require('dotenv').config();
module.exports = {
  apps: [{
    name: process.env.PM2_SERVICE_NAME,
    script: "./node_modules/node-red/red.js",
    args: "--port ${process.env.PORT} --settings ./.node-red/settings.js --userDir ./.node-red",
    autorestart: (process.env.PM2_AUTO_RESTART.toLowerCase() == 'true') ? true : false,
    max_restarts: Number(process.env.PM2_MAX_RESTARTS),
    instances: 1,
    watch: false,
    max_memory_restart: process.env.PM2_MAX_MEMORY_RESTART,
    interpreter: process.env.PM2_INTERPRETER,
    exec_mode: "fork"
  }]
}
