require('dotenv').config();
const Minio = require('minio');

const mClient = new Minio.Client({
  endPoint: process.env.MINIO_HOST,
  port: Number(process.env.MINIO_PORT),
  useSSL: (process.env.MINIO_USE_SSL.toLowerCase() === 'true') ? true : false,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

async function saveJsonFile(bucket, fileFullPath, jsonString, meta) {
  try {
    const jsonStream = require('stream').Readable.from(jsonString);
    console.log({ bucket, fileFullPath, meta })
    const rs = await mClient.putObject(bucket, fileFullPath, jsonStream, meta);
    console.log(rs)
    return {
      success: true,
      context: 'minio',
      func: 'saveJsonFile',
      meta: { bucket, fileFullPath, meta },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  saveJsonFile,
};