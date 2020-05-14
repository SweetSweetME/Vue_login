// const mongoose = require('mongoose');
const mongoose = require('mongoose');
//连接我的数据库
// mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/login",{useNewUrlParser: true});
//绑定事件
const db = mongoose.connection;
db.on('error',(error)=>{
  console.log('Mongo connection error ' + error);
});
db.on('open',()=>{
  console.log('Mongo connection successed');
});

//1.Schema 数据库集合的模型骨架，或者是数据属性模型传统意义的结构
const loginSchema = mongoose.Schema({
  name: String,
  password:String,
  img_url: String,
  like_command: String,
  not_like_command: String,
});

const commandListSchema = mongoose.Schema({
  user_id: String,
  img: String,
  title: String,
  description: String,
  content: String,
  creat_time: String
});

const BMIListSchema = mongoose.Schema({
  height: String,
  weight: String,
  bmi_value: String,
  cal_time: String,
  user_id: String
});

const LifeCommandSchema = mongoose.Schema({
  content: String
});

//2.Model 通过Schema构造而成
//建立users表
const Models = {
  login : mongoose.model('users', loginSchema),
  command_list: mongoose.model('command_list', commandListSchema),
  bmi_list: mongoose.model('bmi_list', BMIListSchema),
  life_command: mongoose.model('life_command', LifeCommandSchema),
};

module.exports = Models;
