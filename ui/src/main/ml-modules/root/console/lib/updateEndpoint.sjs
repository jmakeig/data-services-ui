const { applyAs } = require('./util.sjs');

function updateEndpoint(forService, endpoint, code = 'DEFAULT') {
  declareUpdate();
  xdmp.documentInsert(
    `/${forService}/${endpoint.functionName}.api`,
    xdmp.toJSON(endpoint)
  );
  xdmp.documentInsert(
    `/${forService}/${endpoint.functionName}.sjs`,
    xdmp.toJSON(String(code))
  );
}

const opts = {
  database: xdmp.modulesDatabase(),
  isolation: 'different-transaction',
  update: 'true'
};

exports.updateEndpoint = applyAs(updateEndpoint, opts);
