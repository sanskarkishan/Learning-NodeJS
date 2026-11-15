# What Is Node.js?

Node.js is a runtime environment for JavaScript.

Node.js is a free, open-source runtime that lets you run JavaScript outside a web browser. It uses the V8 JavaScript engine, the same engine used by Google Chrome.

Developers commonly use Node.js to build web servers, APIs, command-line tools, and real-time applications. Its built-in support for asynchronous operations makes it well suited to handling many network requests at once.

Node.js can also connect JavaScript to native system features. Its runtime uses C and C++, and native addons written in these languages can expose lower-level machine capabilities to JavaScript.

Node.js is not a programming language or a web framework. JavaScript is the language; Node.js provides the environment and tools for running JavaScript on a computer or server.

## Why use Node.js?

Node.js is a good choice when you need high-throughput, real-time applications like chat servers, APIs, or streaming services. Its non-blocking architecture means it can handle many concurrent connections without spawning a new thread for each one. The npm ecosystem also gives access to a large library of reusable packages.

## History of Node.js

Node.js was first released in 2009 by Ryan Dahl, who wanted a way to build scalable network applications using JavaScript. The project was eventually forked in 2014 to create io.js, which was later merged back in 2015 under the Node.js Foundation. Since then, it has grown into one of the most widely used server-side runtimes.

## Browser JavaScript vs. Node.js

The `hello.js` file uses `window` and `alert()`, which are browser APIs. Node.js runs JavaScript outside the browser and does not provide these browser globals by default. When Node.js reaches `window`, it throws a `ReferenceError` and stops, so the `alert()` line is not reached.

In a browser, `window` represents the browser window and `alert()` displays a dialog. In Node.js, use `console.log()` to print a message:

```javascript
console.log("Hi");
```

V8 executes JavaScript; it does not include the browser's DOM or UI. A browser provides those Web APIs around its JavaScript engine. Node.js embeds V8 with its own APIs instead, so browser features such as `document` and `window` are not available by default.

Node.js and the browser both run JavaScript but in different environments with different APIs. The browser provides access to the `DOM`, `window`, and browser-specific APIs, while Node.js provides access to the `file system`, `operating system`, and `network`. Code written for one environment does not always work in the other without adjustments.

## Initialize a Node.js Project

Run `npm init` from your project folder to create a `package.json` file. npm asks questions about the project, such as its name and version. The file stores project metadata and can also define scripts and list dependencies.

```sh
npm init
```

To accept the default answers without going through the prompts, run:

```sh
npm init -y
```

You can run Node.js code from the terminal using the node command followed by a filename. For quick experiments, Node.js also includes a REPL (Read-Eval-Print Loop) that lets you execute JavaScript interactively. Understanding how to run scripts and interpret output is the starting point for working with Node.js.



