xdmp.securityAssert('http://marklogic.com/data-services-console', 'execute');

const {
  header,
  section,
  h2,
  h3,
  div,
  ol,
  li,
  fieldset,
  legend,
  input,
  button,
  textarea,
  label,
  span,
  a
} = require('./lib/dom-helper.sjs');
const { getServices } = require('./lib/getServices.sjs');

const serviceName = xdmp.getRequestField('service');
const endpointName = xdmp.getRequestField('endpoint');

/*
{
  helloWorld: {
    service: {
      endpointDirectory: '/helloWorld/',
      $javaClass: 'com.acme.HelloWorld'
    },
    apis: [
      {
        functionName: 'whatsUp',
        params: [
          { name: 'greeting', datatype: 'string' },
          { name: 'frequency', datatype: 'unsignedLong' }
        ],
        return: { datatype: 'string' }
      }
    ]
  }
}
*/

xdmp.setResponseOutputMethod('html');
xdmp.setResponseContentType('text/html');
xdmp.setResponseEncoding('UTF-8');

const services = getServices();

function renderService(service) {
  return section(
    { class: 'service', id: service },
    a({ href: `dataServices.sjs?service=${service}` }, h2(service)),
    header(button('+ New Endpoint')),
    ...services[service].apis.map(api => renderEndpoint(api, service))
  );
}

function renderEndpoint(api, forService) {
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
    fieldset(
      legend(api.functionName),
      ol(
        { class: 'params-list', start: 0 },
        ...api.params.map(param =>
          renderParam(param, api.functionName, forService)
        )
      )
    ),
    fieldset(
      legend('Endpoint Implementation'),
      div(
        { class: 'control' },
        textarea(
          {
            class: ['module javascript'],
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
  );
}

function renderParam(param, forAPI, forService) {
  return li(
    { class: ['control', 'input'] },
    label({ for: param.name }, param.name),
    input({ name: param.name, id: param.name, style: 'width: 20em;' }),
    span({ class: ['param-type'] }, param.datatype)
  );
}

`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Data Services: ${serviceName} > ${endpointName}</title>
    <link rel="stylesheet" type="text/css" href="./browser/endpoint.css" />
    <link rel="stylesheet" type="text/css" href="./browser/lib/codemirror.css" />
    <link rel="stylesheet" type="text/css" href="./browser/editor.css" />
    <script type="application/javascript" src="./browser/lib/redux.min.js"></script>
    <script type="application/javascript" src="./browser/lib/codemirror.js"></script>
    <script type="application/javascript" src="./browser/lib/javascript.js"></script>
    <script type="application/javascript">
      const store = Redux.createStore(
        state => state, 
        ${JSON.stringify(services)}
      );
      // console.dir( ${JSON.stringify(services)});
    </script>
  </head>
  <body>
    <header><button>+ New Service</button></header>
    ${Object.keys(services)
      .map(renderService)
      .join('')}
    <script type="application/javascript" src="./browser/editor.js"></script>
  </body>
</html>
`;
