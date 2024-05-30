require('dotenv').config();
const https = require('https');
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
  const useSubdomain = (url.split('/').length = 4) ? true : false
  /** /extra here for purpose nano can get sub-domain not just domain */
  let fullUrl = (useSubdomain) ? url + '/extra' : url;
  const isHttps = fullUrl.includes('https');
  let rejectUnauthorized = (process.env.NODERED_REJECT_UNAUTH && process.env.NODERED_REJECT_UNAUTH == 'true') ? true : false;
  const couch = nano({
    url: fullUrl,
    requestDefaults: {
      agent: (isHttps) ? new https.Agent({ rejectUnauthorized }) : null,
      auth: {
        username,
        password
      }
    }
  });
  let db = couch.db.use();
  db.partitionedList()
  return {
    conn: couch,
    useSubdomain
  };
}

async function openByID(server, database, _id) {
  try {
    const db = (servers[server].useSubdomain) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
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
    const db = (servers[server].useSubdomain) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
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

async function partitionedView(server, database, partitionKey, design, view, params) {
  try {
    const db = (servers[server].useSubdomain) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
    let data = await db.partitionedView(partitionKey, design, view, params);
    return {
      success: true,
      context: contex,
      func: 'partitionedView',
      meta: { database, design, view, params },
      data
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
async function find(server, database, query) {
  try {
    const db = (servers[server].useSubdomain) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
    let data = await db.find(query);
    return {
      success: true,
      context: contex,
      func: 'find',
      meta: { database, design, view, params },
      data
    }
  } catch (err) {
    throw new Error(err.message);
  }
}
async function partitionedFind(server, database, partitionKey, query) {
  try {
    const db = (servers[server].useSubdomain) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
    let data = await db.partitionedFind(partitionKey, query);
    return {
      success: true,
      context: contex,
      func: 'partitionedFind',
      meta: { database, design, view, params },
      data
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function insert(server, database, document) {
  try {
    const db = (servers[server].useSubdomain) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
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
    const db = (servers[server].useSubdomain) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
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

async function fetch(server, database, params) {
  try {
    const db = (servers[server].useSubdomain) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
    let data = await db.fetch(params);
    return {
      success: true,
      context: contex,
      func: 'fetch',
      data
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function list(server, database, params) {
  try {
    const db = (servers[server].useSubdomain) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
    let data = await db.list(params);
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

async function partitionedList(server, database, partitionKey, params) {
  try {
    const db = (servers[server].useSubdomain) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
    let data = await db.partitionedList(partitionKey, params);
    return {
      success: true,
      context: contex,
      func: 'partitionedList',
      data
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function uuids(server, count) {
  try {
    const db = (servers[server].useSubdomain) ? servers[server].conn.server : servers[server].conn;
    let data = await db.uuids(count);
    return {
      success: true,
      context: contex,
      func: 'uuids',
      data
    }
  } catch (err) {
    throw new Error(err.message);
  }
}

async function destroy(server, database, _id, _rev) {
  try {
    const db = (servers[server].useSubdomain) ? servers[server].conn.server.use(database) : servers[server].conn.use(database);
    let rs = await db.destroy(_id, _rev);
    return {
      success: true,
      context: contex,
      func: 'destroy',
      data: rs
    };
  } catch (err) {
    throw new Error(err.message);
  }
}

function getPartitionName(prefix, key) {
  return `${prefix}-${key.toLowerCase().replace(/ |_|-/g, "-")}`
}

module.exports = {
  openByID,
  view,
  insert,
  bulk,
  fetch,
  list,
  uuids,
  partitionedView,
  partitionedList,
  find,
  partitionedFind,
  destroy,
  getPartitionName,
}