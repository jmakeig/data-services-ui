const editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
  mode: 'javascript',
  lineNumbers: true,
  tabSize: 2,
  inputStyle: 'contenteditable'
});

editor.on('change', change => {
  console.log(editor.getValue());
  save(editor.getValue())
    .then(() => console.info('Y'))
    .catch(err => console.error(err));
});

function save(module) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', './saveEndpoint.sjs');
    xhr.onload = function() {
      if (this.status < 300) {
        // resolve(JSON.parse(this.responseText));
        resolve();
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
