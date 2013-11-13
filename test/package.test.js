/* global describe, it, expect */

var generator = require('..');

describe('generator-node', function() {
  
  it('should export constructor', function() {
    expect(generator).to.be.a('function');
  });
  
});
