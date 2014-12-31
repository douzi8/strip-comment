var assert = require('assert');
var fs = require('fs');
var path = require('path');
var strip = require('../index');

function getPath(filepath) {
  return path.join(__dirname, filepath);
}

function writeFileSync(filepath, data) {
  fs.writeFileSync(getPath(filepath), data, { encoding: 'utf8'});
}

describe('Remove comments', function() {
  var html = fs.readFileSync(getPath('demo/index.html'), { encoding: 'utf8' });
  var js = fs.readFileSync(getPath('demo/index.js'), {  encoding: 'utf8' });

  it('Strip html', function() {
    var ret = strip(html);

    writeFileSync('demo/index.dest.html', ret);
  });

  it('Strip js', function() {
    var ret = strip.js(js);

    writeFileSync('demo/index.dest.js', ret);
    writeFileSync('demo/index.dest.line.js', strip.js(js, true));
  });
});