# Express.js

## What is Express?

**Express.js** (usually called **Express**) is a small, flexible web framework for Node.js. It runs on top of Node's HTTP server and provides convenient APIs for handling HTTP requests and sending responses.

Express is not a programming language, a database, or a complete application by itself. It does not replace Node.js; it organizes the web-server work that you would otherwise build with Node's lower-level `http` module.

## Why use Express?

With Node's built-in `http` module, you need to do more work yourself to inspect the request URL and method, match routes, parse request data, and choose a response. Express gives you common building blocks for these jobs:

- **Routing:** map a method and URL, such as `GET /api/products`, to a handler.
- **Middleware:** run reusable request-processing functions for logging, parsing, authentication, and more.
- **Request and response helpers:** read route parameters and query values; send JSON, files, and status codes.
- **Modularity:** organize related routes into separate routers.

Express helps keep server code organized; it does not automatically provide application features such as database access, user accounts, validation, or authorization. You choose and configure those separately.

## Install and start

In a new project:

```sh
npm init -y
npm install express
```

Save the following as `app.js`, then run `node app.js`:

```javascript
const express = require("express");

const app = express();
const port = process.env.PORT || 3000;

// Middleware: parse incoming JSON request bodies.
app.use(express.json());

// Middleware: run for requests that reach this point.
app.use((req, res, next) => {
	console.log(`${req.method} ${req.path}`);
	next();
});

// Example data only; it is lost when the process restarts.
const products = [
	{ id: 1, name: "Keyboard", category: "accessories" },
	{ id: 2, name: "Notebook", category: "stationery" },
];
let nextId = 3;

app.get("/api/products", (req, res) => {
	const category = req.query.category;
	const result =
		typeof category === "string"
			? products.filter((product) => product.category === category)
			: products;

	res.json(result);
});

app.get("/api/products/:id", (req, res) => {
	const id = Number(req.params.id);
	const product = products.find((item) => item.id === id);

	if (!Number.isInteger(id) || !product) {
		return res.status(404).json({ error: "Product not found" });
	}

	res.json(product);
});

app.post("/api/products", (req, res) => {
	const { name, category } = req.body || {};
	if (typeof name !== "string" || !name.trim()) {
		return res.status(400).json({ error: "A non-empty name is required" });
	}

	const product = {
		id: nextId++,
		name: name.trim(),
		category: typeof category === "string" ? category : "uncategorized",
	};
	products.push(product);

	res.status(201).json(product);
});

// A 404 handler: no route above handled this request.
app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

// Error-handling middleware has four parameters and belongs after the routes.
app.use((err, req, res, next) => {
	console.error(err);
	if (res.headersSent) {
		return next(err);
	}
	res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
```

Try these URLs after starting the server:

- `http://localhost:3000/api/products` — list products.
- `http://localhost:3000/api/products?category=accessories` — filter using a query string.
- `http://localhost:3000/api/products/1` — get a product by its route parameter.

To create a product, send a JSON `POST` request to `/api/products` with `Content-Type: application/json` and a body such as `{"name":"Mouse","category":"accessories"}`. For example, an API client can send this request:

```http
POST /api/products HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{"name":"Mouse","category":"accessories"}
```

The in-memory array is only for learning. A real application would normally read and write records in a database.

## Routes and HTTP methods

A **route** is the combination of an HTTP method, a path, and the function that handles a matching request. Common Express route methods include:

| Express | Typical purpose |
| --- | --- |
| `app.get(path, handler)` | Read or retrieve a resource |
| `app.post(path, handler)` | Submit data or create a resource |
| `app.put(path, handler)` | Replace a resource |
| `app.patch(path, handler)` | Partially update a resource |
| `app.delete(path, handler)` | Delete a resource |
| `app.all(path, handler)` | Handle any HTTP method for a path |

Use the method that matches the operation's meaning. A route handler usually receives `(req, res)`: `req` contains request information and `res` is used to send the response. A handler must finish the response (for example with `res.send()` or `res.json()`) or pass control onward with `next()`.

