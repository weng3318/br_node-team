const express = require("express");
// 模組化路由的傳遞導出
const router = express.Router();

router.route("/member/edit/:id")
  // 沒有定義方法，經路由進來的訪客在做判斷執行
  // 這裡面包的是middleware的格式!
  .all((req, res, next) => {
    // res.locals是關鍵物件，可以串流下去
    res.locals.會員表單 = {
      // #這裡要撈資料庫#
      姓名: "阿文",
      // #抓路徑上面的id用req.解析(id)
      會員編號: req.params.id
    };
    // 繼續下去()
    next();
  })
  // 上方有定義路由了，後面只需放參數不用路徑
  .get((req,res) => {
    res.send("GET:" + JSON.stringify(res.locals))
    // const obj = {
    //   baseUrl: req.baseUrl,
    //   url: req.url,
    //   data: res.locals.memberData
    // };
  })
  .post((req,res) => {
    res.send("POST:" + JSON.stringify(res.locals));
  });

module.exports = router;
