var config = {
  apiKey: "AIzaSyDo5wHOoM32PLAe5Psf5gPOZOAI5G5bKvU",
  authDomain: "polla-45628.firebaseapp.com",
  databaseURL: "https://polla-45628.firebaseio.com",
  projectId: "polla-45628",
  storageBucket: "",
  messagingSenderId: "198637023867"
};
firebase.initializeApp(config);

var database = firebase.database();
var ref = database.ref("Local");
var ref_names = database.ref("Names");
ref.on('value', gotData, errData);

var Nusers = 0;
var names = [];
var pts = [];

function gotData(data){
  var nusers = data.val();
  var keys = Object.keys(nusers);
  Nusers = parseInt(nusers[keys[0]]);
  var nms = data.val();
  var keys = Object.keys(nms);
  // init();
}

console.log(database.ref().child('object'));

function getNames(data){
  var nms = data.val();
  var keys = Object.keys(nms);
  for(var i = 0; i < keys.length; i++){
    var k = keys[i];
    var val = nms[k].name;
    names.push(val);
    console.log(i);
    console.log(val, "end loop");
  }
}

function getPoints(data){
  for(i = 0; i < Nusers; i++){
    name.on('value', function(dta){
      var name = database.ref(val);
      var x = dta.val();
      var kys = Object.keys(x);
      point = x[kys[56]];
      pts.push(point);
    });
  }
  init(i);
}

function errData(err){
  console.log("Error");
  console.log(err);
}

function init(index){
  var table = document.getElementById("positions");
  var row = table.insertRow(1);
  var cell1 = row.insertCell(0);
  var cell2 = row.insertCell(1);
  var cell3 = row.insertCell(2);
  cell1.innerHTML = index;
  cell2.innerHTML = names[i];
  cell3.innerHTML = pts[i];
}
