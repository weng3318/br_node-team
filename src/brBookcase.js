const express = require('express');
const mysql = require('mysql');
const bluebird = require('bluebird');
const brReviewerList = express.Router();

const db = mysql.createConnection({
    host:'localhost',
    user:'Arwen',
    password:'4595',
    database:'pbook'
})
db.connect()
bluebird.promisifyAll(db)

brReviewerList.get('/:page?', (req, res)=> {
    
  
    db.queryAsync("SELECT COUNT(1) total FROM `br_reviewerlist`"
    )
        .then(results=>{
            return db.queryAsync("SELECT * FROM `br_reviewerlist` WHERE 1");
            // return db.queryAsync("SELECT * FROM `br_reviewerlist` LIMIT 0,5");
        })
        .then(results=>{
            // output.rows = results;
            // res.json(output);
            // 測試大專資料傳輸
            res.json(results);
            // console.log(res.json(results))
        })
        .catch(error=>{
            res.send('404 沒有取得資料！');
            console.log(error);
        });
  });

module.exports = brReviewerList;