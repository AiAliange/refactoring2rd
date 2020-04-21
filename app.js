var ch01 = require("./ch01/statement")
var invoices = require("./ch01/invoices.json");

console.log("hello world!\n");

var rtn =ch01.statement(invoices[0]);
console.log(rtn);
 
console.log("good night!\n");