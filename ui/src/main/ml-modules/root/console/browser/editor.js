function copy(obj, ...others) {
  return Object.assign({}, obj, ...others);
}

function reducer(prev, action) {
  console.log(action.type, action.data);
  switch (action.type) {
    case 'CHANGE_ENDPOINT_MODULE':
      const { service, endpoint, module } = action.data;
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
    default:
      return prev;
  }
}
const store = Redux.createStore(reducer, initialModel);
store.subscribe(() => console.info(store.getState()));

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
      type: 'CHANGE_ENDPOINT_MODULE',
      data: {
        service: state.service,
        endpoint: state.endpoint,
        module: editor.getValue()
      }
    });

    // FIXME: This needs to be in a thunk
    save(editor.getValue(), state.service, state.endpoint)
      .then(response => console.info(response))
      .catch(err => console.error(err));
  })
);

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
