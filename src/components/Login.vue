<template>
  <div class="login">
    {{msg}}
    <div>
      用户名：
      <input type="text" v-model="name">
    </div>
    <div>
      密码：
      <input type="text" v-model="password">
    </div>
    <button @click="login">登录</button>
    <button @click="register">注册</button>
    <button @click="getAll">获得所有用户</button>
    <div v-show="showID">
      <p>用户id：{{nameId}}</p>
    </div>
    <div v-show="showAll">
      <p v-for="item in array">{{item.name}}的ID：{{item._id}}<button @click=deleteone(item.name)>删除该账号</button></p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'login',
    data(){
      return {
        msg: '登录注册',
        name: '',
        password: '',
        nameId: '',
        showID: false,
        array: [],
        showAll: false
      }
    },
    methods: {
      login(){
        this.showAll = false
        this.showID = false
        let params = {
          name: this.name,
          password: this.password
        }
        this.$http.post('/api/user/login', params).then((res)=>{
          console.log(res);
          if(res.data.status == 1000){
            this.showID = true
            this.nameId = res.data.data[0]._id
          }else{
            alert(res.data.message);
          }
        }).catch((arr)=>{
          console.log(err);
        })
      },
      register(){
        this.showAll = false;
        this.showID = false;
        let params = {
          name: this.name,
          password: this.password
        }
        this.$http.post('/api/user/register', params).then((res)=>{
          console.log(res);
          if(res.data.status == 1000){
            alert(res.data.message);
          }else{
            alert(res.data.message);
          }
        }).catch((err)=>{
          console.log(err)
        });
      },
      getAll(){
        this.$http.get('/api/user/all').then((res)=>{
          console.log(res);
          if(res.data.length > 0){
            this.showAll = true;
            this.array = res.data;
          }else{
            alert('无注册用户！');
          }
        }).catch((err)=>{
          console.log(err);
        })
      },
      deleteone(names){
        let params = {
          name: names
        }
        this.$http.post('/api/user/delete', params).then((res)=>{
          console.log(res);
          this.array = [];
        }).catch((err)=>{
          console.log(err);
        })
      }
    }
  }
</script>
<style>

</style>
