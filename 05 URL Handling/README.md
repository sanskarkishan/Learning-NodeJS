# URLs in Node.js

A **URL** (Uniform Resource Locator) identifies a resource and describes how to access it. For example, a browser uses a URL to request a web page. URLs can also point to files or other kinds of resources.

## Parts of a URL

Consider this example:

```text
https://shop.example.com:8443/products/shoes?color=blue&size=9#reviews
\___/   \______________/ \__/ \_____________/ \_______________/ \_____/
scheme      hostname     port      path             query       fragment
```

Not every URL contains every part. The scheme identifies the kind of URL; the remaining structure depends on that scheme.

### Scheme or protocol

The scheme appears before the first colon and indicates how the resource is addressed or accessed.

- `http:` uses the Hypertext Transfer Protocol for web requests. Data is not encrypted by HTTP itself.
- `https:` uses HTTP over TLS. TLS encrypts data in transit and authenticates the server using its certificate. It does not guarantee that the website itself is trustworthy.
- `file:` refers to a local file, for example `file:///C:/notes.txt`.
- `ftp:` refers to the File Transfer Protocol.
- `mailto:` identifies an email address, for example `mailto:hello@example.com`.

The `//` following `http:` and `https:` introduces the authority, which includes the host and may include a port. Not every scheme uses `//`, as the `mailto:` example shows.

### Hostname

`shop.example.com` is the hostname. It identifies the destination host:

- `com` is the top-level domain.
- `example.com` is the domain in this example.
- `shop` is a subdomain.

DNS normally translates a domain name into an IP address so a client can connect. A hostname can also be an IP address, such as `127.0.0.1`; IPv6 addresses are enclosed in brackets, as in `http://[::1]:8000/`. `localhost` commonly refers to the current machine.

### Port

`:8443` is the port, which identifies the network endpoint on the host. A port is optional: HTTP normally uses port `80` and HTTPS normally uses port `443` when no port is specified. A local Node.js server might use a URL such as `http://localhost:8000/`.

### Path

`/products/shoes` is the path, which identifies a resource or route on the server. Its meaning is determined by the application; it does not necessarily correspond to a file on disk.

### Query string

`?color=blue&size=9` is the query string. It starts with `?` and commonly contains key-value pairs separated by `&`. Here, the keys are `color` and `size`. The same key can appear more than once, for example `?tag=node&tag=javascript`.

Query strings are part of the URL and can appear in browser history, logs, and other places. Do not put passwords or other secrets in them.

### Fragment

`#reviews` is the fragment. It often identifies a section within a page, such as an element with `id="reviews"`. Browsers handle the fragment on the client and do not send it as part of the HTTP request to the server.

### User information

Some URLs can include user information before the host, such as `https://user:password@example.com/`. Avoid putting credentials in URLs: they can be exposed in logs, history, and other places.

## HTTP and HTTPS

| Feature | HTTP | HTTPS |
| --- | --- | --- |
| URL scheme | `http://` | `https://` |
| Default port | 80 | 443 |
| Data in transit | Not encrypted by HTTP | Encrypted using TLS |
| Server authentication | Not provided by HTTP | TLS verifies the server's certificate |

Use HTTPS for websites and APIs, especially when sending sensitive information. HTTPS protects the connection, but it does not make an unsafe application or destination safe.

## URL encoding

Some characters need percent-encoding when used as data in a URL. For example, a space can be encoded as `%20`: `https://example.com/search?q=running%20shoes`. In form-style query strings, `+` can also represent a space. Use URL APIs to encode values rather than manually joining untrusted input into a URL.

## Parsing a URL in Node.js

Node.js provides the `URL` class and `URLSearchParams` for inspecting and building URLs:

```javascript
const address = new URL(
	"https://shop.example.com:8443/products/shoes?color=blue&size=9#reviews"
);

console.log(address.protocol); // "https:"
console.log(address.hostname); // "shop.example.com"
console.log(address.port); // "8443"
console.log(address.pathname); // "/products/shoes"
console.log(address.search); // "?color=blue&size=9"
console.log(address.searchParams.get("color")); // "blue"
console.log(address.hash); // "#reviews"
console.log(address.origin); // "https://shop.example.com:8443"
```

The **origin** combines the scheme, host, and effective port. It does not include the path, query, or fragment.

To add a query parameter safely, use `searchParams`:

```javascript
const address = new URL("https://example.com/search");
address.searchParams.set("q", "running shoes");

console.log(address.href); // "https://example.com/search?q=running+shoes"
```

`new URL()` throws an error for an invalid URL. A relative URL needs a base, for example `new URL("/products", "https://example.com")`.