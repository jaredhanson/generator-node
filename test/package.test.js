/* global describe, it */

var generator = require('../app');


describe('node:app', function() {
  
  it('should export constructor', function() {
    expect(generator).to.be.a('function');
  });
  
});
