console.log("Modules");

const greet = require("./greetings");

console.log(greet("Sanskar"));


const { add, subtract } = require("./math");

console.log("Addition",add(5, 3));
console.log("Subtraction",subtract(5, 3));