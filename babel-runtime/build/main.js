"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs2/helpers/interopRequireDefault");

var _promise = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/promise"));

var _isArray = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/array/is-array"));

var _assign = _interopRequireDefault(require("@babel/runtime-corejs2/core-js/object/assign"));

require("core-js/modules/es7.array.includes");

var array = [1, 2, 3, 4, 5, 6];
array.includes(function (item) {
  return item > 2;
});
(0, _assign.default)({}, {
  a: 1,
  b: 2
});
(0, _isArray.default)([]);
new _promise.default();