/*
 * Mongooseでデータを取り出して表示するテスト
 */
var mongoose = require('mongoose');

// スキーマ定義
var MemoSchema = new mongoose.Schema({
  title: String,
  body: String
});
// モデルとして登録
var Memo = mongoose.model('Memo', MemoSchema);

// mongodbに接続
mongoose.connect('mongodb://localhost:27017/monitor', // memoの部分はデータベース名
  // コールバックでエラー時の処理が書けるみたい。
  function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log('connection success!');
    }
  }
);

// findしてコンソールに出力
Memo.find({}, function(err, docs) {
  if(!err) {
    console.log("num of item => " + docs.length)
    for (var i = 0; i < docs.length; i++ ) {
      console.log(docs[i]);
    }
    mongoose.disconnect()  // mongodbへの接続を切断
    process.exit()         // node.js終了
  } else {
    console.log("find error")
  }
});
