xdmp.setResponseOutputMethod('html');
xdmp.setResponseContentType('text/html');
xdmp.setResponseEncoding('UTF-8');

// const { div } = require('./dom-helper.sjs');

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

function getServices() {
  function match(pattern) {
    return Array.from(cts.uriMatch(pattern), uri => uri.valueOf());
  }

  return match('*/service.json').reduce((services, service) => {
    const path = service.slice(0, service.length - 12);
    const apis = match(`${path}*.api`).map(uri =>
      Object.assign(cts.doc(uri).toObject(), {
        module: cts.doc(uri.replace(/\.api$/, '.sjs')).toObject()
      })
    );
    services[path.slice(1, path.length - 1)] = {
      service: cts.doc(service).toObject(),
      apis: [...apis]
    };
    return services;
  }, {});
}

const services = getServices();

`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Data Services</title>
    <link rel="stylesheet" type="text/css" href="endpoint.css" />
    <!-- <script type="application/javascript" src=""></script> -->
  </head>
  <body>
    <header><button>+ New Endpoint</button></header>
    ${Object.keys(services)
      .map(
        service =>
          `
    <section class="service" id="${service}">
      <h2 class="service-name">${service}</h2>
      <header><button>+ New Function</button></header>
      ${services[service].apis
        .map(
          api =>
            `
      <section class="endpoint" id="${service}-${api.functionName}">
        <h3 class="endpoint-name">${api.functionName}</h3>
        <fieldset class="params">
          <legend>Params</legend>
          <ol class="params-list" start="0">
            ${api.params
              .map(
                param => `
            <li class="control input">
              <label for="${service}-${api.functionName}-${param.name}">${
                  param.name
                }</label>
              <input
                type="text"
                name="${api.functionName}"
                id="${service}-${api.functionName}-${param.name}"
                style="width: 20em;"
              />
              <span class="param-type">${param.datatype}</span>
            </li>
          `
            )
            .join('')
          }
          </ol>
        </fieldset>
        <fieldset class="implementation">
          <legend>Code</legend>
          <div class="control">
            <textarea
              class="module javascript"
              name="${service}-${api.functionName}-module"
              spellcheck="false"
            >${api.module}</textarea>
          </div>
          <div class="control">
              <button name="${service}-${api.functionName}-run">Run</button>
          </div>
        </fieldset>
        <fieldset class="output">
          <legend>Output</legend>
          <div>asdf</div>
        </fieldset>
      </section>
      `
        )
        .join('')}
    </section>
    `
      )
      .join('')}
  </body>
</html>
`;
