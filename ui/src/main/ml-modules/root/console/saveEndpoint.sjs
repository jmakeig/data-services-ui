xdmp.securityAssert('http://marklogic.com/data-services-console', 'execute');

const { updateModule } = require('./lib/updateModule.sjs');

const service = xdmp.getRequestField('service');
const endpoint = xdmp.getRequestField('endpoint');
const type = xdmp.getRequestField('type');
const moduleBody = xdmp.getRequestBody('text');

xdmp.setResponseOutputMethod('text');
xdmp.setResponseContentType('text/plain');
xdmp.setResponseEncoding('UTF-8');
xdmp.setResponseCode(201, 'Updated');

updateModule(moduleBody, service, endpoint, type);
('Done');
