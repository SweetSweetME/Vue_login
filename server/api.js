const models = require('./db');
const express = require('express');
const router = express.Router(); //这里用到了express的路由级中间件

const bcrypt = require('bcrypt')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { jwtSign, jwtCheck } = require('./jwt')
var ObjectId = require('mongodb').ObjectID;


// 指定文件上传路径
var upload = multer({dest: path.join(__dirname, './../public/upload/tmp')}); 

// 注册账户的接口
// /api为代理的服务
router.post('/api/user/register',(req, res) => {
  //这里的req.body其实使用了body-parser中间件 用来对前端发送来的数据进行解析
  //查询数据库中name = req.body.name的数据
  models.login.find({name: req.body.name}, (err, data) =>{
    if(err){
      res.send({'status': 1002, 'message': '查询失败', 'data': err});
    }else{
      console.log('查询成功' + data);
      //data为返回的数据库中的有相同name的集合
      if(data.length > 0){
        res.send({'status': 1001, 'message': '该用户名已经注册！'});
      }else{
        const hashPwd = bcrypt.hashSync(req.body.password, 10) // 使用bcrypt.hashSync方法生成密文密码
        let newName = new models.login({
          name:req.body.name,
          password: hashPwd
        });
        //newName.save 往数据库中插入数据
        newName.save((err, data) => {
          if(err){
            res.send({'status': 1002, 'message': '注册失败！', 'data': err});
          }else{
            res.send({'status': 1000, 'message': '注册成功！'});
          }
        });
      }
    }
  })
});
//登录接口
router.post('/api/user/login', (req, res) => {
  
    models.login.find({name: req.body.name},(err, data)=>{
      console.log('嘿嘿', data)
      if(data.length <= 0){
        res.send({'status': 1004, 'message': '用户未注册', 'data': []});
      }
      console.log(req.body.password ,data[0] )
      const isPwdValid = bcrypt.compareSync(req.body.password, data[0].password) // 使用bcrypt.compareSync方法验证密码
      if (isPwdValid) {
        if(err){
          res.send({'status': 1002, 'message': '登录失败', 'data': err});
        }else{
          const token = jwtSign({_id: data[0]._id}) // 用引入的jwtSign方法生成token并返回
          if(data.length>0){
            res.send({'status': 1000, 'message': '登录成功！', 'data': { token: token, _id: data[0]._id }});
          } else {
            res.send({'status': 1001, 'message': '登录失败，该用户没有注册！', 'data': err});
          }
        }
      } else {
        res.send({'status': 1003, 'message': '密码错误！', 'data': []});
      }
    });
  
    
});
//获取用户信息
router.post('/api/user_info', jwtCheck, (req,res)=>{
  //通过模型去查找数据库
  models.login.find({_id: req.body._id}, {name: 1, like_command: 1, not_like_command: 1, like_command_list: 1}, (err,data)=>{
    if(err){
      res.send(err);
    }else{
      res.send({'status': 200, 'message': '获取信息成功', 'data': data});
    }
  });
});
//获取所有账号的接口
router.get('/api/user/all', (req,res)=>{
  //通过模型去查找数据库
  models.login.find((err,data)=>{
    if(err){
      res.send(err);
    }else{
      res.send(data);
    }
  });
});
//删除账号接口
router.post('/api/user/delete', (req, res) => {
  //通过模型去查找数据库
  models.login.remove({name: req.body.name}, (err, data) => {
    if(err){
      res.send(err);
    }else{
      res.send({'status': 1003, 'message': '删除成功！', 'data': data});
    }
  });
});

//BMI 增加接口
router.post('/api/bmi/add_item',  (req, res) => {
    models.login.find({_id: req.body.user_id}, (err,data)=>{
      if (err) {
        res.send({'status': 1012, 'message': '用户信息不存在', 'data': err});
      } else {
        let newBmi = new models.bmi_list({
          height: req.body.height,
          weight: req.body.weight,
          bmi_value: req.body.bmi_value,
          cal_time: req.body.cal_time,
          user_id: req.body.user_id
        });
        //newBmi.save 往数据库中插入数据
        newBmi.save((err, data) => {
          if(err){
            res.send({'status': 1002, 'message': '添加失败！', 'data': err});
          }else{
            res.send({'status': 1000, 'message': '添加成功！'});
          }
        });
      }
  });
});

