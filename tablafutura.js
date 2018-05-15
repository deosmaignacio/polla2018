var config = {
  apiKey: "AIzaSyDo5wHOoM32PLAe5Psf5gPOZOAI5G5bKvU",
  authDomain: "polla-45628.firebaseapp.com",
  databaseURL: "https://polla-45628.firebaseio.com",
  projectId: "polla-45628",
  storageBucket: "",
  messagingSenderId: "198637023867"
};
firebase.initializeApp(config);

function User(name, points){
  this.name = name;
  this.points = points;
}

function add_user(name, points){
  var user = new User(name, points);
  users.push(user);
}

var users = [];

var Nusers = 0;

var database = firebase.database();
function points(){
  var ref = database.ref().once('value', function(snap){
    Nusers = snap.numChildren();
    snap.forEach(userSnap => {
      var name = userSnap.key;
      var points_user = 0;
      var ref_name = database.ref().child(name).once('value', data =>{
        var games = database.ref().child(name).child("Games").once('value', function(snapGames){
          snapGames.forEach(GameSnap =>{
            var game = GameSnap.val();
            var home = game.home;
            var away = game.away;
            var home_score = game.home_score;
            var away_score = game.away_score;
            for(var i = 1; i < 49; i++){
              var home_team = document.getElementById("T"+i+"H").value;
              var home_goals = document.getElementById("R"+i+"H").value;
              var away_team = document.getElementById("T"+i+"A").value;
              var away_goals = document.getElementById("R"+i+"A").value;
              if((home_team == home) && (away_team == away) && (home_team != "vacio") && (away_team != "vacio")){
                points_user = calculate_pts(home_score, away_score, home_goals, away_goals) + points_user;
              }
            }
          })
          add_user(name, points_user);
          init();
        });
      });
    })
  });
}

function calculate_pts(home_guess, away_guess, home_score, away_score){
  var dg_real = home_score - away_score;
  var dg_pred = home_guess - away_guess
  var result = 0;
  if(dg_real * dg_pred >= 0){
    if((dg_real == 0) && (dg_pred == 0)){
      result+= 50;
      result+= 10;
    }
    else if ((dg_real > 0) && (dg_pred > 0)){
      result+= 50;
      if(dg_real == dg_pred){
        result += 10;
      }
    }
    if((home_score == home_guess) && (away_score == away_guess)){
      result+= 20;
    }
  }
  return result;
}


function init(){
  if(Nusers == users.length){
    users.sort(compare);
    var table = document.getElementById("positions");
    for(var i = 0; i < users.length; i++){
      var row = table.insertRow(1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = users.length-i;
      cell2.innerHTML = users[users.length-i-1].name;
      cell3.innerHTML = users[users.length-i-1].points;
    }
  }
}

function compare(x,y){
  if(x.points > y.points){
    return -1;
  }
  else{
    return 1;
  }
  return 0;
}