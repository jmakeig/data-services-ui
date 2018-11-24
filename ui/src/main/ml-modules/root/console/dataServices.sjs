xdmp.securityAssert('http://marklogic.com/data-services-console', 'execute');

// FIXME: Total hack to provide component dependencies.
//        This really needs to be assembled in a build step.
//        That will also allow the browser code to managed outside
//        of the main source tree.
const {
  header,
  nav,
  section,
  h2,
  h3,
  div,
  ol,
  ul,
  li,
  form,
  fieldset,
  legend,
  input,
  button,
  textarea,
  label,
  span,
  a
} = require('../lib/dom-helper.sjs');

const { Nav, Service } = require('./components/components.js');
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

`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Data Services: ${serviceName}${
  endpointName ? ` > ${endpointName}` : ''
}</title>
    <link rel="stylesheet" type="text/css" href="./browser/endpoint.css" />
    <link rel="stylesheet" type="text/css" href="./browser/lib/codemirror.css" />
    <link rel="stylesheet" type="text/css" href="./browser/editor.css" />
    <script type="application/javascript" src="./browser/lib/redux.min.js"></script>
    <script type="application/javascript" src="./browser/lib/codemirror.js"></script>
    <script type="application/javascript" src="./browser/lib/javascript.js"></script>
    <script type="application/javascript">
      const initialModel = {
        service: '${serviceName}',
        endpoint: '${endpointName}',
        services: ${JSON.stringify(services)}
      };
    </script>
  </head>
  <body>
    <header><button>+ New Service</button></header>
    ${Nav(services)}
    ${Service(services[serviceName], serviceName)}
    <script type="application/javascript" src="./browser/editor.js"></script>
  </body>
</html>
`;
