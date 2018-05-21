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
var Ngames = games();

var database = firebase.database();
var ref = database.ref().once('value', function(snap){
  Nusers = snap.numChildren() - 1;
  snap.forEach(userSnap => {
    var name = userSnap.key;
    if(name != "Codes"){
      var points_user = 0;
      var ref_name = database.ref().child(name).once('value', data =>{
        var games = database.ref().child(name).child("Games").once('value', function(snapGames){
          snapGames.forEach(GameSnap =>{
            var game = GameSnap.val();
            var home = game.home;
            var away = game.away;
            var home_score = game.home_score;
            var away_score = game.away_score;
            for(var i = 1; i < Ngames + 1; i++){
              var home_team = document.getElementById("T"+i+"H").innerHTML;
              var home_goals = document.getElementById("R"+i+"H").innerHTML;
              var away_team = document.getElementById("T"+i+"A").innerHTML;
              var away_goals = document.getElementById("R"+i+"A").innerHTML;
              if((home_team == home) && (away_team == away)){
                points_user = calculate_pts(home_score, away_score, home_goals, away_goals) + points_user;
              }
            }
          })
          database.ref().child(name).update({points: points_user});
          add_user(name, points_user);
          init();
        });
      });
  }
  })
});

function games(){
  var result = 0;
  for(var i = 1; i < 65; i++){
    var home_goals = document.getElementById("R"+i+"H").innerHTML;
    var away_goals = document.getElementById("R"+i+"A").innerHTML;
    if((home_goals.length > 0) && (away_goals.length > 0)){
      result++;
    }
    else{
      return result;
    }
  }
}

function calculate_pts(home_guess, away_guess, home_score, away_score){
  var dg_real = home_score - away_score;
  var dg_pred = home_guess - away_guess
  var result = 0;

  if((home_score == home_guess) && (away_score == away_guess)){
    result=80;
    }
    else if (dg_real == dg_pred){
      result=60;
      }
      else if(dg_real * dg_pred > 0){
        result= 50;
        }
        else{
          result=0;
          }

  return result;
}

init();

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
      // cell2.setAttribute("class", "link_users");
      var place = users.length-i
      // cell2.setAttribute("onclick","user_predictions("+place+")");
      cell3.innerHTML = users[users.length-i-1].points;
    }
  }
  document.getElementById("espere").innerHTML=""
}

function user_predictions(place){
  var place = parseInt(place);
  var name = document.getElementById("positions").rows[place].cells[1].innerHTML;
  document.getElementById("1f_header").innerHTML = "Predicciones: "+name;
  var name_ref = database.ref().child(name).once('value', function(snap){
    var games = database.ref().child(name).child("Games").once('value', function(snapGames){
      snapGames.forEach(GameSnap =>{
        var game = GameSnap.val();
        var home = game.home;
        var away = game.away;
        var home_score = game.home_score;
        var away_score = game.away_score;
        for(var i = 1; i < 49; i++){
          var home_team = document.getElementById("T"+i+"H").innerHTML;
          var away_team = document.getElementById("T"+i+"A").innerHTML;
          if((home_team == home) && (away_team == away)){
            document.getElementById("R"+i+"H").innerHTML = home_score;
            document.getElementById("R"+i+"A").innerHTML = away_score
          }
        }
      })
    });
  });
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
