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

function Endpoint(api, forService, isSelected) {
  const guts = isSelected
    ? [
        fieldset(
          legend('Input Params'),
          ol(
            { class: 'params-list', start: 0 },
            ...api.params.map(param =>
              Param(param, api.functionName, forService)
            )
          )
        ),
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
          div(
            { class: 'control' },
            button({ name: `${api.functionName}-name` }, 'Run!')
          )
        ),
        fieldset(legend('Output'), div('OUTPUT'))
      ]
    : [];
  return section(
    { class: 'endpoint', id: api.functionName },
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

function Param(param, forAPI, forService) {
  return li(
    { class: ['control', 'input'] },
    label({ for: param.name }, param.name),
    input({ name: param.name, id: param.name, style: 'width: 20em;' }),
    span({ class: ['param-type'] }, param.datatype)
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

try {
  // FIXME: UGLY!
  exports.Nav = Nav;
  exports.Service = Service;
  exports.Endpoint = Endpoint;
  exports.Param = Param;
} catch (err) {}
