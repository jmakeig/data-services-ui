declareUpdate();

function updateModule(code, service, endpoint, ext = 'sjs') {
  xdmp.documentInsert(`/${service}/${endpoint}.${ext}`, code);
}

exports.updateModule = module.amp(updateModule);
