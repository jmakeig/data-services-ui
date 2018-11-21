const { applyAs } = require('./util.sjs');

function updateModule(code, service, endpoint, ext = 'sjs') {
  declareUpdate();
  return xdmp.documentInsert(`/${service}/${endpoint}.${ext}`, code);
}

const opts = {
  database: xdmp.modulesDatabase(),
  isolation: 'different-transaction',
  update: 'true'
};

exports.updateModule = applyAs(updateModule, opts);
