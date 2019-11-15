const express = require('express');
const mysql = require('mysql');
const bluebird = require('bluebird');
const brBookcase = express.Router();

const db = mysql.createConnection({
    host:'localhost',
    user:'Arwen',
    password:'4595',
    database:'pbook'
})
db.connect()
bluebird.promisifyAll(db)


const perPage = 9
brBookcase.get('/:page?/:keyword?', (req, res)=> {
    // 頁數資料傳輸
        const output = {};
        output.params = req.params
        output.perPage = perPage
        let page = req.params.page || 1

    // 欄位名稱`total` 取得總筆數
    let t_sql = 'SELECT COUNT(1) `total` FROM `br_reviewerlist`'
    db.queryAsync(t_sql)
        .then(results=>{
            // 拿第一筆[0]名稱total
            output.totalRows = results[0]['total']
            output.totalPage = Math.ceil(output.totalRows/perPage)
            // 判斷用戶頁數範圍
            if(page<1) page = 1
            if(page>output.totalPage) page = output.totalPage
            output.page = page

            return db.queryAsync('SELECT * FROM `br_reviewerlist` LIMIT '+(page-1)*perPage+','+(perPage))
        })
        .then(results=>{
            output.rows=results
            res.json(output)
        })
        .catch(error=>{
            res.send('404 沒有取得資料！');
            console.log(error);
        });
  });

module.exports = brBookcase;