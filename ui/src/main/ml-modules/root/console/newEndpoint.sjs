const {
  html,
  head,
  title,
  body,
  form,
  input,
  textarea,
  button
} = require('./lib/dom-helper.sjs');
const { updateEndpoint } = require('./lib/updateEndpoint.sjs');

const forService = xdmp.getRequestField('service');

if ('GET' === xdmp.getRequestMethod()) {
  const template = {
    functionName: 'test',
    params: [{ name: 'asdf', datatype: 'string' }],
    return: { datatype: 'string' }
  };
  html(
    head(title('New Endpoint')),
    body(
      'newEndpoint.sjs',
      form(
        { action: 'newEndpoint.sjs', method: 'post' },
        input({ name: 'service', value: forService }),
        textarea({ name: 'endpoint' }, JSON.stringify(template, null, 2)),
        button('Save')
      )
    )
  );
} else if ('POST' === xdmp.getRequestMethod()) {
  const endpoint = JSON.parse(xdmp.getRequestField('endpoint')); //JSON.parse(xdmp.getRequestBody('text'));
  updateEndpoint(forService, endpoint);
  xdmp.redirectResponse(
    `dataServices.sjs?service=${forService}&endpoint=${endpoint.functionName}`
  );
}
