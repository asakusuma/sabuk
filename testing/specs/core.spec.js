/**
 * @venus-include ../../source/lib/bluebird.js
 * @venus-include ../../build/sabuk-global.js
 */

Sabuk.setLibrary(Promise, 'bluebird');

describe('Sabuk Core', function() {
  describe('defer()', function() {
    it('should return a deferred with fulfill method', function(done) {
      var d = Sabuk.defer();
      var name = 'Benjamin';
      d.promise.then(function(value) {
        expect(value).to.be(name);
        done();
      });
      d.fulfill(name);
    });

    it('should return a deferred with resolve method as an alias of fulfill', function(done) {
      var d = Sabuk.defer();
      var name = 'Benjamin';
      d.promise.then(function(value) {
        expect(value).to.be(name);
        done();
      });
      d.resolve(name);
    });

    it('should return a deferred with reject method', function(done) {
      var d = Sabuk.defer();
      var name = 'Benjamin';
      d.promise.then(null, function(value) {
        expect(value).to.be(name);
        done();
      });
      d.reject(name);
    });

    it('should return a deferred with fail method as alias of reject', function(done) {
      var d = Sabuk.defer();
      var name = 'Benjamin';
      d.promise.then(null, function(value) {
        expect(value).to.be(name);
        done();
      });
      d.fail(name);
    });
  });
});