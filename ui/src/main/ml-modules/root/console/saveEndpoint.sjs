xdmp.securityAssert('http://marklogic.com/data-services-console', 'execute');

const { updateEndpoint } = require('./lib/updateEndpoint.sjs');

const forService = xdmp.getRequestField('service');
const endpoint = JSON.parse(xdmp.getRequestBody('text'));
const code = endpoint.module;
delete endpoint.module;

xdmp.setResponseContentType('application/json');
xdmp.setResponseEncoding('UTF-8');

updateEndpoint(forService, endpoint, code);
