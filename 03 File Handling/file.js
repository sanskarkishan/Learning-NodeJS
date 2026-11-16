const fs = require("fs");

fs.writeFileSync(
    "./testSync.txt",
    "This is created using fs package by Synchronous method"
);

fs.writeFile(
    "./testAsync.txt",
    "This is created using fs package by Asynchronous method",
    (error) => {
        // if (error) {
        //     console.error("Could not write file:", error);
        //     return;
        // }

        // console.log("Async file written");
    }
);

exports.readData1 = fs.readFileSync("./test.txt", "utf-8");
fs.readFile("./test.txt", "utf-8", (err, result) => {
    if(err){
        console.log("Error", err);
    } else{
        console.log(result);
    }
});

exports.appendData = fs.appendFileSync("./test.txt", `\n6. Sagar`);

// fs.appendFile("./test.txt", `\n7. Raj`);