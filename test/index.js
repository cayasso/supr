var supr = require('../');

describe('supr', function () {
  
  it('should call parent', function () {

    // Base class
    function Base() {};
    Base.prototype.super = supr;
    Base.prototype.say = function(msg) {
      return 'base:' + msg;
    };

    // Sub class
    function Sub() { Base.call(this); };
    Sub.prototype.__proto__ = Base.prototype;
    Sub.prototype.say = function(str) {
      return this.super('sub:' + str);
    };

    // Sub sub class
    function SubSub() { Sub.call(this); };
    SubSub.prototype.__proto__ = Sub.prototype;
    SubSub.prototype.say = function(str) {
      return this.super('subsub:' + str);
    };

    // Instance
    var subSub = new SubSub;
    subSub.say('instance').should.be.eql('base:sub:subsub:instance');
  });

});