const express = require("express");
const url = require("url");
const mysql = require("mysql");
const cors = require("cors");
const body_parser = require("body-parser");
const bluebird = require("bluebird");
const router = express.Router();
const app = express();
const db = mysql.createConnection({
  // host: "192.168.27.186",
  host: "192.168.27.186",
  user: "shan",
  password: "opcp2428",
  database: "pbook"
});
db.connect();
bluebird.promisifyAll(db);

//分類
router.post("/categoryBar", (req, res) => {
  const sql = "SELECT * FROM `vb_categories` WHERE 1";
  db.query(sql, (error, results) => {
    if (error) {
      return res.send(error);
    } else {
      return res.json({
        data: results
      });
    }
  });
});
//SELECT COUNT(1) FROM `vb_books` WHERE categories ${c}
//書本內容
router.get(`/?`, (req, res) => {
  let c, a, page;
  const urlpart = url.parse(req.url, true);
  if (urlpart.query.c !== undefined) {
    c = "=" + urlpart.query.c;
  } else {
    c = "";
  }

  if (urlpart.query.a == 1) {
    a = "publish_date";
  } else if (urlpart.query.a == 2) {
    a = "page";
  } else {
    a = "fixed_price";
  }
  page = urlpart.query.p || 1;
  let perPage = 10;
  let output = {};
  db.queryAsync(`SELECT COUNT(1) total FROM vb_books WHERE categories ${c}`)
    .then(results => {
      output.total = results[0].total;
      return db.queryAsync(
        `SELECT * FROM vb_books WHERE categories ${c} ORDER BY ${a} DESC LIMIT ${(page -
          1) *
          perPage},${perPage}`
      );
    })
    .then(results => {
      output.rows = results;
      res.json(output);
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
});

//書本單筆資料
router.get("/book_reviews/:sid?", (req, res) => {
  let sid = req.params.sid;
  const sql = `SELECT * FROM vb_books WHERE sid=${sid}`;
  db.query(sql, (error, results) => {
    if (error) {
      return res.send(error);
    } else {
      return res.json({
        data: results
      });
    }
  });
});

//書本各分類數量

module.exports = router;