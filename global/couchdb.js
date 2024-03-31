require('dotenv').config();
const nano = require('nano');

const contex = 'couchdb';
const servers = {
  master: setConnection(process.env.DOC_MASTER_DOMAIN, process.env.DOC_MASTER_USER, process.env.DOC_MASTER_PASSWORD),
  bucket: setConnection(process.env.DOC_BUCKET_DOMAIN, process.env.DOC_BUCKET_USER, process.env.DOC_BUCKET_PASSWORD),
  series: setConnection(process.env.DOC_SERIES_DOMAIN, process.env.DOC_SERIES_USER, process.env.DOC_SERIES_PASSWORD),
  map: setConnection(process.env.DOC_MAP_DOMAIN, process.env.DOC_MAP_USER, process.env.DOC_MAP_PASSWORD),
  transaction: setConnection(process.env.DOC_TRANS_DOMAIN, process.env.DOC_TRANS_USER, process.env.DOC_TRANS_PASSWORD),
};

function setConnection(url, username, password) {
  console.log(url)
  const isHttps = url.includes('https');
  /** /extra here for purpose nano can get sub-domain not just domain */
  let fullUrl = (isHttps) ? url + '/extra' : url;
  const couch = nano({
    url: fullUrl,
    requestDefaults: {
      rejeceUnauthorized: false,
      auth: {
        username,
        password
      }
    }
  });
  return {
    conn: couch,
    isHttps
  };
}

async function openByID(server, database, _id) {
  try {
    const db = (servers[server].isHttps) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
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

async function view(server, database, design, view, params) {
  try {
    const db = (servers[server].isHttps) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
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

async function insert(server, database, document) {
  try {
    const db = (servers[server].isHttps) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
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

async function bulk(server, database, documents) {
  try {
    const db = (servers[server].isHttps) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
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

async function list(server, database) {
  try {
    const db = (servers[server].isHttps) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
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