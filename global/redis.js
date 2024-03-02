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

async function commands(commands) {
  try {
    if(!client.isOpen) throw new Error('Redis is not connected');
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
    if(!client.isOpen) throw new Error('Redis is not connected');
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
    if(!client.isOpen) throw new Error('Redis is not connected');
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