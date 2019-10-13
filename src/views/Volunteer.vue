<template>
  <div class="container">
    <div class="card round-card">
        <div class="columns">
            <div class="column">
                <h2 class="volunteerDetails">{{ volunteerDetails.volunteerName}} | {{volunteerDetails.instaId}} | {{volunteerDetails.assigned }}</h2>
            </div>
        </div>
    </div>
    <div class="card round-card">
        <div class="columns">
            <div class="column">
                <h2 class="heading">Switch Status</h2>
            </div>
            <div class="column">
                <label class="switch" @click = "changeStatus"><input type="checkbox" v-model="volunteerDetails.available" id="togBtn"><div class="slider round"><!--ADDED HTML --><span class="on">Available</span><span class="off">Unavailable</span><!--END--></div></label>
            </div>
        </div>
    </div>
    <div class="card round-card">
        <div class="columns">
            <div class="column">
                <h2 class="heading">Sessions</h2>
            </div>
            <div class="column">
                <label class="switch"><input type="checkbox" v-model="activeSessions" id="togBtn"><div class="slider round"><!--ADDED HTML --><span class="on">Active</span><span class="off">Past</span><!--END--></div></label>
            </div>
        </div>
        <div v-if="activeSessions" class="sessionContainer">
            <div v-for="session in allSessions" v-bind:key="session.client">
                 <div class="card columns is-mobile is-multiline" id="session" v-if="session.active">
                      <span class="column is-half">{{ session.client }}</span>
                      <span class="column is-full">{{ (new Date(session.startTime)).toDateString() }} | {{ (new Date(session.startTime)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }}</span>
                      <Button class="completeButton" @click.native = "sessionCompleted(session.sessionId)" text = "Completed"></Button>
                 </div>
            </div>
        </div>
        <div v-else class="sessionContainer">
            <div v-for="session in allSessions" v-bind:key="session.client">
                 <div class="card columns is-mobile is-multiline" id="session" v-if="!session.active">
                     <span class="column is-half">{{ session.client }}</span>
                     <span class="column is-half">{{ session.volunteer }}</span>
                     <span class="column is-half">{{ (new Date(session.startTime)).toDateString() }}</span>
                     <span class="column is-half">{{ (new Date(session.startTime)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }}</span>
                     <span class="column is-half">{{ (new Date(session.endTime)).toDateString() }}</span>
                     <span class="column is-half">{{ (new Date(session.endTime)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }}</span>
                 </div>
            </div>
        </div>
        
    </div>
    <div class="card round-card logoutButton" @click = "logout">
        <h2 class="heading">Logout</h2>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Button from '@/components/Button.vue'
import Menu from '@/components/Menu.vue'
import firebase from 'firebase'

import firebaseApp from '../firebaseConfig'
export default {
  name: 'volunteer',
  components: {
    Button,
    Menu
  },
  data : function(){
      return {
        allSessions:[],
        activeSessions:true,
        volunteerDetails :{
          available:true
        }
      }
  },
  methods:{
    logout(){
        firebaseApp.auth.signOut()
        .then(x=>{
            localStorage.removeItem('uid')
            this.$router.push('/login')
        })
    },
    changeStatus(){
      // console.log(this.active)
      // let available = !this.available
      firebaseApp.db.doc("users/" + localStorage.getItem('uid')).update({
        available: !this.volunteerDetails.available
      })
    },
    sessionCompleted(sessionId){
      console.log(sessionId)
      firebaseApp.db.doc("sessions/" + sessionId ).update({
        active:false,
        endTime:Date.now()
      })
      .then(x=>{
        firebaseApp.db.doc("users/" + localStorage.getItem('uid') ).update({
          'assigned':firebase.firestore.FieldValue.increment(-1)
        })
      })
    }
  },
  beforeMount(){
    let self = this
    setInterval(function(){ 
        self.accountCreationMessage = ""
        self.volunteerAssignMessage = ""
     }, 6000);
    let uid = localStorage.getItem('uid')
    if(uid == null){
      this.$router.push('/')
    }
    //Getting Volunteer
    firebaseApp.db.doc('users/'+uid).onSnapshot(user=>{
      this.volunteerDetails = user.data()
      //Getting Sessions
      firebaseApp.db.collection('sessions').where("volunteer","==",this.volunteerDetails.instaId).onSnapshot(allSessions=>{
          let session = {}
          this.allSessions = []
          for(let i=0;i<allSessions.docs.length;i++){
              session = allSessions.docs[i].data()
              this.allSessions.push(session)
          }
          this.allSessions.sort(
              function(a, b) {          
                  if (a.startTime === b.startTime) {
                      // Price is only important when cities are the same
                      return b.startTime - a.startTime;
                  }
                  return a.startTime > b.startTime ? 1 : -1;
              }
          );
          this.allSessions = this.allSessions.reverse()
      })
    })
  },
  
}
</script>
<style scoped>
.round-card {
    margin: 20px;
    padding: 30px;
    border-radius: 30px;
}
.heading{
    font-size: 150%;
}
#session {
    margin:0;
    text-align: left;
    padding: 5px;
}
.logoutButton{
    cursor: pointer;
    background:#ca2222;
    color:whitesmoke;
    padding: 10px !important;
}
.volunteerDetails{
  font-size: 150%;
}

.completeButton {
  margin: 10px auto 20px auto;
}


/* SWITCH STYLES */
.switch {
  position: relative;
  display: inline-block;
  width: 150px;
  height: 34px;
}

.switch input {display:none;}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ca2222;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2ab934;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(115px);
  -ms-transform: translateX(115px);
  transform: translateX(115px);
}

/*------ ADDED CSS ---------*/
.on
{
  display: none;
}

.on, .off
{
  color: white;
  position: absolute;
  transform: translate(-50%,-50%);
  top: 50%;
  left: 50%;
  font-size: 15px;
  
}

input:checked+ .slider .on
{display: block;}

input:checked + .slider .off
{display: none;}

/*--------- END --------*/

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;}
</style>
