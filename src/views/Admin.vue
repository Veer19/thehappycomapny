<template>
  <div class="container">
    <!-- <Menu type="admin"></Menu> -->
    <div class="card round-card">
        <div class="columns">
            <div class="column">
                <h2 class="heading">Assign Volunteers</h2>
            </div>
            <div class="column">
                <label class="switch"><input type="checkbox" v-model="assignMode" id="togBtn"><div class="slider round"><!--ADDED HTML --><span class="on">Manual</span><span class="off">Auto</span><!--END--></div></label>
            </div>
        </div>
        
        <input class="input" placeholder="User Insta ID" type="text" v-model="insta"/>
        <br><br>
        
        <div class="select" v-if="assignMode">
            <select v-model="manualVolunteerAssign">
                <option v-for="user in allUsers" v-bind:key="user.uid" :value="user">{{ user.volunteerName }} | {{ user.assigned }}</option>
            </select>
        </div>
        <Button class="button" @click.native="assignVolunteer" text="Assign"></Button>
        <br>
        <br>
        {{volunteerAssignMessage}}
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
            <div v-for="session in allSessions" v-bind:key="session.startTime">
                 <div class="card columns is-mobile is-multiline" id="session" v-if="session.active">
                     <span class="column is-half">{{ session.client }}</span>
                     <span class="column is-half">{{ session.volunteer }}</span>
                     <span class="column is-half">{{ (new Date(session.startTime)).toDateString() }}</span>
                     <span class="column is-half">{{ (new Date(session.startTime)).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }) }}</span>
                 </div>
            </div>
        </div>
        <div v-else class="sessionContainer">
            <div v-for="session in allSessions" v-bind:key="session.startTime">
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
    <div class="card round-card">
        <h2 class="heading">Create Accounts</h2>
        <br>
        <br>
        <input class="input" placeholder="Name" type="text" v-model="account.volunteerName"/>
        <input class="input" placeholder="Insta ID" type="text" v-model="account.instaId"/>
        <input class="input" placeholder="Email" type="text" v-model="account.email"/>
        <br><br>
        <Button class="button" @click.native="createAccount" text="Create Account"></Button>
        <br><br>
        {{accountCreationMessage}}
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
  name: 'home',
  components: {
    Button,
    Menu
  },
  data : function(){
      return {
        insta:'',
        allUsers:[],
        allSessions:[],
        assignMode:false,
        manualVolunteerAssign:{},
        volunteerId:'',
        volunteerInsta:'',
        account : {
            instaId:'',
            volunteerName: '',
            email:''
        },
        volunteerAssignMessage : "",
        accountCreationMessage :"",
        volunteersBusy:false,
        activeSessions:true
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
    assignVolunteer(){
      if(this.insta == ''){
        this.volunteerAssignMessage = "Please Enter Instagram ID"
        return
      }
      this.insta = this.insta.split("instagram.com/")[1].split("?")[0]
      if(this.assignMode){
        // var x = this.manualVolunteerAssign.trim().split("|")
        this.volunteerId = this.manualVolunteerAssign.uid
        this.volunteerInsta = this.manualVolunteerAssign.instaId
        console.log(this.volunteerId)
        firebaseApp.db.collection('sessions').add({
            'volunteer': this.volunteerInsta,
            'client' : this.insta,
            'active' : true,
            'startTime': Date.now()
        })
        .then(session=>{
            firebaseApp.db.doc('sessions/'+ session.id).update({
                'sessionId':session.id
            })  
        })
        .then(x=>{
            firebaseApp.db.doc("users/" + this.volunteerId).update({
                'assigned':firebase.firestore.FieldValue.increment(1)
            }).then(x=>{
                this.volunteerAssignMessage = this.volunteerInsta + " Assigned"
            })
        })
        return
      }
      console.log("STUFF")
      firebaseApp.db.collection('users').get()
      .then(allUsers => {
        let user = {}
        let count =0;
        for(let i=0;i<allUsers.docs.length ; i++){
          user = allUsers.docs[i].data()
        
          console.log(user)
          if(user.volunteer && user.available && user.assigned<1) { 
            this.volunteerId = user.uid
            this.volunteerInsta = user.instaId
            return firebaseApp.db.collection('sessions').add({
              'volunteer': this.volunteerInsta,
              'client' : this.insta,
              'active' : true,
              'startTime': Date.now()
            }).then(session=>{
                firebaseApp.db.doc('sessions/'+ session.id).update({
                    'sessionId':session.id
                })  
            })
          }
        }
        this.volunteersBusy = true
      })
      .then(x=>{
        if(this.volunteersBusy){
            this.volunteerAssignMessage = "All Volunteers Busy"
        }
        else {
            console.log("Reached")
            firebaseApp.db.doc("users/" + this.volunteerId).update({
                'assigned':firebase.firestore.FieldValue.increment(1)
            }).then(x=>{
                this.volunteerAssignMessage = this.volunteerInsta + " Assigned"
            })
        }
      })
    },
    createAccount(){
        firebaseApp.auth.createUserWithEmailAndPassword(this.account.email, 'password1234')
        .then(snapshot=>{
            firebaseApp.db.doc("users/"+snapshot.user.uid).set({
                volunteerName:this.account.volunteerName,
                instaId:this.account.instaId,
                available:true,
                admin:false,
                volunteer:true,
                assigned:0,
                uid:snapshot.user.uid,
                email:snapshot.user.email,
            }).then(x=>{
                this.accountCreationMessage = "User Created"
                this.account = {}
            })
            
        }).catch(err=>{
            this.accountCreationMessage = err.message
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
    if(firebaseApp.auth.currentUser.email != "admin@gmail.com")
        this.$router.push('/volunteer')
    //Getting Volunteer
    firebaseApp.db.collection('users').onSnapshot(allUsers=>{
        let user = {}
        this.allUsers = []
        for(let i=0;i<allUsers.docs.length;i++){
            user = allUsers.docs[i].data()
            if(user.available)
            this.allUsers.push(user)
        }
    })
    //Getting Sessions
    firebaseApp.db.collection('sessions').onSnapshot(allSessions=>{
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
