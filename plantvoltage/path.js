var fs = require("fs");
var path = require("path");
 
var filepath = "./data/message.txt";
 
var dirname = path.dirname(filepath);
 
fs.access(dirname, fs.constants.R_OK | fs.constants.W_OK, (error) => {
  if (error) {
    if (error.code === "ENOENT") {
      fs.mkdirSync(dirname);
    } else {
      return;
    }
  }
 
  fs.writeFile(filepath, "Hello World !", "utf8", (error) => { });
});
