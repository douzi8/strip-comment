var assert = require('assert');
var fs = require('fs');
var path = require('path');
var strip = require('../index');

function getPath(filepath) {
  return path.join(__dirname, filepath);
}


describe('Remove comments', function() {
  var html = fs.readFileSync(getPath('demo/index.html'), { encoding: 'utf8' });
  var js = fs.readFileSync(getPath('demo/index.js'), {  encoding: 'utf8' });

  it('Strip html', function() {
    var ret = strip(html);

    console.log(ret);
  });

  it('Strip js', function() {
    var ret = strip.js(js);

    console.log(ret);
  });
});