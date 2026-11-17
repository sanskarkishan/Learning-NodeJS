# REST APIs

## What is an API?

An **API** (Application Programming Interface) is a set of rules that lets one program ask another program to do something or share data. A **web API** does this over a network using HTTP. For example, a website or mobile app can ask a server for product information.

## What does REST mean?

**REST** (Representational State Transfer) is a set of design ideas for building web APIs. A **REST API** exposes things (called **resources**) over HTTP and uses standard HTTP methods and responses to work with them. An API that follows these ideas is often called **RESTful**.

REST is not a programming language, a server framework, or a specific data format. JSON (a text format for structured data) is common, but REST does not require JSON. Not every API that uses HTTP is RESTful.

## REST concepts developers should know

- **Resources:** The things the API exposes, such as products, users, and orders. A URL identifies a resource, for example `/api/v1/products/42` identifies product 42.
- **Representations:** The data sent to or received from the API to describe a resource. A product's representation might be JSON such as `{"id":42,"name":"Keyboard"}`.
- **HTTP methods:** The method describes the operation. Use `GET` to read, `POST` to create or process, `PUT` to replace, `PATCH` to partially update, and `DELETE` to remove.
- **Stateless requests:** Each request includes the information the server needs to handle it. The server can store product data, but should not depend on hidden request context from an earlier request.
- **Standard HTTP responses:** Use HTTP status codes and headers so clients can understand the result, caching rules, and content format.
- **Client-server separation:** The client interface and server implementation can evolve independently as long as they keep the API contract.
- **Layered system:** A request may pass through servers such as proxies or gateways. The client does not need to know about those internal layers.

An **API contract** is the shared agreement about the URLs, methods, data, and responses that a client and server use. REST describes design rules for keeping that agreement consistent. A fully RESTful API also uses **hypermedia**: links in responses that help clients find related resources or actions. Many real-world APIs use some, but not all, of REST's design rules.

## How a REST API works: client-server flow

The **client** (the program making the request) asks for data or an action. The **server** (the program receiving it) handles the request and sends a response. They communicate over a network using HTTP or HTTPS. A client might be a browser, mobile app, or another server. The API server runs the code that handles requests and may use a database.

A typical REST API request works like this:

```text
Client             API server              Database
  |                     |                      |
  |-- HTTP request ---->|                      |
  |                     |-- query/update ---->|
  |                     |<----- data ----------|
  |<-- HTTP response ---|                      |
  |                     |                      |
```

1. **Send a request:** The client sends an HTTP method and URL, plus headers and sometimes a body. For example, `GET /api/v1/products/42` asks for product 42.
2. **Receive and match it:** The server matches the method and URL to a **route** (the code that handles that request). **Middleware** is reusable code that can run before a route, for example to check a request or read JSON.
3. **Check and do the work:** The server validates the data, checks whether the client is allowed to perform the action, and reads or changes data, often in a database.
4. **Send a response:** The server returns a status code (the result), headers (information about the response), and usually a body (the returned data). A successful read commonly returns JSON.
5. **Use the result:** The client checks the status code, reads the response body, and displays or uses the data. It should handle errors such as `400`, `401`, or `404` as well as success.

With HTTPS, HTTP data travels over an encrypted connection. TLS is the technology that provides this encryption.

For example, the server can respond to `GET /api/v1/products/42` with:

```http
HTTP/1.1 200 OK
Content-Type: application/json

{"id":42,"name":"Keyboard","price":49.99}
```

The `Content-Type` response header tells the client that the body is JSON. JSON is common for REST APIs, but not every response has a body or uses JSON; for example, `204 No Content` has no response body.

Each request should include the information the server needs; the server should not depend on hidden information from an earlier request. The client calls the API rather than connecting directly to the database. This lets the server check data and permissions and apply the application's rules. Multiple clients, such as a website and mobile app, can use the same API.

## Resources, URLs, and methods

Use **nouns** (names of things) for resource paths and use the HTTP method to describe the action:

```text
GET    /api/v1/products       List products
GET    /api/v1/products/42    Read product 42
POST   /api/v1/products       Create a product
PUT    /api/v1/products/42    Replace product 42
PATCH  /api/v1/products/42    Partially update product 42
DELETE /api/v1/products/42    Delete product 42
```

Avoid action-heavy routes such as `/getProducts` or `/deleteProduct/42` when a resource path and HTTP method express the operation clearly.

| Method | Typical use | Safe? | Idempotent? |
| --- | --- | --- | --- |
| `GET` | Read a resource or collection | Yes | Yes |
| `POST` | Create a resource or ask the server to process data | No | Usually no |
| `PUT` | Create or fully replace the target resource | No | Yes |
| `PATCH` | Apply a partial update | No | Not necessarily |
| `DELETE` | Remove the target resource | No | Yes |

**Safe** means the method is intended to read without changing data. **Idempotent** means sending the same request more than once has the same intended effect as sending it once. The response itself can differ: a repeated `DELETE` might return `404` after the first request removed the resource.

