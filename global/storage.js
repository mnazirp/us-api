require('dotenv').config();
const Minio = require('minio');

const mClient = new Minio.Client({
  endPoint: process.env.MINIO_HOST,
  port: process.env.MINIO_PORT,
  useSSL: process.env.MINIO_USE_SSL,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY
});

async function uploadFile(bucket, fileName, filePath) {
  try {
    const rs = await mClient.fPutObject(bucket, fileName, filePath);
    return {
      success: true,
      context: 'minio',
      func: 'uploadFile',
      meta: { bucket, fileName, filePath },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function downloadFile(bucket, fileName) {
  try {
    const rs = await mClient.getObject(bucket, fileName);
    return {
      success: true,
      context: 'minio',
      func: 'downloadFile',
      meta: { bucket, fileName },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function deleteFile(bucket, fileName) {
  try {
    const rs = await mClient.removeObject(bucket, fileName);
    return {
      success: true,
      context: 'minio',
      func: 'deleteFile',
      meta: { bucket, fileName },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function listBuckets() {
  try {
    const rs = await mClient.listBuckets();
    return {
      success: true,
      context: 'minio',
      func: 'listBuckets',
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function listObjects(bucket) {
  try {
    const rs = await mClient.listObjects(bucket);
    return {
      success: true,
      context: 'minio',
      func: 'listObjects',
      meta: { bucket },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function listObjectsV2(bucket) {
  try {
    const rs = await mClient.listObjectsV2(bucket);
    return {
      success: true,
      context: 'minio',
      func: 'listObjectsV2',
      meta: { bucket },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function listObjectsV1(bucket) {
  try {
    const rs = await mClient.listObjectsV1(bucket);
    return {
      success: true,
      context: 'minio',
      func: 'listObjectsV1',
      meta: { bucket },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function makeBucket(bucket) {
  try {
    const rs = await mClient.makeBucket(bucket);
    return {
      success: true,
      context: 'minio',
      func: 'makeBucket',
      meta: { bucket },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function removeBucket(bucket) {
  try {
    const rs = await mClient.removeBucket(bucket);
    return {
      success: true,
      context: 'minio',
      func: 'removeBucket',
      meta: { bucket },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function removeObject(bucket, fileName) {
  try {
    const rs = await mClient.removeObject(bucket, fileName);
    return {
      success: true,
      context: 'minio',
      func: 'removeObject',
      meta: { bucket, fileName },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function statObject(bucket, fileName) {
  try {
    const rs = await mClient.statObject(bucket, fileName);
    return {
      success: true,
      context: 'minio',
      func: 'statObject',
      meta: { bucket, fileName },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function fGetObject(bucket, fileName) {
  try {
    const rs = await mClient.fGetObject(bucket, fileName);
    return {
      success: true,
      context: 'minio',
      func: 'fGetObject',
      meta: { bucket, fileName },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function fPutObject(bucket, fileName) {
  try {
    const rs = await mClient.fPutObject(bucket, fileName);
    return {
      success: true,
      context: 'minio',
      func: 'fPutObject',
      meta: { bucket, fileName },
      data: rs
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  listBuckets,
  listObjects,
  listObjectsV2,
  listObjectsV1,
  makeBucket,
  removeBucket,
  removeObject,
  statObject,
  fGetObject,
  fPutObject
};