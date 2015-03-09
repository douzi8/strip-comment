var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Scanner(str) {
  this._str = str;
  this._line = 1;
  this._column = 1;
  this._index = 0;
}

util.inherits(Scanner, EventEmitter);

// abstract method.  to be overridden in specific implementation classes.
Scanner.prototype.scanner = function() {
  throw new Error('not implemented');
};

// match and update position
Scanner.prototype._match = function(reg) {
  var match = this._str.match(reg);

  if (!match) {
    return false;
  }

  this._updatePos(match[0]);
  return match;
};

// Update search position and save line, column
Scanner.prototype._updatePos = function(str) {
  var lines = str.match(/\n/g);
  var l = str.length;
  if (lines) this._line += lines.length;
  var i = str.lastIndexOf('\n');

  this._column = ~i ? l - i : this._column + l;
  this._str = this._str.slice(l);
  this._index += l;
};

// Exception handler
Scanner.prototype._error = function(msg) {
  msg = 'SyntaxError:' + msg + 
        ' at ' + this._line + ' line ' + 
        this._column + ' column';

  throw new Error(msg);
};

/**
 * @description
 * Match block comment
 */
Scanner.prototype._blockComment = function() {
  if (this._str[0] + this._str[1] !== '/*') return false;
  var start = this._index;
  var match = this._match(/\/\*[\s\S]*?\*\//);

  if (!match) return this._error('Unexpected block comment /*');

  this.emit('comment', match[0], start);
  return true;
};

/**
 * @description
 * Match single quote
 */
Scanner.prototype._singleQuote = function(single) {
  if (this._str[0] !== "'") return false;
  var start = this._index;
  var match = this._match(/'(?:[^'\\]|\\.)*'/);

  if (!match) return this._error("Unexpected signle quote");

  this.emit('quote', match[0], start);
  return true;
}

/**
 * @description
 * Match double quote
 */
Scanner.prototype._doubleQuote = function(single) {
  if (this._str[0] !== '"') return false;
  var start = this._index;
  var match = this._match(/"(?:[^"\\]|\\.)*"/);

  if (!match) return this._error("Unexpected double quote");

  this.emit('quote', match[0], start);
  return true;
}

module.exports = Scanner;