//BMI 获取列表接口
router.post('/api/bmi/get_items', jwtCheck,  (req, res) => {
  models.bmi_list.find({user_id: req.body.user_id}, (err, data)=>{
    if (err) {
      res.send({'status': 1012, 'message': 'BMI信息不存在', 'data': err});
    } else {
      res.send({'status': 1012, 'message': '查询成功', 'data': data});
    }
  });
});

//删除BMI接口
router.post('/api/bmi/delete', (req, res) => {
  //通过模型去查找数据库
  models.bmi_list.remove({_id: req.body._id}, (err, data) => {
    if(err){
      res.send({'status': 1003, 'message': '删除失败！', 'data': err});
    }else{
      res.send({'status': 1000, 'message': '删除成功！', 'data': data});
    }
  });
});

//获取command列表数据
router.get('/api/command_list', (req,res)=>{

  //通过模型去查找数据库
  models.command_list.find((err,data)=>{
    if(err){
      res.send(err);
    }else{
      res.send({code: '200', status: 'success', data: data});
    }
  });
  
});

// 上传图片接口
router.post('/api/base/singleFile', upload.single('file'), function (req, res, next) {
  if(req.body.fileLocation) {
    const newName = req.file.path.replace(/\\tmp/, '\\' + req.body.fileLocation) + path.parse(req.file.originalname).ext
    
    fs.rename(req.file.path, newName, err => {
      if (err) {
        res.send({ message: err.message })
      } else {
        let fileName = newName.split('\\').pop()
        res.send({ path: `${req.body.fileLocation}/${fileName}` })
      }
    })
  } else {
    res.send({ message: '未指定文件路径' })
  }
}) 

// 新增推荐列表接口
router.post('/api/command/add_item', function (req, res, next) {
  models.login.find({_id: req.body.user_id}, (err,data)=>{
    if (err) {
      res.send({'status': 1012, 'message': '用户信息不存在', 'data': err});
    } else {
      console.log(data)
      let newCommand = new models.command_list({
        user_id: req.body.user_id,
        title: data[0].name,
        img: 'http://localhost:8080/upload/' + req.body.img,
        description: req.body.description,
        content: req.body.content,
        creat_time: req.body.creat_time
      });
      //newBmi.save 往数据库中插入数据
      newCommand.save((err, data) => {
        if(err){
          res.send({'status': 1002, 'message': '添加失败！', 'data': err});
        }else{
          res.send({'status': 1000, 'message': '添加成功！', data: data});
        }
      });
    }
});
}) 

//获取command换一换的数据列表
router.get('/api/life_command', (req,res)=>{

  //通过模型去查找数据库
  models.life_command.find((err,data)=>{
    if(err){
      res.send(err);
    }else{
      res.send({code: '200', status: 'success', data: data});
    }
  });
  
});


//添加喜欢
router.post('/api/life_command/like', jwtCheck, (req,res)=>{
  let life_command = [];

  //通过模型去查找数据库
  models.login.find({_id: req.body.user_id}, (err,data)=>{
    if (err) {
      res.send({'status': 1004, 'message': '添加喜欢失败', 'data': err});
    } else {
      life_command = data[0].like_command || '';
      name = data[0].name;
      models.login.updateOne({name: name}, { $set: {"like_command": life_command + ',' + req.body.life_command_id || ''}}, (err,data)=>{
      if (err) {
        res.send({'status': 1003, 'message': '添加喜欢失败', 'data': err});
      } else {
          res.send({'status': 1000, 'message': '添加喜欢成功', data:data});
      }
      });
    }
  });
});

