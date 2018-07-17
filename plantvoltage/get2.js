const app = require('express')();
const http = require('http').Server(app);
const PORT = process.env.PORT || 8000;

// ejsのレイアウトをoff
app.set('view options', { layout: false });
// getでリクエストがきたときの処理 ---- ★
app.get('/', function(req, res){
//  console.log(req.query); // for logging
  var name = "";
  // NAMEパラメタが空でなければ画面に表示
  res.render('get.ejs', {name: req.query.val});
  res.end();
});



http.listen(3000, "0.0.0.0");
http.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});
