/* global describe, it */

var generator = require('../app');
var helpers = require('yeoman-test');
var assert = require('yeoman-assert');
var path = require('path');


describe('node:app', function() {
  
  describe('defaults', function () {
    before(function(done) {
      helpers.run(path.join( __dirname, '../app'))
        .withPrompts({ coffee: false }) // Mock the prompt answers
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
        'package.json'
      ];

      assert.file(expected);
    });

    it('generate a router.js file', function () {
      // assert the file exist
      // assert the file uses AMD definition
    });

    it('generate a view file');
    it('generate a base controller');
  });
  
});
