var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);
server.listen(8000);
var mongoose = require('mongoose');
var fs = require("fs");
const path  = require('path')
const iconv = require('iconv-lite')
var cons = require('consolidate');
const PORT = process.env.PORT || 8000;

//use static file
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/view'));

//use html as template
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// allow CORS not yet conpleated
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", 'http://localhost:8000');
  res.header("Access-Control-Allow-Credentials", true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json,Authorization');
next();
});

//DB setup
var Schema   = mongoose.Schema;
var MonitorSchema = new Schema({
  volt:Number,
  moisture:Number,
  temperature:Number,
  illuminance:Number,
  time:Number
});
mongoose.model('Monitor', MonitorSchema);
mongoose.connect('mongodb://localhost:27017/monitor',{ useNewUrlParser: true });

//send data to other browsers
io.on('connection', (socket) => {
  socket.on('received', (msg) => {
    socket.broadcast.emit("moniterVal", msg);
    io.sockets.emit("moniterVal", msg);
  });
});

//RealtimeMonitor page
app.get(`/`, (req, res) => {

  // request parameter from arduino
  moisture = req.query.val;
  volt = req.query.volt;
  temperature = req.query.temperature;
  illuminance = req.query.illuminance;
  const now = new Date();
  var moniterVal = { moisture:moisture, volt:volt, temperature:temperature, illuminance:illuminance};
  console.log('moisture set to '+moisture + ' volt set to '+ volt + ' temperature set to '+ temperature + ' illuminance set to '+ illuminance);

  //send to realtime monitior
  io.sockets.emit("moniterValPre", moniterVal);

  //push data to MongoDB
/*  var Monitor = mongoose.model('Monitor');
  var monitor = new Monitor();
  monitor.volt = volt;
  monitor.moisture = moisture;
  monitor.temperature = temperature;
  monitor.illuminance = illuminance;
  monitor.time = now;
  monitor.save(function(err) {
    if (err) { console.log(err); } else {
  //    console.log('save success!');
    }
  });
*/
  //render to html
  var html = fs.readFileSync("./index4.html", "utf-8");
  res.writeHead(200, {"Content-Type":"text/html;charset=utf-8"});
  res.end(html);
});

//Plot Analys page
app.get(`/plot`, (req, res) => {
  var Monitor = mongoose.model('Monitor');
//  var monitor = new Monitor();
  Monitor.find({},{lomit:10000}, function(err, monitorData){
    //render to html
    var volts = [];
    var moistures = [];
    var temperatures = [];
    var illuminances =[];
    var times = [];
    for (var i = 0; i < monitorData.length; i++) {
      var volt = monitorData[i].volt;
      var moisture = monitorData[i].moisture;
      var temperature = monitorData[i].temperature;
      var illuminance = monitorData[i].illuminance;
      var time = monitorData[i].time;
      volts.push(volt);
      moistures.push(moisture);
      temperatures.push(temperature);
      illuminances.push(illuminance);
      times.push(time);
    }
    res.render('plot', {volts:volts, moistures:moistures, temperatures:temperatures, illuminances:illuminances, times:times});
  });

});
