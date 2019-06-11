//express综合处理模块
const api = require('./api');
//操作文件，读写文件
const fs = require('fs');
const path = require('path');
//解析前端发送来的数据
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
//创建 application/json 解析
app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 解析
app.use(bodyParser.urlencoded({extended: false}));
app.use(api);
//express.static 用来处理静态资源
console.log(__dirname);
app.use(express.static(path.resolve(__dirname, '../dist')));

app.get('*', function (req, res) {
  const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
  res.send(html)
});
app.listen(8080);
console.log('success listen......');
