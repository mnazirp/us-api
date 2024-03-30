const envy = require('@envyjs/node');
envy.enableTracing({
  serviceName: process.env.PM2_SERVICE_NAME,
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
module.exports = {
  flowFile: "flows.json",
  flowFilePretty: true,
  httpAdminRoot: "/admin",
  httpAdminMiddleware: function (req, res, next) {
    res.set("X-Frame-Options", "sameorigin");
    next();
  },
  credentialSecret: false,
  // adminAuth: require("node-red-auth-github")({
  //   clientID: process.env.NODERED_CLIENT_ID || "empty-id",
  //   clientSecret: process.env.NODERED_CLIENT_SECRET || "empty-secret",
  //   baseURL: process.env.NODERED_BASE_URL,
  //   users: [
  //     { username: "mnazirp", permissions: ["*"] },
  //   ],
  // }),
  httpNodeCors: {
    origin: "*",
    methods: "GET,PUT,POST,DELETE"
  },
  adminAuth: {
    type: "credentials",
    users: [
      {
        username: "admin",
        password: "$2b$08$b4fq3gNtqk0aTMx.2oCN3u3duMc/OxlJJRMfMsuPY/00GgzaJ63wW",
        permissions: "*"
      },
      {
        username: "operator",
        password: "$2b$08$b4fq3gNtqk0aTMx.2oCN3u3duMc/OxlJJRMfMsuPY/00GgzaJ63wW",
        permissions: "read"
      }
    ]
  },
  contextStorage: {
    default: "memoryOnly",
    memoryOnly: { module: 'memory' },
    file: { module: 'localfilesystem' }
  },
  uiPort: process.env.PM2_PORT || 1880,
  logging: {
    console: {
      level: "info",
      metrics: false,
      audit: false
    }
  },
  exportGlobalContextKeys: false,
  externalModules: {
  },
  editorTheme: {
    theme: "midnight-red",
    palette: {},
    projects: {
      enabled: true,
      workflow: {
        mode: "manual"
      }
    },
    codeEditor: {
      lib: "monaco",
      options: {
        theme: "vs",
      }
    }
  },
  functionExternalModules: true,
  functionGlobalContext: {
    NODE_TLS_REJECT_UNAUTHORIZED: 0,
    redis: require('../global/redis'),
    redisTS: require('../global/redis-ts'),
    couchdb: require('../global/couchdb'),
    storage: require('../global/storage'),
    worker: require('worker_threads'),
    zlib: require('zlib'),
    nano: require('nano'),
  },
  debugMaxLength: 1000,
  mqttReconnectTime: 15000,
  serialReconnectTime: 15000,
}
