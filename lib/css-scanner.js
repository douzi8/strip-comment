var util = require('util');
var Scanner = require('./scanner');

function CssScanner(str) {
  Scanner.call(this, str);
}

util.inherits(CssScanner, Scanner);

CssScanner.prototype.scanner = function() {
  var item;
  while (this._str) {
    item = this._str[0];

    if (this._singleQuote()) {
      continue;
    }

    if (this._doubleQuote()) {
      continue;
    }

    if (this._blockComment()) {
      continue;
    }

    this._updatePos(item);
  }
}

module.exports = CssScanner;