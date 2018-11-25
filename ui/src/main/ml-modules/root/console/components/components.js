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
    table(
      { class: 'params-list' },
      thead(
        tr(th(), th('Name'), th('Datatype'), th('Value'), th({ colSpan: 2 }))
      ),
      tbody(
        ...params.map((param, index) => Param(param, index, forAPI, forService))
      )
    ),
    div(
      { class: 'control' },
      button({ class: ['param-add'], title: 'Add parameter' }, '+')
    )
  );
}

function Param(param, index, forAPI, forService) {
  return tr(
    td(`${index}.`),
    th(
      { class: ['param-name'] },
      null === param.name
        ? input({
            class: ['param-name'],
            dataset: {
              index
            }
          })
        : label({ for: param.name }, param.name)
    ),
    td(
      { class: ['param-datatype'] },
      null === param.datatype ? ParamDatatype(index) : param.datatype
    ),
    td(ParamValue(param)),

    td(
      button(
        {
          class: ['param-remove'],
          title: 'Delete param'
        },
        '-'
      )
    ),
    td(
      null === param.name || null === param.datatype
        ? button({ class: ['param-save'], dataset: { index } }, 'Save')
        : ''
    )
  );
}

function ParamValue({
  name,
  datatype,
  desc,
  nullable = false,
  multiple = false
}) {
  switch (datatype) {
    case 'boolean':
      return select(
        nullable ? option({ value: 'null' }, '—') : undefined,
        option('false'),
        option('true')
      );
    case 'array':
    case 'object':
    case 'jsonDocument':
    case 'textDocument':
    case 'xmlDocument':
      return textarea();
    default:
      return input({
        name: `${name}-value`,
        style: { width: '20em' },
        class: [`param-value`, `param-datatype-${datatype}`]
      });
  }
}

function ParamDatatype(index) {
  return select(
    {
      class: ['param-datatype'],
      dataset: {
        index
      }
    },
    optgroup(
      { label: 'Atomics' },
      ...[
        'boolean',
        'date',
        'dateTime',
        'dayTimeDuration',
        'decimal',
        'double',
        'float',
        'int',
        'long',
        'string',
        'time',
        'unsignedInt',
        'unsignedLong'
      ]
        .sort()
        .map(atomic => option({ value: atomic }, atomic))
    ),
    optgroup(
      { label: 'Nodes' },
      ...[
        'array',
        'object',
        'binaryDocument',
        'jsonDocument',
        'textDocument',
        'xmlDocument'
      ].map(node => option({ value: node }, node))
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
