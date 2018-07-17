var http = require("http");
var fs = require("fs");
var server = http.createServer();
var hello;
server.on('request', function(req, res) {
  var stream = fs.createReadStream('index.html');
  res.writeHead(200, {'Content-Type': 'text/html'});
  stream.pipe(res);
})

var io = require('socket.io').listen(server);
server.listen(8000);

io.sockets.on('connection', function(socket){
  socket.emit('greeting', {message: 'hello'}, function(data){
    console.log('result'+data);
  })
})
