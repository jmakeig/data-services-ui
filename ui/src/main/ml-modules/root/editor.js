const editor = CodeMirror.fromTextArea(document.querySelector('textarea'), {
  mode: 'javascript',
  lineNumbers: true,
  tabSize: 2,
  inputStyle: 'contenteditable'
});
editor.on('change', change => console.log(editor.getValue()));
