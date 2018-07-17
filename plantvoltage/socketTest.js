var http = require("http");
var fs = require("fs");
var socketIO = require("socket.io");
var port = 8000;
var server = http.createServer();
server.on("request", function( request, response){

  request.render()
  var html = fs.readFileSync("./index.html", "utf-8");
  response.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
  response.end(html);
});

server.listen(port);
console.log("ポート番号", port, "待機中");

var io = socketIO.listen(server);
var step = 0;
var intervalID;
io.sockets.on( "connection", function(socket){
  if(intervalID) clearInterval(intervalID);
  intervalID = setInterval( function(){
    step++;
    io.sockets.emit("StoC", step);
  }, 1000);
  socket.on("disconnect", function() {
    console.log("切断");
  });
});