//取消喜欢
router.post('/api/life_command/cancle_like', jwtCheck, (req,res)=>{
  let life_command = [];

  //通过模型去查找数据库
  models.login.find({_id: req.body.user_id}, (err,data)=>{
    if (err) {
      res.send({'status': 1004, 'message': '取消喜欢失败', 'data': err});
    } else {
      life_command = data[0].like_command || '';
      const tempArr = life_command.split(',').filter(item => item !== req.body.life_command_id);
      const tempStr = tempArr.join(',')
      name = data[0].name;
      models.login.updateOne({name: name}, { $set: {"like_command": tempStr}}, (err,data)=>{
      if (err) {
        res.send({'status': 1003, 'message': '取消喜欢失败', 'data': err});
      } else {
          res.send({'status': 1000, 'message': '取消喜欢成功', data:data});
      }
      });
    }
  });
});

//添加收藏
router.post('/api/command_list/like', jwtCheck, (req,res)=>{
  let like_command_list = [];

  //通过模型去查找数据库
  models.login.find({_id: req.body.user_id}, (err,data)=>{
    if (err) {
      res.send({'status': 1004, 'message': '添加喜欢失败', 'data': err});
    } else {
      like_command_list = data[0].like_command_list || '';
      name = data[0].name;
      models.login.updateOne({name: name}, { $set: {"like_command_list": like_command_list + ',' + req.body.command_list_id || ''}}, (err,data)=>{
      if (err) {
        res.send({'status': 1003, 'message': '添加喜欢失败', 'data': err});
      } else {
          res.send({'status': 1000, 'message': '添加喜欢成功', data:data});
      }
      });
    }
  });
});

//取消收藏
router.post('/api/command_list/cancle_like', jwtCheck, (req,res)=>{
  let like_command_list = [];

  //通过模型去查找数据库
  models.login.find({_id: req.body.user_id}, (err,data)=>{
    if (err) {
      res.send({'status': 1004, 'message': '取消喜欢失败', 'data': err});
    } else {
      like_command_list = data[0].like_command_list || '';
      const tempArr = like_command_list.split(',').filter(item => item !== req.body.command_list_id);
      const tempStr = tempArr.join(',')
      name = data[0].name;
      models.login.updateOne({name: name}, { $set: {"like_command_list": tempStr}}, (err,data)=>{
      if (err) {
        res.send({'status': 1003, 'message': '取消喜欢失败', 'data': err});
      } else {
          res.send({'status': 1000, 'message': '取消喜欢成功', data:data});
      }
      });
    }
  });
});

//获取我的喜欢的command列表数据
router.get('/api/like_command_list', (req,res)=>{

  //通过模型去查找数据库
  models.command_list.find({user_id: req.query.user_id}, (err,data)=>{
    if(err){
      res.send(err);
    }else{
      res.send({code: '200', status: 'success', data: data});
    }
  });
  
});

//获取我的喜欢的command列表数据
router.post('/api/like_command_list_2', (req,res)=>{
  //通过模型去查找数据库
  const arr = req.body.arr.filter((item) => {
    return item !== '';
  })
  models.command_list.find({'_id': {$in:arr}}, (err,data)=>{
    if(err){
      res.send(err);
    }else{
      res.send({code: '200', status: 'success', data: data});
    }
  });
  
});
//获取我的喜欢的command列表数据
router.post('/api/delete/my_command', (req,res)=>{

  //通过模型去查找数据库
  models.command_list.remove({_id: req.body._id}, (err, data) => {
    if(err){
      res.send(err);
    }else{
      res.send({'status': 1003, 'message': '删除成功！', 'data': data});
    }
  });
  
});

// //获取收藏列表
// router.post('/api/delete/my_command', (req,res)=>{

//   //通过模型去查找数据库
//   models.life_command.find({_id: req.body._id}, (err, data) => {
//     if(err){
//       res.send(err);
//     }else{
//       res.send({'status': 1003, 'message': '删除成功！', 'data': data});
//     }
//   });
  
// });



module.exports = router;