Use `PUT` when the request represents the complete replacement of a resource; use `PATCH` when it contains only fields to change. Don't use `GET` to make changes. Browsers and other network software may automatically repeat or cache a `GET` because it is meant to be safe.

## Requests and responses

An HTTP request includes a method, a URL, headers, and sometimes a body:

```http
POST /api/v1/products HTTP/1.1
Host: api.example.com
Content-Type: application/json
Accept: application/json

{"name":"Keyboard","price":49.99}
```

- **Path parameters** are values in the path that identify a resource, such as `42` in `/products/42`.
- **Query parameters** come after `?` and commonly filter, sort, or limit a list, such as `/products?category=accessories&limit=20`.
- **Headers** carry extra information. `Content-Type` says what format the request body uses; `Accept` says what response format the client can read. Authentication credentials are commonly sent in an `Authorization` header, not in the URL.
- **Body** is the data sent with a request, commonly JSON. Always validate it on the server; parsing JSON does not make the data valid or safe.

Successful responses should use appropriate status codes and a consistent representation. For a created resource, return `201 Created` and, when practical, a `Location` header containing the new resource's URL. For a successful `DELETE` with no response body, `204 No Content` is common.

### Common HTTP status codes

The status code is a number in the response that tells the client what happened. The first digit gives a broad category: `2xx` means success, `4xx` means the request needs attention, and `5xx` means the server failed.

| Code | Meaning | Typical use |
| --- | --- | --- |
| `200 OK` | Request succeeded | Return a resource or result |
| `201 Created` | A resource was created | Successful `POST` |
| `202 Accepted` | Work was accepted but is not complete | Background or asynchronous processing |
| `204 No Content` | Request succeeded with no body | Successful deletion |
| `400 Bad Request` | Request is invalid | Invalid JSON or validation failure |
| `401 Unauthorized` | Authentication is missing or invalid | Client needs valid authentication |
| `403 Forbidden` | Client is not allowed to perform the action | Authenticated client lacks permission |
| `404 Not Found` | Resource or route does not exist | Unknown resource ID |
| `409 Conflict` | Request conflicts with current state | Duplicate or conflicting update |
| `415 Unsupported Media Type` | Request body format is unsupported | Wrong `Content-Type` |
| `422 Unprocessable Content` | Content is understood but semantically invalid | Field validation failure (if used by the API) |
| `429 Too Many Requests` | Client sent too many requests | Rate limiting |
| `500 Internal Server Error` | Unexpected server failure | Generic server-side error |

`401` means the client has not successfully proven who it is (**authentication**). `403` means the server knows who the client is but does not allow the requested action (**authorization/permission**). Return useful error messages, but do not expose stack traces, secrets, or internal details.

## Example: a small REST API with Express

This runnable example uses an in-memory array (data held temporarily in the program) to demonstrate CRUD routes: **Create, Read, Update, Delete**. The data disappears when the server restarts; a real API normally uses a database.

In a new project, run these commands from the project folder:

```sh
npm init -y
npm install express
```

Save the following code as `app.js`. `express.json()` reads incoming JSON request bodies so the route can use `req.body`. `express.Router()` groups related routes together. At the end, the router is mounted at `/api/v1`, so `router.get("/products", ...)` handles `GET /api/v1/products`. In a route such as `"/products/:id"`, `:id` is a placeholder for a value in the URL; Express makes that value available as `req.params.id`.

