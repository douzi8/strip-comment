function strip(code) {
  // Remove html comment
  code = strip.html(code);

  // Remove css comment
  code = code.replace(
    /<style([^>]*)>([\s\S]+?)<\/style>/g,
    function(match, $1, $2) {
      return '<style'+ $1 +'>' + strip.css($2) + '</style>';
    }
  );

  // Remove js code
  code = code.replace(
    /<script([^>]*)>([\s\S]+?)<\/script>/g,
    function(match, $1, $2) {
      var type = $1.match(/type=(?:"([^"]+)"|'([^']+)')/);

      if (type) {
        if (type[1] && type[1] !== 'text/javascript') return match;
        if (type[2] && type[2] !== 'text/javascript') return match;
      }

      return '<script' + $1 + '>' + strip.js($2) + '</script>';
    }
  );

  return code;
}

/**
 * @description
 * Strip js comments.
 */
// var str = '// not a comment';
// var str = '/* not a comment */';
// var reg = /dasda\/* */;
strip.js = function(code) {
  var isSingleQuote = false;
  var isDoubleQuote = false;
  var isReg = false;
  var isBlockComment = false;
  var isLineComment = false;
  var item;
 
  code = code.split('');

  for (var i = 0, l = code.length; i < l; i++) {
    item = code[i];
    if (!item) continue;
    
    if (isSingleQuote) {
      if (item === "'" && code[i - 1] !== '\\') {
        isSingleQuote = false;
      }
      continue;
    }

    if (isDoubleQuote) {
      if (item === '"' && code[i - 1] !== '\\') {
        isDoubleQuote = false;
      }
      continue;
    }

    if (isReg) {
      if (item === '/' && code[i - 1] != '\\') {
        isReg = false;
      }
      continue;
    }

    if (isLineComment) {
      // Cann't remove line, sometimes the new line is a statement
      if (item === '\n' || item === '\r') {
        isLineComment = false;
      } else {
        code[i] = '';
      }
      continue;
    }

    if (isBlockComment) {
      if (item === '*' && code[i + 1] === '/') {
        code[i + 1] = '';
        isBlockComment = false;
      }
      code[i] = '';
      continue;
    }

    isSingleQuote = code[i] === "'";
    isDoubleQuote = code[i] === '"';

    if (item == '/') {
      if (code[i + 1] === '/') {
        isLineComment = true;
        code[i] = '';
        continue;
      }

      if (code[i + 1] === '*') {
        isBlockComment = true;
        code[i] = '';
        continue;
      }

      isReg = true;
    }
  }

  return code.join('');
};

/**
 * @description
 * Strip html comments.
 */
strip.html = function(code) {
  return code.replace(/<!--[\s\S]*?-->/g, '');
};

/**
 * @description
 * Strip css comments.
 */
strip.css = function(code) {
  return code.replace(/\/\*[\s\S]*?\*\//g, '');
};

module.exports = strip;