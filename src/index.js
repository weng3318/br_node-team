// 引入express套件
const express = require("express");
// 建立web server物件
const app = express(); //本身是函式
// 取得POST資料 處理表單用
const bodyParser = require("body-parser");
// 上傳檔案的套件 multer
const multer = require("multer");
// 要設定暫存資料夾
const upload = multer({ dest: "tmp_upload/" });
// 搬移資料用，相當於拷貝
const fs = require("fs");
// 存取暫存記憶的套件，刷新頁面會需要用到
const session = require('express-session')
// #mysql套件安裝，準備連線環境#
const mysql = require('mysql')
// 家裡用的資料庫
const bluebird = require('bluebird');
const db = mysql.createConnection({
  host:'localhost',
  user:'Arwen',
  password:'4595',
  database:'pbook'
})
// ruby的資料庫
// const db = mysql.createConnection({
  //   host: "192.168.27.186",
  //   user: "root",
  //   password: "root",
  //   database: "pbook"
  // })
  // 跨網域套件
  const cors = require('cors')
  
  // 連線
  db.connect()
  // const urlencodedParser = bodyParser.urlencoded({extended:false})
  // 改成這樣就不用middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  // parse application/json
  // 給予路由解析JSON的能力!
  app.use(bodyParser.json());
  
  bluebird.promisifyAll(db)
  // 先cd至目標資料夾並啟動http-server 8080預設
  // cors作用：會獲得一個middleware，cors會當作function呼叫
  // 目的是偽裝成客戶!這可以跨網域伺服取用資料，此範例無須 cookie 跟 session
  app.use(cors())
  
  // 更改為白名單，undefined必須
  const whitelist = ['http://localhost:5000','http://localhost:8080','http://localhost:3000']
  const corsOptions = {
    credentials:true,
    origin:function (origin,callback){
      console.log('origin' + origin)
      // 不加undefined要加 !origin
      if(whitelist.indexOf(origin) !==-1 || !origin){
        // 允許
        callback(null,true)}
        else {
          // 直接報錯會導致伺服器停下
          // callback(new Error ('not allowed by CORS'))
          // 不允許報錯
          callback(null,false)
        }
      }
    }
    app.use(cors(corsOptions))

  // 靜態頁面，到此內容資料夾就不會進之後的路由，一般設定一個就好
  app.use(express.static("public"));
  // 
  app.use(session({
  // 前兩項非必要條件
  // ↓設定false，表示client端沒用到session就不會有暫存作用
  saveUninitialized:false,
  // 沒變更內容是否強制回存
  resave:false,
  // 必要條件兩項，1.加解密設定、2.存活時間20分鐘(120萬毫秒)
  secret:'fsdfsdf',
  cookie:{
    maxAge:1200000,
  }
}))
// 設定樣版引擎 EJS
app.set("view engine", "ejs");


// 建立路由 router，預設頁面初體驗
app.get("/", (req, res) => {
  // res.send('懶斯藍啪')
  // 串聯EJS頁面並呈現畫面，後者的變數可以設定多個對應值
  res.render("home", { name: "Arwen", a: 80 });
});
// 這是假的動態網站，可定義路由
// 路由是個字串，一律從根目錄開始
app.get('/b', (req, res) => {
  res.send(`<h1>這是假的動態網站!</h1>`)
});
// 建立路由，解析json並丟去前端樣版呈現
app.get("/sales01", (req, res) => {
  const reviewer01 = require("../data/reviewer01.json");
  // res.send(JSON.stringify(reviewer01))
  // 這區塊都是在伺服器處理，之後將JSON丟給前端
  // res.json(reviewer_Data)

  // 將該路徑"檔案"要求進來變數
  res.render("sales01", {
    // 這裡的sales是字串串過去是變數，
    // 變數物件"鍵:值"，用於前端樣版EJS串聯資料
    sales: reviewer01
  });
});

// 建立指定的路由路徑(第二個參數)，把urlencodedParser 當 middleware
app.get("/body_form", (req, res) => {
  // res.render('body_form',{email:'',password:''})
  res.render("body_form");
});
app.post("/body_form", (req, res) => {
  res.render("body_form", req.body);
  // res.send(JSON.stringify(req.body))
});

// 123在台灣
app.get("/body_form/123", (req, res) => {
  res.render("body_form");
});

// body_form2回音
app.get("/body_form2", (req, res) => {
  res.send("get:body_form2");
});
app.post("/body_form2", (req, res) => {
  res.json(req.body);
});
app.put("/body_form2", (req, res) => {
  res.send("put:body_form2");
});

