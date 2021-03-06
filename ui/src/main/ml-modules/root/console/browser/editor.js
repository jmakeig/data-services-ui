function copy(obj, ...others) {
  if (Array.isArray(obj)) {
    return [...obj, ...others];
  }
  return Object.assign({}, obj, ...others);
}

const CHANGE_ENDPOINT_MODULE = 'CHANGE_ENDPOINT_MODULE';
const SAVE_ENDPOINT_INTENT = 'SAVE_ENDPOINT_INTENT';
const ADD_ENDPOINT_PARAM = 'ADD_ENDPOINT_PARAM';
const UPDATE_ENDPOINT_PARAM = 'UPDATE_ENDPOINT_PARAM';
const DELETE_ENDPOINT_PARAM = 'DELETE_ENDPOINT_PARAM';

/*
const model = {
  service: 'helloWorld',
  endpoint: 'whatsUp',
  services: [
    {
      helloWorld: {
        service: {
          endpointDirectory: '/helloWorld/',
          $javaClass: 'com.acme.HelloWorld'
        },
        apis: [
          {
            // desc
            functionName: 'whatsUp',
            params: [
              // name, desc, datatype, nullable, and multiple
              { name: 'greeting', datatype: 'string' },
              { name: 'frequency', datatype: 'unsignedLong' }
            ],
            // desc, datatype, nullable, and multiple
            return: { datatype: 'string' },
            module: '\'use strict\'';
          }
        ]
      }
    }
  ]
};
*/

function reducer(prev, action) {
  function changeEndpointModule({ module }) {
    const newModel = copy(prev);
    newModel.services = copy(newModel.services);
    newModel.services[prev.service] = copy(newModel.services[prev.service]);
    newModel.services[prev.service].apis = newModel.services[
      prev.service
    ].apis.map(api => {
      if (prev.endpoint === api.functionName) {
        return copy(api, { module });
      } else {
        return api;
      }
    });
    return newModel;
  }

  function addEndpointParam(service, endpoint) {
    const newModel = copy(prev);
    newModel.services = copy(newModel.services);
    newModel.services[service] = copy(newModel.services[service]);
    newModel.services[service].apis = newModel.services[service].apis.map(
      api => {
        if (endpoint === api.functionName) {
          const newAPI = copy(api);
          newAPI.params = copy(newAPI.params, { name: null, datatype: null });
          return newAPI;
        } else {
          return api;
        }
      }
    );
    return newModel;
  }

  function updateEndpointParam({ index, name, datatype }) {
    console.log(name);
    const newModel = copy(prev);
    newModel.services = copy(newModel.services);
    newModel.services[prev.service] = copy(newModel.services[prev.service]);
    newModel.services[prev.service].apis = newModel.services[
      prev.service
    ].apis.map(api => {
      if (prev.endpoint === api.functionName) {
        const newAPI = copy(api);
        newAPI.params = copy(newAPI.params);
        newAPI.params[index] = copy(newAPI.params[index], { name, datatype });
        return newAPI;
      } else {
        return api;
      }
    });
    return newModel;
  }

  switch (action.type) {
    case CHANGE_ENDPOINT_MODULE:
      return changeEndpointModule(action.data);
    case ADD_ENDPOINT_PARAM:
      return addEndpointParam(prev.service, prev.endpoint);
    case UPDATE_ENDPOINT_PARAM:
      return updateEndpointParam(action.data);
    default:
      return prev;
  }
}

const logger = store => next => action => {
  console.log('Dispatching', action);
  let result = next(action);
  console.log('Next', store.getState());
  return result;
};

const store = Redux.createStore(
  reducer,
  initialModel,
  Redux.applyMiddleware(logger)
);

// HACK: Blur and focus events need to happen in separate event loops
// store.subscribe(() => () => {
//   console.log('About to render');
//   setTimeout(render, 0);
// });
store.subscribe(render);

/**
 * Given the state, get the current endpoint
 *
 * @param {Object} state
 * @return {Object} The endpoint
 * @throws {ReferenceError} If the service or endpoint don’t exist
 */
function selectCurrentEndpoint(state) {
  const { service, endpoint } = state;
  const s = state.services[service];
  if (s) {
    const e = s.apis.find(api => endpoint === api.functionName);
    if (e) return e;
  }
  throw new ReferenceError(`${service}, ${endpoint} does not exist`);
}

function wireModuleEditor() {
  const editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
    mode: 'javascript',
    lineNumbers: true,
    tabSize: 2,
    inputStyle: 'contenteditable'
  });

  editor.on('blur', (instance, event) => {
    // console.log('blur', editor.getValue());
    store.dispatch({
      type: CHANGE_ENDPOINT_MODULE,
      data: {
        module: editor.getValue()
      }
    });
  });
}

/**
 *
 * @param {Object} params Dictionary of keys and values.
 *                        Array values result in multiple entries.
 */
function queryString(params) {
  const qs = new URLSearchParams();
  function append(k, v) {
    qs.append(k, v);
  }
  for (let p in params) {
    if (Array.isArray(params[p])) {
      for (const item of params[p]) {
        append(p, item);
      }
    } else {
      append(p, params[p]);
    }
  }
  return qs.toString();
}

/**
 *
 *
 * @param {String} module
 * @param {String} service
 * @param {String} endpoint
 * @param {String} [tpye = 'sjs']
 * @return {Promise}
 */
function saveEndpoint(endpoint, forService) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      './saveEndpoint.sjs?' +
        queryString({ service: forService, endpoint: endpoint.functionName })
    );
    xhr.onload = function() {
      if (this.status < 300) {
        // resolve(JSON.parse(this.responseText));
        resolve(this.responseText);
      } else if (this.status >= 300) {
        const error = new Error(this.responseText);
        error.httpStatus = this.statusText;
        error.httpCode = this.status;
        reject(error);
      }
    };
    xhr.ontimeout = xhr.onabort = xhr.onerror = function(evt) {
      reject(new Error('Network Error'));
    };
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(endpoint));
  });
}

document.addEventListener('click', evt => {
  if (evt.target.matches('button.param-remove')) {
    //
  } else if (evt.target.matches('button.param-add')) {
    store.dispatch({ type: ADD_ENDPOINT_PARAM });
  } else if (evt.target.matches('button.param-save')) {
    const index = evt.target.dataset.index;
    const name = document.querySelector(
      `input.param-name[data-index="${index}"]`
    ).value;
    const sel = document.querySelector(
      `select.param-datatype[data-index="${index}"]`
    );
    const datatype = sel.options[sel.selectedIndex].text;
    store.dispatch({
      type: UPDATE_ENDPOINT_PARAM,
      data: { index, name, datatype }
    });
  } else if (evt.target.matches('#Run')) {
    const model = store.getState();
    saveEndpoint(selectCurrentEndpoint(model), model.service)
      .then(response => console.info(response))
      .catch(err => console.error(err));
  }
});

function render(element = `#${store.getState().endpoint}`) {
  console.time('render');
  {
    replaceChildren(
      document.querySelector(element),
      Endpoint(
        selectCurrentEndpoint(store.getState()),
        store.getState().service,
        true
      )
    );
    wireModuleEditor();
  }
  console.timeEnd('render');
}

wireModuleEditor();
