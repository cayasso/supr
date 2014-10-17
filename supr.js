;(function() {

  var root = this;

  /**
   * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
   */

  function supr(a1, a2, a3, a4, a5, a6) {

    var args = arguments;
    var len = arguments.length;

    // since we are thunking a method call, performance is important here: 
    // memoize all lookups, once memoized the fast path calls no other 
    // functions
    //
    // find the caller (cannot be `strict` because of 'caller')
    var caller = supr.caller;
    // memoized 'name of method' 
    var nom = caller.nom;
    // memoized next implementation prototype
    var _super = caller._super;

    if (!_super) {
      if (!nom) {
        nom = caller.nom = nameInThis(this, caller);
      }
      if (!nom) {
        console.warn('called super() on a method not installed declaratively (has no .nom property)');
      }
      // super prototype is either cached or we have to find it
      // by searching __proto__ (at the 'top')
      // invariant: because we cache _super on fn below, we never reach 
      // here from inside a series of calls to super(), so it's ok to 
      // start searching from the prototype of 'this' (at the 'top')
      // we must never memoize a null super for this reason
      _super = memoizeSuper(caller, nom, getPrototypeOf(this));
    }
    // our super function
    var fn = _super[nom];
    if (fn) {
      // memoize information so 'fn' can call 'super'
      if (!fn._super) {
        // must not memoize null, or we lose our invariant above
        memoizeSuper(fn, nom, _super);
      }

      // invoke the inherited method
      // if 'fn' is not function valued, this will throw   
      switch (len) {
        case 0: return fn.call(this);
        case 1: return fn.call(this, a1);
        case 2: return fn.call(this, a1, a2);
        case 3: return fn.call(this, a1, a2, a3);
        case 4: return fn.call(this, a1, a2, a3, a4);
        case 5: return fn.call(this, a1, a2, a3, a4, a5);
        case 6: return fn.call(this, a1, a2, a3, a4, a5, a6);
      }

      return fn.apply(this, args);
    }
  }

  function nameInThis(ctx, value) {

    var p = ctx.__proto__;
    var cond = p;

    if ('undefined' !== typeof HTMLElement) {
      cond = p && p !== HTMLElement.prototype
    }

    while (cond) {
      // TODO(sjmiles): getOwnPropertyNames is absurdly expensive
      var n$ = Object.getOwnPropertyNames(p);
      for (var i=0, l=n$.length, n; i<l && (n=n$[i]); ++i) {
        var d = Object.getOwnPropertyDescriptor(p, n);
        if (typeof d.value === 'function' && d.value === value) {
          return n;
        }
      }
      p = p.__proto__;
    }
  }

  function memoizeSuper(method, name, proto) {
    // find and cache next prototype containing `name`
    // we need the prototype so we can do another lookup
    // from here
    var s = nextSuper(proto, name, method);
    if (s[name]) {
      // `s` is a prototype, the actual method is `s[name]`
      // tag super method with it's name for quicker lookups
      s[name].nom = name;
    }
    return method._super = s;
  }

  function nextSuper(proto, name, caller) {
    // look for an inherited prototype that implements name
    while (proto) {
      if ((proto[name] !== caller) && proto[name]) {
        return proto;
      }
      proto = getPrototypeOf(proto);
    }
    // must not return null, or we lose our invariant above
    // in this case, a super() call was invoked where no superclass
    // method exists
    // TODO(sjmiles): thow an exception?
    return Object;
  }

  // NOTE: In some platforms (IE10) the prototype chain is faked via 
  // __proto__. Therefore, always get prototype via __proto__ instead of
  // the more standard Object.getPrototypeOf.
  function getPrototypeOf(prototype) {
    return prototype.__proto__;
  }

  // utility function to precompute name tags for functions
  // in a (unchained) prototype
  function hintSuper(prototype) {
    // tag functions with their prototype name to optimize
    // super call invocations
    for (var n in prototype) {
      var pd = Object.getOwnPropertyDescriptor(prototype, n);
      if (pd && typeof pd.value === 'function') {
        pd.value.nom = n;
      }
    }
  }

  if ('undefined' !== typeof exports) {
    if ('undefined' !== typeof module && module.exports ) {
      exports = module.exports = supr
    }
    exports.supr = supr
  } else {
    root.supr = supr
  }

}).call(this);
