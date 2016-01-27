/* global describe, it */

var generator = require('../app');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');
var fs = require('fs');


describe('node:app', function() {
  
  describe('defaults', function () {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withPrompts({
          name: 'foo'
        })
        .on('ready', function(generator) {
        })
        .on('end', function() {
          console.log(process.cwd());
          done();
        });
    });
    
    it('creates files', function () {
      var expected = [
        '.gitignore',
        '.jshintrc',
        '.npmignore',
        '.travis.yml',
        'LICENSE',
        'Makefile',
        'README.md',
        'package.json',
        'lib/index.js',
        'test/package.test.js'
      ];

      assert.file(expected);
    });
    
    it('creates test/package.test.js for use with mocha and chai', function() {
      var actual = fs.readFileSync('test/package.test.js', 'utf8');
      var expected = fs.readFileSync(path.join(__dirname, './fixtures/test/mocha-chai/package.test.out.js'), 'utf8');
      assert.textEqual(actual, expected);
    });
  });
  
});
