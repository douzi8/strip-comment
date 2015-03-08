var util = require('util');
var Scanner = require('./scanner');

function JsScanner(str) {
  Scanner.call(this, str);
  this._prev = '';
}

util.inherits(JsScanner, Scanner);

JsScanner.prototype.scanner = function() {
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

    if (this._lineComment()) {
      continue;
    }

    if (this._regexp()) {
      continue;
    }

    if (item !== ' ') {
      this._prev = item;
    }

    this._updatePos(item);
  }
}

JsScanner.prototype._lineComment = function() {
  if (this._str[0] + this._str[1] !== '//') return false;
  var start = this._index;
  var match = this._match(/\/\/.*/);

  this.emit('comment', match[0], start);
  return true;
}

JsScanner.prototype._regexp = function() {
  if (this._str[0] !== '/') return false;
  // Filter division method
  if (/[\d\)\w\$]/.test(this._prev)) return false;

  return this._match(/\/(?:\\\/|[^\r\n])*\//);
}

module.exports = JsScanner;