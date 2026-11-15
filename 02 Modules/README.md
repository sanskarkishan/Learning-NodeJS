# What Are JavaScript Modules?

A module is a piece of a program kept in its own file. Modules let you split a larger application into smaller, organized parts. A module can expose specific values or functions for other files to use, while keeping its other code private.

For example, one file can define and export a function, and another file can import and use it. This makes code easier to reuse, understand, and maintain.

## CommonJS

CommonJS is Node.js's traditional module system. It uses `module.exports` to share values and `require()` to load them:

```javascript
// greetings.js
function sayHello(name) {
	return `Hello, ${name}!`;
}

module.exports = sayHello;
```

```javascript
// App.js
const sayHello = require("./greetings");

console.log(sayHello("Sam"));
```

### Using `exports` for Multiple Functions

CommonJS also provides `exports` as a shortcut for adding properties to `module.exports`. You can assign each function to a property:

```javascript
// math.js
exports.add = (a, b) => a + b;
exports.sub = (a, b) => a - b;
```

Import the functions by their property names in another file:

```javascript
// App.js
const { add, sub } = require("./math");

console.log(add(5, 3));
console.log(sub(5, 3));
```

`exports` initially refers to `module.exports`, so adding properties to it exposes them from the module. Avoid assigning a new object directly to `exports`; use `module.exports = ...` when replacing the exported value.

## Exporting Multiple Functions

You can export several functions from one file. With CommonJS, put the functions in an object assigned to `module.exports`. The other file can use `require()` and destructure the functions it needs.

```javascript
// math.js
function add(firstNumber, secondNumber) {
	return firstNumber + secondNumber;
}

function subtract(firstNumber, secondNumber) {
	return firstNumber - secondNumber;
}

module.exports = { add, subtract };
```

```javascript
// App.js
const { add, subtract } = require("./math");

console.log(add(5, 3));
console.log(subtract(5, 3));
```

Here, `module.exports` exposes both functions as properties of one object. The braces in `require()` extract those properties into variables with the same names.

### With Anonymous Functions

You can also put anonymous function expressions directly in the exported object. They do not have declared function names; the object properties (`add` and `subtract`) provide the names used to access them:

```javascript
// math.js
module.exports = {
	add: function (firstNumber, secondNumber) {
		return firstNumber + secondNumber;
	},
	subtract: function (firstNumber, secondNumber) {
		return firstNumber - secondNumber;
	}
};
```

```javascript
// App.js
const math = require("./math");

console.log(math.add(5, 3));
console.log(math.subtract(5, 3));
```

The exported value is still one object containing two functions. `math.add` and `math.subtract` refer to the object properties, so each function can be called separately.

### With Arrow Functions

Arrow functions can also be exported as object properties. These are anonymous arrow-function expressions, and the property names are used to access them:

```javascript
// math.js
module.exports = {
	add: (firstNumber, secondNumber) => firstNumber + secondNumber,
	subtract: (firstNumber, secondNumber) => firstNumber - secondNumber
};
```

```javascript
// App.js
const math = require("./math");

console.log(math.add(5, 3));
console.log(math.subtract(5, 3));
```

With ES Modules, export each function by name and import the names inside braces:

```javascript
// math.js
export function add(firstNumber, secondNumber) {
	return firstNumber + secondNumber;
}

export function subtract(firstNumber, secondNumber) {
	return firstNumber - secondNumber;
}
```

```javascript
// App.js
import { add, subtract } from "./math.js";

console.log(add(5, 3));
console.log(subtract(5, 3));
```

## ES Modules

ES Modules use `export` and `import`. In Node.js, enable this syntax by setting `"type": "module"` in `package.json`, or use the `.mjs` file extension.

```javascript
// greetings.js
export function sayHello(name) {
	return `Hello, ${name}!`;
}
```

```javascript
// App.js
import { sayHello } from "./greetings.js";

console.log(sayHello("Sam"));
```
