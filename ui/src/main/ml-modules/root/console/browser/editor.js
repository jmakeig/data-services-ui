function copy(obj, ...others) {
  if (Array.isArray(obj)) {
    return [...obj, ...others];
  }
  return Object.assign({}, obj, ...others);
}

const CHANGE_ENDPOINT_MODULE = 'CHANGE_ENDPOINT_MODULE';
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
            functionName: 'whatsUp',
            params: [
              { name: 'greeting', datatype: 'string' },
              { name: 'frequency', datatype: 'unsignedLong' }
            ],
            return: { datatype: 'string' },
            module: '\'use static\'';
          }
        ]
      }
    }
  ]
};
*/

function reducer(prev, action) {
  // console.log(action.type, action.data);
  function changeEndpointModule({ service, endpoint, module }) {
    const newModel = copy(prev);
    newModel.services = copy(newModel.services);
    newModel.services[service] = copy(newModel.services[service]);
    newModel.services[service].apis = newModel.services[service].apis.map(
      api => {
        if (endpoint === api.functionName) {
          return copy(api, { module });
        } else {
          return api;
        }
      }
    );
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
          newAPI.params = copy(newAPI.params, [{ name: null, datatype: null }]);
          return newAPI;
        } else {
          return api;
        }
      }
    );
    return newModel;
  }

  switch (action.type) {
    case CHANGE_ENDPOINT_MODULE: {
      return changeEndpointModule(action.data);
    }
    case ADD_ENDPOINT_PARAM:
      return addEndpointParam(prev.service, prev.endpoint);
      return prev;
    default:
      return prev;
  }
}
const store = Redux.createStore(reducer, initialModel);
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

  editor.on(
    'change',
    debounce(change => {
      const state = store.getState();
      // console.log(editor.getValue());
      store.dispatch({
        type: CHANGE_ENDPOINT_MODULE,
        data: {
          service: state.service,
          endpoint: state.endpoint,
          module: editor.getValue()
        }
      });

      // FIXME: This needs to be in a thunk
      save(
        selectCurrentEndpoint(store.getState()).module,
        state.service,
        state.endpoint
      )
        .then(response => console.info(response))
        .catch(err => console.error(err));
    })
  );
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
function save(module, service, endpoint, type = 'sjs') {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open(
      'POST',
      './saveEndpoint.sjs?' + queryString({ service, endpoint, type })
    );
    xhr.onload = function() {
      if (this.status < 300) {
        // resolve(JSON.parse(this.responseText));
        resolve(this.responseText);
      } else if (this.status >= 300) {
        let error = new Error(this.responseText);
        error.httpStatus = this.statusText;
        error.httpCode = this.status;
        reject(error);
      }
    };
    xhr.ontimeout = xhr.onabort = xhr.onerror = function(evt) {
      reject(new Error('Network Error'));
    };
    xhr.send(module);
  });
}

/** @see https://davidwalsh.name/javascript-debounce-function */
function debounce(func, wait = 250, immediate = false) {
  let timeout;
  return function _debounceInner() {
    const context = this,
      args = arguments;
    function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

document.addEventListener('click', evt => {
  if (evt.target.matches('button.param-remove')) {
    //
  } else if (evt.target.matches('button.param-add')) {
    store.dispatch({ type: ADD_ENDPOINT_PARAM });
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
