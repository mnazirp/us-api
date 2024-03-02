require('dotenv').config();
const nano = require('nano');

const couch = nano({
  url: process.env.DOCS_MASTER,
  requestDefaults: {
    rejeceUnauthorized: false
  }
});
const contex = 'couchdb'

async function openByID(database, _id) {
  try {
    const db = couch.use(database);
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
    const db = couch.use(database);
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
    const db = couch.use(database);
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
    const db = couch.use(database);
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
    const db = couch.use(database);
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