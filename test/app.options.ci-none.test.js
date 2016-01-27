/* global describe, it */

var generator = require('../app');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');
var fs = require('fs');


describe('node:app', function() {
  
  describe('with --ci=none option', function () {
    before(function(done) {
      helpers.run(path.join(__dirname, '../app'))
        .withOptions({
          ci: 'none'
        })
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
        'LICENSE',
        'Makefile',
        'README.md',
        'package.json',
        'lib/index.js',
        'test/package.test.js'
      ];

      assert.file(expected);
    });
    
    it('does not create CI files', function () {
      var expected = [
        '.travis.yml',
      ];

      assert.noFile(expected);
    });
  });
  
});
