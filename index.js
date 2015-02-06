var QuoteScanner = require('quote-scanner');

function strip(code, keepLine) {
  // Remove html comment
  code = strip.html(code, keepLine);

  // Remove css comment
  code = code.replace(
    /<style([^>]*)>([\s\S]+?)<\/style>/g,
    function(match, $1, $2) {
      return '<style'+ $1 +'>' + strip.css($2, keepLine) + '</style>';
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

      return '<script' + $1 + '>' + strip.js($2, keepLine) + '</script>';
    }
  );

  return code;
}

function blockReplace(comemnt, keepLine) {
  if (keepLine) {
    return comemnt.replace(/[^\r\n]/g, '');
  } else {
    return '';
  }
}

/**
 * @description
 * Strip js comments.
 */
// var str = '// not a comment';
// var str = '/* not a comment */';
// var reg = /dasda\/* */;
strip.js = function(code, keepLine) {
  var qs = new QuoteScanner(code);

  // Remove block comment
  code = code.replace(/(^|[^\\])\/\*[\s\S]*?\*\//g, function(match, $1, offset) {
    if (qs.isIn(offset + $1.length)) {
      return match;
    } else {
      return $1 + blockReplace(match.slice($1.length), keepLine);
    }
  });

  qs = new QuoteScanner(code);

  // Remove line comment
  code = code.replace(/(^|[^\\])\/\/.*([\r\n])/g, function(match, $1, $2, offset) {
    if (qs.isIn(offset + $1.length)) {
      return match;
    } else {
      return $1 + $2;
    }
  });

  return code;
};

/**
 * @description
 * Strip html comments.
 */
strip.html = function(code, keepLine) {
  return code.replace(/<!--[\s\S]*?-->/g, function(match) {
    return blockReplace(match, keepLine);
  });
};

/**
 * @description
 * Strip css comments.
 */
strip.css = function(code, keepLine) {
  var qs = new QuoteScanner(code);

  return code.replace(/\/\*[\s\S]*?\*\//g, function(match, offset) {
    if (qs.isIn(offset)) {
      return match;
    } else {
      return blockReplace(match, keepLine);
    }
  });
};

module.exports = strip;