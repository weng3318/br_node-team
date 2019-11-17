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



module.exports = router;