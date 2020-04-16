var ch01 = require("./ch01/statement")
var invoices = require("./ch01/invoices.json");
var plays = require("./ch01/plays.json");

console.log("hello world!\n");

var rtn =ch01.statement(invoices[0],plays);
console.log(rtn);
 
console.log("good night!\n");