require('dotenv').config();
const nano = require('nano');

const isHttps = process.env.DOC_MASTER_URL.includes('https');
/** /extra here for purpose nano can get sub-domain not just domain */
let fullUrl = (isHttps) ? process.env.DOC_MASTER_URL + '/extra' : process.env.DOC_MASTER_URL;
const couch = nano({
  url: fullUrl,
  requestDefaults: {
    rejeceUnauthorized: false
  }
});
const contex = 'couchdb';

async function openByID(database, _id) {
  try {
    const db = (isHttps) ? couch.server.use(database) : couch.use(database);
    let data = await db.get(_id);
    return {
      success: true,
      context: contex,
      func: 'openByID',
      data
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function view(database, design, view, params) {
  try {
    const db = (isHttps) ? couch.server.use(database) : couch.use(database);
    let data = await db.view(design, view, params);
    return {
      success: true,
      context: contex,
      func: 'view',
      meta: { database, design, view, params },
      data
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function insert(database, document) {
  try {
    const db = (isHttps) ? couch.server.use(database) : couch.use(database);
    let rs = await db.insert(document);
    return {
      success: true,
      context: contex,
      func: 'insert',
      data: rs
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function bulk(database, documents) {
  try {
    const db = (isHttps) ? couch.server.use(database) : couch.use(database);
    let rs = await db.bulk({ docs: documents });
    return {
      success: true,
      context: contex,
      func: 'bulk',
      data: rs
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

async function list(database) {
  try {
    const db = (isHttps) ? couch.server.use(database) : couch.use(database);
    let data = await db.list({ include_docs: true });
    return {
      success: true,
      context: contex,
      func: 'list',
      data
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = {
  openByID,
  view,
  insert,
  bulk,
  list
}