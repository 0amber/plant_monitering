var http = require("http");
var port = 8080;

var server = http.createServer();
server.on( "request", function( request, response){
  response.writeHead(200, {'Content-type':'text/html;charset=utf-8'});
  response.write("ローカルサーバーの動作テスト");
  response.end();
});

server.listen( port );
console.log("ポート番号", port, "待機中");