// 上傳檔案範例 設定middleware → upload.single('avatar')
// 單一個檔案用single('前端給這欄位，後端接受欄位')，查看的話用file不用加s
app.post("/try_upload", upload.single("avatar"), (req, res) => {
  if (req.file && req.file.originalname) {
    console.log(req.file);
    switch (req.file.mimetype) {
      case "image/png":
      case "image/jpeg":
        // 讀取上傳檔案的名字、連同路徑的來源
        fs.createReadStream(req.file.path).pipe(
          // 拷貝檔案至 指定位置
          fs.createWriteStream("public/img/" + req.file.originalname)
        );
        res.send("ok");
        break;
      default:
        return res.send("bad file type");
    }
  } else {
    res.send("no upload！");
  }
});
// 錄製_2019_09_25_09_09_15_44.mp4
// node比較少用get參數，取而代之，以此方法使用更強，原因是
// "SEO"路徑的強度會比參數還要強
app.get("/my_params/*?/*?",(req,res)=>{
  res.json(req.params)
  console.log('路徑會比參數強'+req.params)
  res.send('路徑設定')
})

// 使用regular_expression設定路由
app.get(/^\/09\d{2}\-?\d{3}-?\d{3}$/,(req,res)=>{
  // 取得資料的順序再進行切割，才會正確去除與獲得指定數字
  let str = req.url.slice(1)
  // slice(1)為跳脫數字表達式自然產出的/
  // str = str.slice(1,13)
  str = str.split('?')[0]
  // 刪除掉不必顯示出來的字元('-')
  str = str.split('-').join('')
  res.send('<h1>手機號碼'+str)
})

// todo..
// app.router，all.
// 路由模組化方式一，當成函式呼叫
const admin1 = require(__dirname + '/admins/admin1');
admin1(app);
// admin(app)
// 方式二跟三較為推薦，以middleware呼叫
app.use( require(__dirname + '/admins/admin2') );
app.use('/admin3', require(__dirname + '/admins/admin3'));
app.use('/brBookcase', require(__dirname + '/brBookcase'));
app.use('/brReviewerList', require(__dirname + '/brReviewerList'));

// 資料庫連線，使用sql語法，middleware要注意的是
// #必須跟res.render的名稱一致，但不需要/，否則會找不到頁面
app.get('/try_db',(req,res)=>{
  // LIMIT依數量倒出資料
  const sql = "SELECT * FROM `vb_books` LIMIT 50,5"
  // db.query(sql,(error,results,fields)=>{
    // 搜尋用的語法
    // const sql = "SELECT * FROM `vb_books` WHERE `name` LIKE ? "
    // node的抓取結果就是固定的fetchAll一次弄出來，不用分fetch或fetchAll
    // 以下為callback函式，資料需要等待才能獲得
    db.query(sql,['%日本%'],(error,results,fields)=>{
      // 報錯，原則上需要錯誤處理，可用if判斷有無error
      console.log(error)
    // 資料顯示
    console.log(results)
    // 欄位訊息
    console.log(fields)
    // 自動告知前端JSON格式，write、end、render
    // res.json(results)
    res.render('try_db', {
      數量: results
        });
  })
  // res.send('放這裡會有問題')
})

app.get('/try_db2/:page?', (req, res)=> {
  let page = req.params.page || 1;
  let perPage = 5;
  const output = {};

  db.queryAsync("SELECT COUNT(1) total FROM `vb_books`")
      .then(results=>{
          //res.json(results);
          output.總筆數 = results[0].total;
          return db.queryAsync(`SELECT * FROM vb_books LIMIT ${(page-1)*perPage}, ${perPage}`);
      })
      .then(results=>{
          // output.rows = results;
          // res.json(output);
          // 測試大專資料傳輸
          res.json(results);
      })
      .catch(error=>{
          console.log(error);
          res.send(error);
      });
});
// todo..先用
app.get('/session1', (req, res)=>{
  req.session.my_views = req.session.my_views || 0;
  req.session.my_views++;

  res.json({
      aa: 'hello',
      'my views': req.session.my_views
  });
});
// 造訪次數，這邊可以注意，使用post拿不到值
app.get('/session2',(req,res)=>{
  req.session.views = req.session.views||1
  req.session.views++
  res.json({
    qq: 'hi',
    views:req.session.views})
})

// 404設定頁面
app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  // send 輸出單純的HTML
  res.send(`404 找不到頁面`);
});

// server偵聽
app.listen(5000, function() {
  console.log("啟動server 偵聽埠號5000");
});
