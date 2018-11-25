/**
 *
 * @param {String|null|Node} name
 * @param  {...Node|Object|String} children
 * @return {Node}
 */
function element(name, ...children) {
  if (null === name) return document.createDocumentFragment();
  if (name instanceof Node) return name;
  const el = document.createElement(String(name));
  for (const child of children) {
    switch (typeof child) {
      case 'string':
      case 'number':
      case 'boolean':
        el.appendChild(document.createTextNode(child));
        break;
      case 'object':
        if (null === child) break;
        else if (child instanceof Node) {
          el.appendChild(child);
        } else {
          for (let p in child) {
            switch (p) {
              case 'style':
              case 'dataSet':
                const set = child[p];
                for (let item in set) {
                  el[p][item] = set[item];
                }
                break;
              case 'classList':
                el.classList.add(...child[p]);
                break;
              case 'for':
                el.htmlFor = child[p];
                break;
              default:
                el[p] = child[p];
            }
          }
        }
    }
  }
  return el;
}

const toFragment = (...p) => element(null, ...p);
const empty = () => toFragment();

const head = (...p) => element('head', ...p);
const title = (...p) => element('title', ...p);
const body = (...p) => element('body', ...p);
const section = (...p) => element('section', ...p);
const header = (...p) => element('header', ...p);
const nav = (...p) => element('nav', ...p);
const footer = (...p) => element('footer', ...p);
const div = (...p) => element('div', ...p);
const p = (...p) => element('p', ...p);
const h1 = (...p) => element('h1', ...p);
const h2 = (...p) => element('h2', ...p);
const h3 = (...p) => element('h3', ...p);
const h4 = (...p) => element('h4', ...p);
const h5 = (...p) => element('h5', ...p);
const h6 = (...p) => element('h6', ...p);

const ul = (...p) => element('ul', ...p);
const ol = (...p) => element('ol', ...p);
const li = (...p) => element('li', ...p);
const dl = (...p) => element('dl', ...p);
const dt = (...p) => element('dt', ...p);
const dd = (...p) => element('dd', ...p);

const table = (...p) => element('table', ...p);
const thead = (...p) => element('thead', ...p);
const tfoot = (...p) => element('tfoot', ...p);
const tbody = (...p) => element('tbody', ...p);
const tr = (...p) => element('tr', ...p);
const th = (...p) => element('th', ...p);
const td = (...p) => element('td', ...p);

const span = (...p) => element('span', ...p);
const a = (...p) => element('a', ...p);
const em = (...p) => element('em', ...p);
const strong = (...p) => element('strong', ...p);
const mark = (...p) => element('mark', ...p);

const form = (...p) => element('form', ...p);
const fieldset = (...p) => element('fieldset', ...p);
const legend = (...p) => element('legend', ...p);
const label = (...p) => element('label', ...p);
const input = (...p) => element('input', { type: 'text' }, ...p);
const button = (...p) => element('button', ...p);
const text = (...p) => element('input', { type: 'text' }, ...p);
const number = (...p) => element('input', { type: 'number' }, ...p);
const textarea = (...p) => element('textarea', ...p);
const checkbox = (...p) => element('input', { type: 'checkbox' }, ...p);
const radio = (...p) => element('input', { type: 'radio' }, ...p);
const select = (...p) => element('select', ...p);
const option = (...p) => element('option', ...p);
const optgroup = (...p) => element('optgroup', ...p);
const file = (...p) => element('input', { type: 'file' }, ...p);

const br = (...p) => element('br', ...p);
const hr = (...p) => element('hr', ...p);

/**
 * Replaces the entire contents of `oldNode` with `newChild`.
 * It’s generally advisable to use a `DocumentFragment` for the
 * the replacement.
 *
 * @param {Node} oldNode
 * @param {Node|DocumentFragment|NodeList|Array<Node>} newChild
 * @returns {Node}  - The new parent wrapper
 */
function replaceChildren(oldNode, newChild) {
  if (!oldNode) return;
  const tmpParent = oldNode.cloneNode();
  if (newChild) {
    if (newChild instanceof Node) {
      tmpParent.appendChild(newChild);
    } else {
      Array.prototype.forEach.call(newChild, child =>
        tmpParent.appendChild(child)
      );
    }
  }
  oldNode.parentNode.replaceChild(tmpParent, oldNode);
  return tmpParent;
}
