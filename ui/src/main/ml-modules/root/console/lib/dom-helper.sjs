'use strict';

function exists(item) {
  return !('undefined' === typeof item || null === item);
}
function isEmpty(item) {
  return !exists(item) || '' === item;
}
function notEmpty(item) {
  return !isEmpty(item);
}

function element(name, ...properties) {
  let attributes = {};
  let children = [];

  function serializeAttributes(attr) {
    function serialize(key) {
      switch (key) {
        case 'class':
        case 'className':
          return `class="${
            Array.isArray(attr[key])
              ? attr[key].filter(notEmpty).join(' ')
              : attr[key]
          }"`;
        //case 'dataset':
        //  Object.keys(attr[key]).map
        default:
          return `${key}="${attr[key]}"`;
      }
    }

    return Object.keys(attr)
      .map(serialize)
      .join(' ');
  }
  if (0 === properties.length) return `<${name}/>`;
  for (const prop of properties) {
    switch (typeof prop) {
      case 'string':
      case 'boolean':
      case 'number':
        children.push(
          String(prop)
          //.replace(/</g, '&lt;')
          //.replace('/&/g', '&amp;')
        );
        break;
      case 'object':
        if (null !== prop) attributes = Object.assign(attributes, prop);
        break;
      case 'function':
        children.push(prop());
        break;
    }
  }

  return (
    `<${name} ` +
    `${serializeAttributes(attributes)}>` +
    `${children.join('')}` +
    `</${name}>`
  );
}
exports.html = (...p) => {
  xdmp.setResponseOutputMethod('html');
  xdmp.setResponseContentType('text/html');
  xdmp.setResponseEncoding('UTF-8');
  return `<!DOCTYPE html>
  ${element('html', ...p)}`;
};
exports.head = (...p) => element('head', ...p);
exports.title = (...p) => element('title', ...p);
exports.body = (...p) => element('body', ...p);
exports.section = (...p) => element('section', ...p);
exports.header = (...p) => element('header', ...p);
exports.nav = (...p) => element('nav', ...p);
exports.footer = (...p) => element('footer', ...p);
exports.div = (...p) => element('div', ...p);
exports.p = (...p) => element('p', ...p);
exports.h1 = (...p) => element('h1', ...p);
exports.h2 = (...p) => element('h2', ...p);
exports.h3 = (...p) => element('h3', ...p);
exports.h4 = (...p) => element('h4', ...p);
exports.h5 = (...p) => element('h5', ...p);
exports.h6 = (...p) => element('h6', ...p);

exports.ul = (...p) => element('ul', ...p);
exports.ol = (...p) => element('ol', ...p);
exports.li = (...p) => element('li', ...p);
exports.dl = (...p) => element('dl', ...p);
exports.dt = (...p) => element('dt', ...p);
exports.dd = (...p) => element('dd', ...p);

exports.table = (...p) => element('table', ...p);
exports.thead = (...p) => element('thead', ...p);
exports.tfoot = (...p) => element('tfoot', ...p);
exports.tbody = (...p) => element('tbody', ...p);
exports.tr = (...p) => element('tr', ...p);
exports.th = (...p) => element('th', ...p);
exports.td = (...p) => element('td', ...p);

exports.span = (...p) => element('span', ...p);
exports.a = (...p) => element('a', ...p);
exports.em = (...p) => element('em', ...p);
exports.strong = (...p) => element('strong', ...p);
exports.mark = (...p) => element('mark', ...p);

exports.form = (...p) => element('form', ...p);
exports.fieldset = (...p) => element('fieldset', ...p);
exports.legend = (...p) => element('legend', ...p);
exports.label = (...p) => element('label', ...p);
exports.input = (...p) => element('input', { type: 'text' }, ...p);
exports.button = (...p) => element('button', ...p);
exports.text = (...p) => element('input', { type: 'text' }, ...p);
exports.number = (...p) => element('input', { type: 'number' }, ...p);
exports.textarea = (...p) => element('textarea', ...p);
exports.checkbox = (...p) => element('input', { type: 'checkbox' }, ...p);
exports.radio = (...p) => element('input', { type: 'radio' }, ...p);
exports.select = (...p) => element('select', ...p);
exports.option = (...p) => element('option', ...p);
exports.file = (...p) => element('input', { type: 'file' }, ...p);

exports.br = (...p) => element('br', ...p);
exports.hr = (...p) => element('hr', ...p);