### Where request data lives

- **Route parameters** identify a part of the route: `/api/products/:id` makes the value available as `req.params.id`.
- **Query parameters** are optional values after `?`: `/api/products?category=accessories` makes the value available as `req.query.category`.
- **Request body** carries submitted data, commonly JSON, and is available as `req.body` after the matching body-parsing middleware runs.

Treat all request data as untrusted input. Validate its shape and values before using it. Query and body values are not guaranteed to be simple strings or valid data.

## Middleware and request flow

**Middleware** is a function that runs during the request-response cycle. It can inspect or change the request and response, end the response, or call `next()` to pass control to the next matching middleware or route.

```javascript
app.use((req, res, next) => {
	console.log(req.method, req.path);
	next(); // Without a response or next(), the request can hang.
});
```

Middleware runs in the order it is registered. For example, put `express.json()` before routes that read `req.body`. A middleware can be mounted for every path with `app.use(...)` or for a specific path with `app.use("/api", ...)`.

Express includes commonly used middleware such as `express.json()` for JSON bodies, `express.urlencoded({ extended: true })` for URL-encoded form bodies, and `express.static(...)` for static files. Other middleware can be installed from npm, for example for security headers or request logging.

## Organizing routes with `express.Router`

As an application grows, move related routes into a router and mount it in the main app:

```javascript
// routes/products.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
	res.json([]);
});

router.get("/:id", (req, res) => {
	res.json({ id: req.params.id });
});

module.exports = router;
```

```javascript
// app.js
const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);
```

The router paths are relative to the mount path, so `router.get("/:id", ...)` handles `GET /api/products/123`.

## Responses, errors, and status codes

Use a status code that describes the outcome, and return a response body that is useful to the client:

- `200 OK` — successful request, commonly a read or update.
- `201 Created` — a resource was created.
- `204 No Content` — successful request with no response body.
- `400 Bad Request` — invalid input.
- `401 Unauthorized` — authentication is required or failed.
- `403 Forbidden` — the client is not allowed to perform the operation.
- `404 Not Found` — the resource or route does not exist.
- `500 Internal Server Error` — an unexpected server-side failure.

`res.json(data)` sends JSON, `res.status(code)` sets the status, and they can be chained as `res.status(201).json(data)`. Send one response per request; do not call `next()` after sending it unless you are intentionally passing an error onward.

Register a 404 handler after the application's routes. Error-handling middleware has the signature `(err, req, res, next)` and should be registered after the routes and other middleware. Pass errors to `next(err)` to reach it. In asynchronous handlers, make sure rejected promises and thrown errors are forwarded to error handling; explicit `try`/`catch` with `next(err)` is a compatible approach across Express versions.

## Serving static files

To serve assets such as images, CSS, or browser-side JavaScript, use the built-in static middleware:

```javascript
const path = require("node:path");

app.use(express.static(path.join(__dirname, "public")));
```

Files in `public` are then available from the site root; for example, `public/images/logo.png` can be requested at `/images/logo.png`. Place static middleware deliberately in the middleware order, and do not expose private files.

## Developer practices

- Validate and normalize input; `express.json()` parses JSON but does not validate it.
- Use authentication to establish who a user is and authorization to check what that user may do. CORS is not authentication.
- Handle errors centrally, log useful server-side details, and avoid returning stack traces or secrets to clients.
- For production, use HTTPS (often terminated by a trusted reverse proxy), protect secrets with environment/configuration management, and consider security headers, rate limiting, and safe cookie/session settings as appropriate.
- Use a persistent database instead of in-memory arrays for application data that must survive restarts.
- Keep middleware ordering intentional; parsers, loggers, authentication checks, routes, 404 handling, and error handling each have a place.
- Read the documentation for the Express version and middleware you use; behavior and APIs can vary by version.

Express is a good choice when you want a lightweight Node.js HTTP framework with flexible routing and middleware. It still leaves architectural choices and many application responsibilities to you.