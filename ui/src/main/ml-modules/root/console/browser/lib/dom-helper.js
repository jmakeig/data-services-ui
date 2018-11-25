/**
 * Whether something is iterable, not including `string` instances.
 *
 * @param {*} item
 * @param {boolean} [ignoreStrings = true]
 * @return {boolean}
 */
function isIterable(item, ignoreStrings = true) {
  if (!exists(item)) return false;
  if ('function' === typeof item[Symbol.iterator]) {
    return 'string' !== typeof item || !ignoreStrings;
  }
  return false;
}
/**
 * Whether something is not `undefined` or `null`
 *
 * @param {*} item
 * @return {boolean}
 */
function exists(item) {
  return !('undefined' === typeof item || null === item);
}
/**
 * Whether something doesn’t exist or is *not* an empty `string`
 *
 * @param {*} item
 * @return {boolean}
 */
function isEmpty(item) {
  return !exists(item) || '' === item;
}
/**
 * Guarantees an interable, even if passed a non-iterable,
 * except for `undefined` and `null`, which are returned as-is.
 *
 * @param {*} oneOrMany
 * @return {Iterable|Array|null|undefined}
 */
function toIterable(oneOrMany) {
  if (!exists(oneOrMany)) return oneOrMany;
  if (isIterable(oneOrMany)) return oneOrMany;
  return [oneOrMany];
}

/**
 * Creates a `Node` instance.
 *
 * @param {Node|string|null|undefined} name
 * @return {Node}
 */
function createElement(name) {
  if (name instanceof Node) return name;
  if (isEmpty(name)) return document.createDocumentFragment();
  return document.createElement(String(name));
}

/**
 *
 * @param {Iterable|Node|string|Object} param
 * @param {Node} el
 * @return {Node}
 */
function applyToElement(param, el) {
  if (isIterable(param)) {
    for (const item of param) {
      applyToElement(item, el);
    }
    return el;
  }

  if (param instanceof Node) {
    el.appendChild(param);
    return el;
  }

  switch (typeof param) {
    case 'string':
    case 'number':
    case 'boolean':
      el.appendChild(document.createTextNode(String(param)));
      return el;
    case 'object':
      if (null === param) {
        el.appendChild(document.createTextNode(String(param)));
        return el;
      }
  }

  if (exists(param) && 'object' === typeof param) {
    for (const p of [
      ...Object.getOwnPropertyNames(param),
      ...Object.getOwnPropertySymbols(param)
    ]) {
      switch (p) {
        case 'style':
        case 'dataset':
          for (let item in param[p]) {
            if (exists(item)) el[p][item] = param[p][item];
          }
          break;
        case 'class':
        case 'className':
        case 'classList':
          for (const cls of toIterable(param[p])) {
            if (exists(cls)) el.classList.add(cls);
          }
          break;
        case 'for':
        case 'htmlFor':
          el.htmlFor = param[p];
          break;
        default:
          el[p] = param[p];
      }
    }
  }
  return el;
}

/**
 *
 * @param {string|Node|undefined|null} name
 * @param {Iterable} rest
 * @return {Node}
 */
function element(name, ...rest) {
  const el = createElement(name);
  for (const param of rest) {
    applyToElement(param, el);
  }
  return el;
}

const toFragment = (...rest) => element(null, ...rest);
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
