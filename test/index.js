var supr = require('../');
var util = require("util");;

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

    util.inherits(Sub, Base);

    Sub.prototype.say = function(str) {
      return this.super('sub:' + str);
    };

    // Sub sub class
    function SubSub() { Sub.call(this); };
    util.inherits(SubSub, Sub);
    SubSub.prototype.say = function(str) {
      return this.super('subsub:' + str);
    };

    // Instance
    var subSub = new SubSub;
    subSub.say('instance')
    .should.be.eql('base:sub:subsub:instance');
  });

});