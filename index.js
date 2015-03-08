var JsScanner = require('./lib/js-scanner');
var CssScaner = require('./lib/css-scanner');

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

function scanner(obj, code, keepLine) {
  var result = [];
  var index = 0;
  
  obj.on('comment', function(match, start) {
    var content = code.slice(index, start);

    if (keepLine) {
      content += match.replace(/[^\r\n]/g, ' ');
    }

    result.push(content);
    index = start + match.length;
  });

  obj.scanner();

  result.push(code.slice(index));

  return result.join('');
}

/**
 * @description
 * Strip js comments.
 */
// var str = '// not a comment';
// var str = '/* not a comment */';
// var reg = /dasda\/* */;
strip.js = function(code, keepLine) {
  var js = new JsScanner(code);
  
  return scanner(js, code, keepLine);
};

/**
 * @description
 * Strip html comments.
 */
strip.html = function(code, keepLine) {
  return code.replace(/<!--[\s\S]*?-->/g, function(match) {
    if (keepLine) {
      return match.replace(/[^\r\n]/g, ' ');
    } else {
      return '';
    }
  });
};

/**
 * @description
 * Strip css comments.
 */
strip.css = function(code, keepLine) {
  var css = new CssScaner(code);

  return scanner(css, code, keepLine);
};

module.exports = strip;