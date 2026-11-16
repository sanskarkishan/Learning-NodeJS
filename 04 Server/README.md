# Servers in Node.js

A server is a program that listens for requests and sends responses. For example, a browser can request a page from a server, and the server can send back HTML, JSON, or plain text.

Node.js can create servers using its built-in modules. The `http` module handles HTTP requests and responses; it comes with Node.js, so you do not need to install it separately.

## How `index.js` works

```javascript
const http = require("http");
const { logs } = require("./log");
const myServer = http.createServer((req, res) => {
	console.log("New Request Receive");
	logs();
	// console.log(req);

	res.end("Hello from Server");
});

myServer.listen(8000, () => {
	console.log("Server Started");
});
```

1. `require("http")` loads Node.js's built-in HTTP module.
2. `require("./log")` loads the local `log.js` module, and destructuring takes its exported `logs` function.
3. `http.createServer(...)` creates an HTTP server. The callback runs for each incoming request. `req` contains request information such as its method, URL, and headers.
4. `res` is the response object. `res.end("Hello from Server")` writes that text and finishes the response. The code does not explicitly set a status code, so Node.js sends `200 OK` by default.
5. For each request, `logs()` starts an asynchronous write to the log file. The commented-out `console.log(req)` does not currently run.
6. `myServer.listen(8000, ...)` starts listening on port `8000`. Once the server is listening, its callback prints `Server Started`.

The server sends the same response for every request, regardless of its URL or method. A browser may also request `/favicon.ico`, so opening the page can produce more than one request log.

## How `log.js` works

```javascript
const fs = require("fs");
exports.logs = () => {
	const data = `${Date.now()} : New Request Received\n`;
	fs.appendFile("log.txt", data, (err, res) => {
	});
};
```

- `require("fs")` loads Node.js's built-in file-system module.
- `exports.logs` exposes a function that `index.js` can import and call for each request.
- `Date.now()` gives the current time as milliseconds since January 1, 1970 UTC. The template literal combines that timestamp with a message, and `\n` puts each new entry on a separate line.
- `fs.appendFile()` asynchronously adds the entry to `log.txt`, creating the file if needed. The relative path is resolved from the directory where the Node.js process was started.
- The callback runs after the append finishes. Its `err` argument reports a failure; `appendFile()` does not pass response data as a second argument, so the callback's `res` is unnecessary and is unrelated to the HTTP response.

The current callback is empty, so a failed log write is not reported. Check `err` in the callback:

```javascript
fs.appendFile("log.txt", data, (err) => {
	if (err) {
		console.error("Could not write log:", err);
	}
});
```

Calling `logs()` starts the append but does not wait for it to finish. The server can send its HTTP response before the log write completes.

## Why can `console.log(req)` print twice?

If you uncomment `console.log(req)`, the server callback runs once **per HTTP request**, not once per page visit. A browser commonly sends:

1. `GET /` for the page.
2. `GET /favicon.ico` for the small icon shown in the browser tab.

Each request runs the callback and prints its own `req` object. The exact number of requests can vary by browser, cache, extensions, or other clients; `/favicon.ico` is a common explanation, not a guarantee.

To see which requests are arriving, temporarily log the method and URL instead of the full request object:

```javascript
console.log(req.method, req.url);
```

For example, the terminal may show:

```text
GET /
GET /favicon.ico
```

The current server responds with `Hello from Server` to both requests because it does not check the URL. The favicon request is separate from the page request, not the same `console.log` executing twice for a single request.

## Run the server

From the `04 Server` folder, run:

```bash
npm start
```

The package's `start` script runs `node index.js`. After `Server Started` appears, open `http://localhost:8000` in a browser. The browser displays:

```text
Hello from Server
```

The request logs appear in the terminal running Node.js, not in the browser. Press `Ctrl+C` in that terminal to stop the server. If port `8000` is already in use, the server cannot start until that conflict is resolved or the port is changed.

Because `listen()` does not specify a hostname, Node.js listens on an unspecified address rather than only on `localhost`; the server may be reachable from other devices depending on your network and firewall.