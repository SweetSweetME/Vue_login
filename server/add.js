const models = require('./db');

let newName = new models.command_list({
    img: './command/doujao.jpeg',
    title: '小可爱的厨房',
    description: '小炒肉',
    content: '肉切片，加入盐，酱油，料酒，蒜末和生姜，腌半小时到一小时，姜蒜炒香，然后炒肉，最后加入尖椒~'
});
//newName.save 往数据库中插入数据
newName.save((err, data) => {
    if(err){
        console.log('数据添加成功')
    }else{
        console.log('数据添加失败')
    }
});