```javascript
const express = require("express");

const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "100kb" }));

let products = [
	{ id: 1, name: "Keyboard", price: 49.99 },
	{ id: 2, name: "Mouse", price: 24.99 },
];
let nextId = 3;

function parseId(req, res) {
	const id = Number(req.params.id);
	if (!Number.isSafeInteger(id) || id < 1) {
		res.status(400).json({ error: "Product ID must be a positive integer" });
		return undefined;
	}
	return id;
}

function isValidProduct(body) {
	return (
		body &&
		typeof body === "object" &&
		!Array.isArray(body) &&
		typeof body.name === "string" &&
		body.name.trim().length > 0 &&
		typeof body.price === "number" &&
		Number.isFinite(body.price) &&
		body.price >= 0
	);
}

function isObjectBody(body) {
	return body && typeof body === "object" && !Array.isArray(body);
}

router.get("/products", (req, res) => {
	res.json(products);
});

router.get("/products/:id", (req, res) => {
	const id = parseId(req, res);
	if (id === undefined) return;

	const product = products.find((item) => item.id === id);
	if (!product) {
		return res.status(404).json({ error: "Product not found" });
	}

	res.json(product);
});

router.post("/products", (req, res) => {
	if (!isValidProduct(req.body)) {
		return res.status(400).json({
			error: "A non-empty name and a non-negative numeric price are required",
		});
	}

	const product = {
		id: nextId++,
		name: req.body.name.trim(),
		price: req.body.price,
	};
	products.push(product);

	res
		.location(`/api/v1/products/${product.id}`)
		.status(201)
		.json(product);
});

router.put("/products/:id", (req, res) => {
	const id = parseId(req, res);
	if (id === undefined) return;

	const index = products.findIndex((item) => item.id === id);
	if (index === -1) {
		return res.status(404).json({ error: "Product not found" });
	}
	if (!isValidProduct(req.body)) {
		return res.status(400).json({
			error: "A non-empty name and a non-negative numeric price are required",
		});
	}

	products[index] = { id, name: req.body.name.trim(), price: req.body.price };
	res.json(products[index]);
});

router.patch("/products/:id", (req, res) => {
	const id = parseId(req, res);
	if (id === undefined) return;

	const index = products.findIndex((item) => item.id === id);
	if (index === -1) {
		return res.status(404).json({ error: "Product not found" });
	}

	const body = req.body;
	const allowedFields = ["name", "price"];
	if (
		!isObjectBody(body) ||
		Object.keys(body).length === 0 ||
		Object.keys(body).some((key) => !allowedFields.includes(key)) ||
		("name" in body && (typeof body.name !== "string" || !body.name.trim())) ||
		("price" in body &&
			(typeof body.price !== "number" ||
				!Number.isFinite(body.price) ||
				body.price < 0))
	) {
		return res.status(400).json({ error: "Invalid product update" });
	}

	const update = {};
	if ("name" in body) update.name = body.name.trim();
	if ("price" in body) update.price = body.price;
	products[index] = { ...products[index], ...update };

	res.json(products[index]);
});

router.delete("/products/:id", (req, res) => {
	const id = parseId(req, res);
	if (id === undefined) return;

	const index = products.findIndex((item) => item.id === id);
	if (index === -1) {
		return res.status(404).json({ error: "Product not found" });
	}

	products.splice(index, 1);
	res.status(204).end();
});

app.use("/api/v1", router);

app.use((req, res) => {
	res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
	if (res.headersSent) return next(err);

	const status =
		Number.isInteger(err.status) && err.status >= 400 && err.status < 500
			? err.status
			: 500;
	if (status >= 500) console.error(err);
	res
		.status(status)
		.json({ error: status < 500 ? "Invalid request" : "Internal server error" });
});

app.listen(port, () => {
	console.log(`API listening at http://localhost:${port}`);
});
```

Start the server from the project folder:

```sh
node app.js
```

Try these read requests in a browser or an HTTP client (a tool for sending API requests):

```http
GET http://localhost:3000/api/v1/products
GET http://localhost:3000/api/v1/products/1
```

To create a product, send this `POST` request with an HTTP client such as Postman. `Content-Type: application/json` tells the server that the request body is JSON:

```http
POST /api/v1/products HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Accept: application/json

{"name":"Monitor","price":199.99}
```

The routes demonstrate these operations: `GET` lists or reads products, `POST` creates one, `PUT` replaces all editable fields, `PATCH` changes only the fields you send, and `DELETE` removes one. For `PUT`, send both `name` and `price`; for `PATCH`, send one or both. This example returns `404` if a `PUT` targets a product that does not exist; an API can instead allow `PUT` to create a resource at a client-chosen URL.

In the code, `req` (request) holds incoming data and `res` (response) is used to send data back. For example, `res.status(201).json(product)` sends the new product as JSON with the `201 Created` status. The code checks input before saving it and returns `400` for invalid input or `404` when a product is not found. The final error handler handles errors such as malformed JSON and returns a generic message instead of exposing internal details.

## Designing a dependable API

- **Keep the contract consistent:** Use predictable names, response shapes, status codes, and error formats across routes.
- **Validate input:** Check types, required fields, lengths, ranges, and allowed values before using input. Never trust a client-side check alone.
- **Use database safeguards:** Use parameterized queries (send data values separately from SQL) or a trusted ORM (a library that helps your code work with a database). Never build SQL by joining request data into a string. Check permissions for each resource so users cannot access someone else's data by changing an ID.
- **Authenticate and authorize separately:** Authentication identifies the caller; authorization checks whether that caller may perform this operation on this resource.
- **Protect transport and secrets:** Use HTTPS, keep credentials out of URLs and source control, and avoid returning sensitive data in responses or logs.
- **Plan for growth and abuse:** Paginate (return a long list in smaller pages), limit page sizes and request-body sizes, and consider rate limiting (restricting how many requests a client can make in a period).
- **Use caching deliberately:** Caching stores a response temporarily so it can be reused. `Cache-Control` controls caching, and an `ETag` is a version identifier that can help a client check whether a response changed. Do not mark private or user-specific data as public.
- **Make retries safe:** `GET`, `PUT`, and `DELETE` are intended to be idempotent, but your code must preserve that behavior. To safely retry a `POST` (for example, creating a payment), an API can use an **idempotency key**: a unique value that lets the server recognize a repeated request.
- **Version intentionally:** A path prefix such as `/api/v1` is common, but not required by REST. Plan how clients can move to a new version when you make breaking changes.
- **Document and test the contract:** Describe routes, fields, authentication, status codes, and errors, and test both success and failure cases. OpenAPI is a common format for writing API documentation.

REST gives an API useful design rules, but does not build the application for you. The server still needs good data structures, validation, security, error handling, and testing.