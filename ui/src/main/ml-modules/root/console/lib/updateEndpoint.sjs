const { applyAs } = require('./util.sjs');

function updateEndpoint(forService, endpoint, code = 'DEFAULT') {
  declareUpdate();
  const apiURI = `/${forService}/${endpoint.functionName}.api`;
  xdmp.documentInsert(apiURI, xdmp.toJSON(endpoint));
  const moduleURI = `/${forService}/${endpoint.functionName}.sjs`;
  xdmp.documentInsert(moduleURI, xdmp.toJSON(String(code)));
  return [apiURI, moduleURI];
}

const opts = {
  database: xdmp.modulesDatabase(),
  isolation: 'different-transaction',
  update: 'true'
};

exports.updateEndpoint = applyAs(updateEndpoint, opts);
