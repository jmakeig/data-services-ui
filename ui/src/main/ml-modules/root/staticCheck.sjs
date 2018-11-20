function staticCheck(code) {
  return xdmp.eval(code, { staticCheck: true });
}

exports.staticCheck = module.amp(staticCheck);
