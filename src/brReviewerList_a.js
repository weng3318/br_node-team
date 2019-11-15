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

const perPage = 5
brReviewerList.get('/:page?/:keyword?',(req,res)=>{
    const output = {};
    output.params = req.params
    output.perPage = perPage
    let page = req.params.page || 1
    
    let sql = 'SELECT * FROM `br_reviewerlist` LIMIT '+(page-1)*perPage+','+(perPage)
    db.queryAsync(sql,(error,results)=>{

        output.rows = results

        res.json(output)
    })
})

module.exports = brReviewerList;