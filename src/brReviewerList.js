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

const perPage = 10
brBookcase.get('/:page?/:keyword?',(req,res)=>{
    const output = {};
    output.params = req.params
    output.perPage = perPage
    let page = req.params.page || 1

    
    let sql = 'SELECT * FROM `br_reviewerlist` LIMIT '+(page-1)*perPage+','+(perPage)
    db.query(sql,(error,results)=>{

        output.rows = results

        res.json(output)
    })
})

module.exports = brBookcase;