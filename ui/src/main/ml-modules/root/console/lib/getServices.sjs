xdmp.securityAssert('http://marklogic.com/data-services-console', 'execute');

const { applyAs } = require('./util.sjs');

// For exmaple, a better MarkLogic eval:
// const evil = applyAs(
//   eval, // Built-in eval
//   {
//     database: 'Documents',
//     isolation: 'different-transaction'
//   }
// );

function getServices() {
  function match(pattern) {
    return Array.from(cts.uriMatch(pattern), uri => uri.valueOf());
  }

  return match('*/service.json').reduce((services, service) => {
    const path = service.slice(0, service.length - 12);
    const apis = match(`${path}*.api`).map(uri =>
      Object.assign(cts.doc(uri).toObject(), {
        module: cts.doc(uri.replace(/\.api$/, '.sjs')).toObject()
      })
    );
    services[path.slice(1, path.length - 1)] = {
      service: cts.doc(service).toObject(),
      apis: [...apis]
    };
    return services;
  }, {});
}

const opts = {
  database: xdmp.modulesDatabase(),
  isolation: 'different-transaction'
};

exports.getServices = applyAs(getServices, opts);