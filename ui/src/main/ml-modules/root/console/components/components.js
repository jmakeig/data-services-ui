function Service(service, name, selectedEndpoint) {
  return section(
    { class: 'service', id: service },
    a({ href: `dataServices.sjs?service=${name}` }, h2(name)),
    header(
      form(
        { method: 'get', action: `newEndpoint.sjs` },
        input({ type: 'hidden', name: 'service', value: name }),
        button({ type: 'submit' }, '+ New Endpoint')
      )
    ),
    ...service.apis.map(api =>
      Endpoint(api, name, selectedEndpoint === api.functionName)
    )
  );
}

// function shallowEqual(a, b) {
//   if (a.length !== b.length) {
//     return false;
//   }
//   for (let i = 0; i < a.length; i++) {
//     if (a[i] !== b[i]) return false;
//   }
//   return true;
// }

// function memo(fct) {
//   let lastParams = [],
//     lastReturn;

//   return function _memo(...params) {
//     if (shallowEqual(lastParams, params)) {
//       console.info('Returned cached value', fct.name);
//       return lastReturn;
//     }
//     lastParams = params;
//     lastReturn = fct(...params);
//     return lastReturn;
//   };
// }

function Endpoint(api, forService, isSelected) {
  const guts = isSelected
    ? [
        Params(api.params, api.functionName, forService),
        fieldset(
          legend('Endpoint Implementation'),
          div(
            { class: 'control' },
            textarea(
              {
                class: ['module', 'javascript'],
                name: `${api.functionName}-module`,
                spellcheck: false
              },
              api.module
            )
          ),
          div({ class: 'control' }, button({ id: `Run` }, 'Run!'))
        ),
        fieldset(legend('Output'), div('OUTPUT'))
      ]
    : [];
  return section(
    {
      class: ['endpoint', isSelected ? 'selected' : undefined],
      id: api.functionName
    },
    a(
      {
        href: `dataServices.sjs?service=${forService}&endpoint=${
          api.functionName
        }`
      },
      h3(api.functionName)
    ),
    ...guts
  );
}

function Params(params, forAPI, forService) {
  return fieldset(
    { id: `Params-${forService}-${forAPI}` },
    legend('Input Params'),
    ol(
      { class: 'params-list', start: 0 },
      ...params.map(param => Param(param, forAPI, forService))
    ),
    div(
      { class: 'control' },
      button({ class: ['param-add'], title: 'Add parameter' }, '+')
    )
  );
}

function Param(param, forAPI, forService) {
  return li(
    { class: ['control', 'input'] },
    label({ for: param.name }, param.name),
    input({
      name: param.name,
      id: param.name,
      style: { width: '20em' }
    }),
    span({ class: ['param-type'] }, param.datatype),
    // button({ class: ['parm-edit'], title: 'Delete param' }, '✐'),
    button(
      {
        class: ['param-remove'],
        title: 'Delete param'
      },
      '-'
    )
  );
}

function Nav(services) {
  function url(s, e) {
    const u = `dataServices.sjs?service=${s}`;
    if (!e) return u;
    return `${u}&endpoint=${e}`;
  }
  return nav(
    ul(
      ...Object.keys(services).map(service =>
        li(
          a({ href: url(service) }, service),
          ul(
            ...services[service].apis.map(api =>
              li(a({ href: url(service, api.functionName) }, api.functionName))
            )
          )
        )
      )
    )
  );
}

// FIXME: Conditional export only for MarkLogic rendering. Ugly!
try {
  exports.Nav = Nav;
  exports.Service = Service;
  exports.Endpoint = Endpoint;
  exports.Param = Param;
} catch (err) {}
