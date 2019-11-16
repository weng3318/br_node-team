const express = require('express');
const mysql = require('mysql');
const bluebird = require('bluebird');
const router = express.Router();

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'pbook'
})
db.connect()
bluebird.promisifyAll(db)


const perPage = 9
router.get('/:page?/:keyword?', (req, res)=> {
    // 頁數資料傳輸
        const output = {};
        output.params = req.params
        output.perPage = perPage
        let page = parseInt(req.params.page) || 1
        let keyword = req.params.keyword || ''
        let where = " WHERE 1 ";
        if(keyword){
            // 跳脫法排除單引號bug
           keyword = keyword.split("'").join("\\'")
           where += 'AND `name` LIKE "%'+ keyword +'%" '
            output.keyword = keyword
        }

    // 欄位名稱`total` 取得總筆數 ，加上 所有的名字 (#濫用跳脫法#)
    let t_sql = `SELECT COUNT(1) \`total\` FROM \`br_reviewerlist\`` + where
    console.log(t_sql)
    db.queryAsync(t_sql)
        .then(results=>{
            // 拿第一筆[0]名稱total
            output.totalRows = results[0]['total']
            // 算出總筆數
            // output.totalPage = Math.ceil(output.totalRows/perPage)
            // bug解法
            output.totalPage? Math.ceil(output.totalRows/perPage):1
            // if( output.totalPage == 0 ){
            //     return
            // }
            // 判斷用戶頁數範圍
            // 下限
            if(page<1) page = 1
            // 上限
            if(page>output.totalPage) page = output.totalPage
            output.page = page
            

            return db.queryAsync('SELECT * FROM `br_reviewerlist` '+ where +' LIMIT ?,?', [ (page-1) * perPage , perPage])
        })
        .then(results=>{
            output.rows=results
            res.json(output)
        })
        // .catch(error=>{
        //     res.send('404 沒有取得資料！');
        //     console.log(error);
        // });
  });

module.exports = router;