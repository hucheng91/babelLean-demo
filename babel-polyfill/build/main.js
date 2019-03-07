"use strict";

require("core-js/modules/es6.object.assign");

require("core-js/modules/es7.array.includes");

var array = [1, 2, 3, 4, 5, 6];
array.includes(function (item) {
  return item > 2;
});
Object.assign({}, {
  a: 1,
  b: 2
});