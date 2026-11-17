// const http = require("http"); // no need
const express = require("express");

const app = express();

app.get('/', (req, res) => {
    return res.send('Hello From Home Page');
});

app.get('/about', (req, res) => {
    return res.send("About Page");
});

// const myServer = http.createServer(app);
// myServer.listen(8000, () => console.log('Server started : 8000'));

// The above code will replce by the bottom one, althogh the above is also work.
app.listen(8000, () => console.log('Server started : 8000'));