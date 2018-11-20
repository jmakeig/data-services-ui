declareUpdate();

const { updateModule } = require('./updateModule.sjs');

const service = 'helloWorld';
const endpoint = 'whatsUp';
const ext = 'sjs'; // TODO
const code = xdmp.getRequestBody('text');

// TODO: Debounce
updateModule(code, service, endpoint);
