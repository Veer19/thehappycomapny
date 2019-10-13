<template>
  <div class="container">
  </div>
</template>

<script>
// @ is an alias to /src
import firebaseApp from '../firebaseConfig'
export default {
  name: 'home',
  beforeMount(){
    let uid = localStorage.getItem('uid')
    console.log(uid)
    if(uid == null){
      this.$router.push('/login')
    }
    else {
      if(firebaseApp.auth.currentUser.email == "admin@gmail.com")
      this.$router.push('/admin')
      else
      this.$router.push('/volunteer')
    }
  },
  
}
</script>
