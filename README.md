# supr

A quick and convenient way to call parent methods in inherited classes, extracted from [Polymer](https://github.com/Polymer/polymer-dev/blob/master/src/lib/super.js).

Note: For this module to work, please don't use `strict mode`, this because the super function requires the use of `caller` which is deprecated in ES5 `strict mode` and will return `null`. 

It's up to you if you want to use it, ES6 will have a `super` with similar functionality.

## Instalation

``` bash
$ npm install supr
```

## Usage

```js
var supr = require('supr');

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
  console.log('sub');
};

// Sub sub class
function SubSub() { Sub.call(this); };
SubSub.prototype.__proto__ = Sub.prototype;
SubSub.prototype.say = function(str) {
  return this.super('subsub:' + str);
  console.log(' sub + sub');
};

// Instance
var subSub = new SubSub;
var msg = subSub.say('instance');
console.log(msg); //-> 'base:sub:subsub:instance'

```
## Run Test

```bash
$ make test
```

## LICENSE

Copyright (c) 2014 The Polymer Authors. All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are
met:

  * Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
  * Redistributions in binary form must reproduce the above
copyright notice, this list of conditions and the following disclaimer
in the documentation and/or other materials provided with the
distribution.
  * Neither the name of Google Inc. nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.