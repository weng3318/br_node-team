// 引入express套件
const express = require("express");
// 建立web server物件
const app = express(); //本身是函式
// 取得POST資料 處理表單用
const bodyParser = require("body-parser");
// const urlencodedParser = bodyParser.urlencoded({extended:false})
// 改成這樣就不用middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
// 給予路由解析JSON的能力!
app.use(bodyParser.json());
// 上傳檔案的套件 multer
const multer = require("multer");
// 要設定暫存資料夾
const upload = multer({ dest: "tmp_upload/" });
// 搬移資料用，相當於拷貝
const fs = require("fs");

// 設定樣版引擎 EJS
app.set("view engine", "ejs");
// 靜態頁面，到此內容資料夾就不會進之後的路由，一般設定一個就好
app.use(express.static("public"));

// 建立路由 router，預設頁面初體驗
app.get("/", (req, res) => {
  // res.send('懶斯藍啪')

  // 串聯EJS頁面並呈現畫面，後者的變數可以設定多個對應值
  res.render("home", { name: "Arwen", a: 80 });
});

// 建立路由
app.get("/sales01", (req, res) => {
  const reviewer01 = require("../data/reviewer01.json");
  // res.send(JSON.stringify(reviewer01))
  // 這區塊都是在伺服器處理，之後將JSON丟給前端
  // res.json(reviewer_Data)

  // 將該路徑"檔案"要求進來變數
  res.render("sales01", {
    // 這裡的sales是字串串過去是變數，用作於EJS串聯資料，變數物件"鍵:值"
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












// 404設定頁面
app.use((req, res) => {
  res.type("text/plain");
  res.status(404);
  res.send(`404 找不到頁面`);
});

// server偵聽
app.listen(5000, function() {
  console.log("啟動server 偵聽埠號5000");
});
