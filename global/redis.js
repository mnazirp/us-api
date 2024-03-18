require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL
});

if (!client.isOpen) client.connect()
  .then(() => console.log('connected to redis'))
  .catch(err => {
    console.error(err);
    client.disconnect();
  });

client.on('error', function (err) {
  if (err.code === 'ECONNREFUSED' && client.isOpen) {
    console.error('Redis is not connected');
    client.disconnect();
  }
});

async function commands(commands) {
  try {
    if (!client.isOpen) await client.connect();
    let rs = [];
    for (let i = 0; i < commands.length; i++) {
      let data = await client.sendCommand(commands[i]);
      rs.push(data)
    }
    return {
      success: true,
      context: 'redis',
      func: 'commands',
      data: rs
    };
  } catch (err) {
    throw {
      success: false,
      context: 'redis',
      func: 'commands',
      message: err.toString()
    };
  }
}

async function checkKey(key) {
  try {
    if (!client.isOpen) await client.connect();
    let rs = await client.sendCommand(['KEYS', key]);
    return {
      success: true,
      context: 'redis',
      func: 'checkKey',
      data: rs
    };
  } catch (err) {
    throw {
      success: false,
      context: 'redis',
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
      let data = await client.sendCommand(['KEYS', keys[i]]);
      rs.push({
        key: keys[i],
        data
      });
    }
    return {
      success: true,
      context: 'redis',
      func: 'checkKeys',
      data: rs
    };
  } catch (err) {
    throw {
      success: false,
      context: 'redis',
      func: 'checkKeys',
      message: err
    };
  }
}

module.exports = {
  commands,
  checkKey,
  checkKeys
}