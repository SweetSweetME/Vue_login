//express综合处理模块
const api = require('./api');
var http = require('http')

//操作文件，读写文件
const fs = require('fs');
const path = require('path');
//解析前端发送来的数据
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

var serveStatic = require('serve-static')

// 引入cookies模块
// const Cookies = require("cookies");


//创建 application/json 解析
app.all('*', function(req, res, next) { // 先后顺序一定要对！！！
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});
app.use(bodyParser.json());
// 创建 application/x-www-form-urlencoded 解析
app.use(bodyParser.urlencoded({extended: false}));
app.use(api);
//express.static 用来处理静态资源
console.log(__dirname);
app.use(express.static(path.resolve(__dirname, '../dist')));
// app.get('*', function (req, res) {
//   const html = fs.readFileSync(path.resolve(__dirname, '../dist/index.html'), 'utf-8');
//   res.send(html)
// });

// // cookies配置
// app.use((req, res, next) => {
//   // 向请求体对象中新加一个cookies属性，对应当前请求，相应
//   req.cookies = new Cookies(req, res);
//   // 给req对象增加一个用户信息的属性，以便所有路由都能读取
//   req.userInfo = {};
//   // 如果客户端中有cookie信息
//   if (req.cookies.get("userInfo")) {
//       // 将其解析后存入req.userInfo中
//       req.userInfo = JSON.parse(req.cookies.get("userInfo"))
//   }
//   // 继续下一个中间件
//   next();
// });

// app.use(serveStatic('public/ftp'))
app.use(express.static('../public'));

app.use((req,res) => {
  
})
app.listen(8080);

// http.createServer().listen(8080);
console.log('success listen......');