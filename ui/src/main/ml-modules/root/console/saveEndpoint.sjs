xdmp.securityAssert('http://marklogic.com/data-services-console', 'execute');

const { updateModule } = require('./lib/updateModule.sjs');

const service = 'helloWorld';
const endpoint = 'whatsUp';
const ext = 'sjs'; // TODO
const code = xdmp.getRequestBody('text');

xdmp.setResponseOutputMethod('text');
xdmp.setResponseContentType('text/plain');
xdmp.setResponseEncoding('UTF-8');
xdmp.setResponseCode(201, 'Updated');

// TODO: Debounce
updateModule(code, service, endpoint);
('Done');
