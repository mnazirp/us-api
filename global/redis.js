require('dotenv').config();
const redis = require('redis');

const client = redis.createClient({
  url: process.env.REDIS_URL
});
if (!client.isOpen) client.connect().catch(err => console.error(err));
if (client.isOpen) console.log('connected to redis-ts');

async function commands(commands) {
  try {
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
      func: 'commands',
      message: err
    };
  }
}

async function checkKey(key) {
  try {
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
      func: 'checkKey',
      message: err
    };
  }
}

async function checkKeys(keys) {
  try {
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