const functions = require('firebase-functions');
var http = require('http');
var instagram = require('instagram-private-api')
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });









exports.sendTextVolunteer = functions.firestore
.document('sessions/{sessionId}')
.onCreate((snap, context) => {
    console.log("Function Called")
    const newValue = snap.data();
    
    const ig = new instagram.IgApiClient();
    ig.state.generateDevice('to.a.happier.world');
    return ig.account.login('to.a.happier.world', '____password_____')
    .then(user=>{
        console.log("Logged In")
        return ig.user.getIdByUsername(newValue.volunteer).then(userId=>{
            thread = ig.entity.directThread([userId.toString()]); 
            return thread.broadcastText("Hey! You've been assigned a new profile : @"+newValue.client)
        })
    }).catch(err=>{
        console.error(err);
    })
    .catch(err=>{
        console.log(err);
        ig.challenge.auto(true);
    });
    
});

exports.sendTextClient = functions.firestore
.document('sessions/{sessionId}')
.onCreate((snap, context) => {
    console.log("Function Called")
    const newValue = snap.data();    
    const ig = new instagram.IgApiClient();
    ig.state.generateDevice('to.a.happier.world');
    return ig.account.login('to.a.happier.world', '____password_____')
    .then(user=>{
        console.log("Logged In")
        return ig.user.getIdByUsername(newValue.client).then(userId=>{
            thread = ig.entity.directThread([userId.toString()]); 
            return thread.broadcastText("Hey! You've been assigned a volunteer : @"+newValue.volunteer)
        })
    }).catch(err=>{
        console.error(err);
    })
    .catch(err=>{
        console.log(err);
        ig.challenge.auto(true);
    });
    
});