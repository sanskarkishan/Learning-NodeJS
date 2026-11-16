const fs = require("fs");
exports.logs = () => {
    const data = `${Date.now()} : New Request Received\n`;
    fs.appendFile("log.txt", data, (err, res) =>{
    });
}