const { staticCheck } = require('./staticCheck.sjs');

const module = xdmp.getRequestField('module'); // TODO: Get from body

try {
  staticCheck(module);
  xdmp.setResponseCode(200, 'OK');
} catch (err) {
  xdmp.setResponseCode(400, 'Nope');
  xdmp.setResponseContentType('application/json');
  xdmp.setResponseEncoding('UTF-8');
  const e = {
    name: err.name,
    message: err.message,
    stack: err.stackFrames.splice(-2) // Account for the eval and caller
  };
  e;
}
