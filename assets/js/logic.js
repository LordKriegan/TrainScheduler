// Initialize Firebase
var config = {
  apiKey: "AIzaSyBAlNRW_CpZc9Ny3dTliDGPx9y9div9CBY",
  authDomain: "trainschedule-11fd2.firebaseapp.com",
  databaseURL: "https://trainschedule-11fd2.firebaseio.com",
  projectId: "trainschedule-11fd2",
  storageBucket: "",
  messagingSenderId: "756964373366"
};
firebase.initializeApp(config);
database = firebase.database();

database.ref("trains").on("value", function(snapshot) {
  $("#trainTable").empty();
  $("#trainTable").append(`
    <tr>
        <th>Train Name</th>
        <th>Destination</th>
        <th>Frequency (min)</th>
        <th>Next Arrival</th>
        <th>Minutes Away</th>
    </tr>
    `)
  var currTime = moment();
  snapshot.forEach(function(childSnapshot) {
   var key = childSnapshot.val();
   var ntt = moment(key.ftt, ["HH:mm"]);
 
   do {
    ntt.add(key.freq, "m");
   } while (ntt.isBefore(currTime));

   var minAway = String(Math.floor(((ntt.toDate() - currTime.toDate())/1000)/60));

   $("#trainTable").append(`
      <tr>
        <td>${key.name}</td>
        <td>${key.dest}</td>
        <td>${key.freq}</td>
        <td>${ntt.format("HH:mm")}</td>
        <td>${minAway}</td>
      </tr>
    `)
});

}, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
});

window.onload = function (){
  $("#submitBtn").on("click", function(event) {
    event.preventDefault();
    var tName = $("#name-input").val().trim();
    var tDest = $("#dest-input").val().trim();
    var tFtt = $("#ftt-input").val().trim();
    var tFreq = $("#freq-input").val().trim();
    if (tName === "") {
      console.error("Error: Invalid name");
      return;
    }
    if (tDest === "") {
      console.error("Error: Invalid destination");
      return;
    }
    if (/^([0-9]|[01]\d|2[0-3]):([0-5]\d)$/.test(tFtt) === false) {
      console.error("Error: Invalid time");
      return;
    }
    if (Number.isInteger(Number(tFreq)) === false) {
      console.error("Error: Invalid train frequency");
      return;
    }
    database.ref("trains").push({
      name: tName,
      dest: tDest,
      ftt: tFtt,
      freq: tFreq
    });
  });
}