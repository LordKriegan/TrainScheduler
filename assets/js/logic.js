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
  snapshot.forEach(function(childSnapshot) {
   //Here you can access  childSnapshot.key
   var key = childSnapshot.val();
   var ftt = moment(key.ftt, ["HH:mm"]);
   var nextArrival = moment()
   while (nextArrival.isBefore(ftt)) {
    nextArrival.add(key.freq, "m");
   } 

   var minAway = moment((nextArrival.toDate() - moment().toDate()), ["mm"]).minute();
   nextArrival = nextArrival.hour() + ":" + nextArrival.minute();
   $("#trainTable").append(`
      <tr>
        <td>${key.name}</td>
        <td>${key.dest}</td>
        <td>${key.freq}</td>
        <td>${nextArrival}</td>
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