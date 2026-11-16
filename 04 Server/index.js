const http = require("http");
const { logs } = require("./log");
const myServer = http.createServer((req, res) =>{
    console.log("New Request Receive");
    logs();
    // console.log(req);
    
    res.end("Hello from Server");
});

myServer.listen(8000, () => {
    console.log("Server Started");
});