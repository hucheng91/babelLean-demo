const  ms  = require('./ms.macro');
const file = require('./file.macro');
const files = require("./files.macro");

const ONE_DAY = ms`1 day`;
const TWO_DAYS = ms`2 days`;

console.log(ONE_DAY, TWO_DAYS);


const fileArray = file`build`;




const allImages = files("./build");