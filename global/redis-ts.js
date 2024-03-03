require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_TS_URL
});

if (!client.isOpen) client.connect()
  .then(() => console.log('connected to redisTS'))
  .catch(err => {
    console.error(err);
    client.disconnect();
  });

client.on('error', function (err) {
  if (err.code === 'ECONNREFUSED' && client.isOpen) {
    console.error('RedisTS is not connected');
    client.disconnect();
  }
});

async function commands(commands) {
  try {
    if (!client.isOpen) await client.connect();
    let rs = [];
    for (let i = 0; i < commands.length; i++) {
      try {
        let data = await client.sendCommand(commands[i]);
        console.log('throwed');
        rs.push(data)
      } catch (err) {
        rs.push(err)
      }
    }
    return {
      success: true,
      context: 'redisTS',
      func: 'commands',
      data: rs
    };
  } catch (err) {
    client.disconnect();
    console.error('masuk error');
    throw {
      success: false,
      context: 'redisTS',
      func: 'commands',
      message: err
    };
  }
}

async function tsCreate(payloads) {
  try {
    if (!client.isOpen) await client.connect();
    let rs = [];
    for (const payload of payloads) {
      let duplicateOptions = ['BLOCK', 'FIRST', 'LAST', 'MIN', 'MAX', 'SUM'];
      let encodingOptions = ['COMPRESSED', 'UNCOMPRESSED'];
      let { key, retention, duplicatePolicy, labels, encoding } = payload;
      let command = ['TS.CREATE', key];
      if (retention == undefined) retention = 0;
      if (duplicatePolicy != undefined && duplicateOptions.includes(duplicatePolicy)) {
        command.push('DUPLICATE_POLICY');
        command.push(duplicatePolicy);
      }
      if (labels && Array.isArray(labels)) {
        command.push('LABELS');
        labels.forEach(x => command.push(x));
      }
      if (encoding != undefined && encodingOptions.includes(encoding)) {
        command.push('ENCODING');
        command.push(encoding);
      }
      try {
        let data = await client.sendCommand(command);
        rs.push(data);
      } catch (err) {
        rs.push(err)
      }
    }
    return {
      success: true,
      context: 'redisTS',
      func: 'mgetByTopics',
      data: rs
    };
  } catch (err) {
    throw {
      success: false,
      context: 'redisTS',
      func: 'mgetByTopics',
      message: err
    };
  }
}

async function tsMgetByTopics(topics) {
  try {
    if (!client.isOpen) await client.connect();
    let rs = [];
    for (let i = 0; i < topics.length; i++) {
      try {
        let data = await client.sendCommand(['TS.MGET', 'FILTER', topics[i]]);
        rs.push({
          topic: topics[i],
          data
        })
      } catch (err) {
        rs.push(err)
      }
    }
    return {
      success: true,
      context: 'redisTS',
      func: 'mgetByTopics',
      data: rs
    };
  } catch (err) {
    throw {
      success: false,
      context: 'redisTS',
      func: 'mgetByTopics',
      message: err
    };
  }
}

async function tsMrangeFilter(filters) {
  try {
    if (!client.isOpen) await client.connect();
    let rs = [];
    for (let i = 0; i < filters.length; i++) {
      try {
        let data = await client.sendCommand(['TS.MRANGE', filters[i].start.toString(), filters[i].end.toString(), 'FILTER', filters[i].key]);
        rs.push({
          topic: filters[i].key,
          data
        })
      } catch (err) {
        rs.push(err)
      }
    }
    return {
      success: true,
      context: 'redisTS',
      func: 'mrangeFilter',
      data: rs
    };
  } catch (err) {
    throw {
      success: false,
      context: 'redisTS',
      func: 'mrangeFilter',
      message: err
    };
  }
}

async function mrangeByTopics(topics, start = '-', end = '+') {
  try {
    if (!client.isOpen) await client.connect();
    let rs = [];
    for (let i = 0; i < topics.length; i++) {
      try {
        let data = await client.sendCommand(['TS.MRANGE', start, end, 'FILTER', topics[i]]);
        rs.push({
          topic: topics[i],
          data
        })
      } catch (err) {
        rs.push(err)
      }
    }
    return {
      success: true,
      context: 'redisTS',
      func: 'mrangeByTopics',
      data: rs
    };
  } catch (err) {
    throw {
      success: false,
      context: 'redisTS',
      func: 'mrangeByTopics',
      message: err
    };
  }
}

async function checkKey(key) {
  try {
    if (!client.isOpen) await client.connect();
    let rs = await client.sendCommand(['KEYS', key]);
    return {
      success: true,
      context: 'redisTS',
      func: 'checkKey',
      data: rs
    };
  } catch (err) {
    throw {
      success: false,
      context: 'redisTS',
      func: 'checkKey',
      message: err
    };
  }
}

async function checkKeys(keys) {
  try {
    if (!client.isOpen) await client.connect();
    let rs = [];
    for (let i = 0; i < keys.length; i++) {
      try {
        let data = await client.sendCommand(['KEYS', keys[i]]);
        rs.push({
          key: keys[i],
          data
        });
      } catch (err) {
        rs.push(err)
      }
    }
    return {
      success: true,
      context: 'redisTS',
      func: 'checkKeys',
      data: rs
    };
  } catch (err) {
    throw {
      success: false,
      context: 'redisTS',
      func: 'checkKeys',
      message: err
    };
  }
}

module.exports = {
  commands,
  tsCreate,
  tsMgetByTopics,
  tsMrangeFilter,
  mrangeByTopics,
  checkKey,
  checkKeys
}