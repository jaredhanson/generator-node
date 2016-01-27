/* global describe, it */

var pkg = require('..');
var expect = require('chai').expect;


describe('foo', function() {
  
  it('should export hello world', function() {
    expect(pkg.hello).to.equal('world');
  });
  
});
