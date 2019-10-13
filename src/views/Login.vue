<template>
<div class="container">
  <div class="logo"></div>
  <div class="columns">
    <div class="column">
      <input class="input" placeholder="Email" type="text" v-model="email"/><br>
      <input class="input" placeholder="Password" type="password" v-model="password"/>
      <br>
      <Button class="button" @click.native="login" text="Login"></Button>
      <br>
      <br>
      <div @click="passReset">Forgot Password</div>
      <br>
      <br>
      {{message}}
    </div>

  </div>
</div>

</template>
<script>
import Button from '@/components/Button.vue'
import firebase from 'firebase'
import firebaseApp from '../firebaseConfig'
export default {
  name: 'login',
  components: {
    Button
  },
  data : function(){
      return {
        email:'',
        password:'',
        message:''
      }
  },
  methods:{
    login(){
      firebaseApp.auth.signInWithEmailAndPassword(this.email,this.password)
      .then(userData=>{
        let user = userData.user
        let uid = user.uid
        localStorage.setItem('uid',uid)
        if(this.email == "admin"){
          this.$router.push('/admin')
        }
        else {
          this.$router.push('/')
        }
      })
      .catch(err=>{
        this.message = err.message
      })
    },
    passReset(){
      if(this.email == ""){
        this.message = "Please Enter Email Above"
      }
      firebaseApp.auth.sendPasswordResetEmail(this.email)
      .then(x=>{
        this.message = "Password Reset Email Sent"
      })
      .catch(err=>{
        this.message = err.message
      })
    }
  }
}

</script>
<style scoped>
.container{
  padding: 50px;
}
.input{
  padding: 5px;
  font-size: 140%;
  margin-bottom: 10px;
}
.logo {
  height: 300px;
  width: 300px;
  background: url('../assets/logo.jpg');
  background-size:contain;
  margin: 10px auto 50px auto;
}
</style>
