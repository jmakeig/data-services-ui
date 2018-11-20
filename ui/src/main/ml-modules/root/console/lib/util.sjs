/**
 * Return a function proxy to invoke a function in another context.
 * The proxy can be called just like the original function, with the
 * same arguments and return types. Example uses: to run the input
 * as another user, against another database, or in a separate
 * transaction.
 *
 * @param {Function} fct     The function to invoke
 * @param {Object} [options] The `xdmp.eval` options.
 *                           Use `options.user` as a shortcut to
 *                           specify a user name (versus an ID).
 *                           `options.database` can take a `string`
 *                           or a `number`.
 * @param {Object} [thisArg] The `this` context when calling `fct`
 * @return {Function}        A function that accepts the same arguments as
 *                           the originally input function.
 */
function applyAs(fct, options, thisArg) {
  return module.amp(function _wrappedApplyAs() {
    // Curry the function to include the params by closure.
    // xdmp.invokeFunction requires that invoked functions have
    // an arity of zero.
    const f = () => {
      // Nested Sequences are flattened. Thus if `fct` returns a Seqence
      // there’s no way to differentiate it from the Sequence that
      // `xdmp.invokeFunction` (or `xdmp.eval` or `xdmp.invoke` or `xdmp.spawn`)
      // return. However, by wrapping the returned Sequence in something else—
      // an array here—we can “pop” the stack to get the acutual return value.
      return [fct.apply(thisArg, arguments)];
    };

    options = options || {};
    // Allow passing in database name, rather than id
    if ('string' === typeof options.database) {
      options.database = xdmp.database(options.database);
    }
    // Allow passing in user name, rather than id
    if (options.user) {
      options.userId = xdmp.user(options.user);
      delete options.user;
    }
    // Allow the functions themselves to declare their transaction mode
    if (fct.transactionMode && !options.transactionMode) {
      options.transactionMode = fct.transactionMode;
    }

    return fn.head(xdmp.invokeFunction(f, options)).pop();
    //return xdmp.invokeFunction(f, options).toArray().pop().pop(); // <https://bugtrack.marklogic.com/bug/38646>
  });
}

exports.applyAs = applyAs;
