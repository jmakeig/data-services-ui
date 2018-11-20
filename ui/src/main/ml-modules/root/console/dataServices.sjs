xdmp.securityAssert('http://marklogic.com/data-services-console', 'execute');

const { getServices } = require('./lib/modules-db.sjs');

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

const services = getServices();

`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Data Services</title>
    <link rel="stylesheet" type="text/css" href="./browser/endpoint.css" />
    <link rel="stylesheet" type="text/css" href="./browser/lib/codemirror.css" />
    <link rel="stylesheet" type="text/css" href="./browser/editor.css" />
    <script type="application/javascript" src="./browser/lib/codemirror.js"></script>
    <script type="application/javascript" src="./browser/lib/javascript.js"></script>
  </head>
  <body>
    <header><button>+ New Service</button></header>
    ${Object.keys(services)
      .map(
        service =>
          `
    <section class="service" id="${service}">
      <h2 class="service-name">${service}</h2>
      <header><button>+ New Endpoint</button></header>
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
              .join('')}
          </ol>
        </fieldset>
        <fieldset class="implementation">
          <legend>Endpoint Implementation</legend>
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
    <script type="application/javascript" src="./browser/editor.js"></script>
  </body>
</html>
`;
