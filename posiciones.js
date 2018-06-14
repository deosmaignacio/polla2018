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
console.log("enter");
function add_user(name, points){
  var user = new User(name, points);
  users.push(user);
}

function Match(homeTeam, awayTeam, homeScore, awayScore){
  this.homeTeam = homeTeam;
  this.awayTeam = awayTeam;
  this.homeScore = homeScore;
  this.awayScore = awayScore;
}

function addMatch(homeTeam, awayTeam, homeScore, awayScore){
  var match = new Match(homeTeam, awayTeam, homeScore, awayScore);
  matches.push(match);
}

function getMatch(homeTeam, awayTeam){
  for(var i = 0; i < matches.length; i++){
    var match = matches[i];
    var currHomeTeam = match.homeTeam;
    var currAwayTeam = match.awayTeam;
    if((currHomeTeam == homeTeam) && (currAwayTeam == awayTeam)){
      return match;
    }
  }
}

var users = [];
var matches = [];
groups = ["A", "B", "C", "D", "E", "F", "G", "H"];

var Nusers = 0;
var Ngames = games();

var database = firebase.database();
var ref = database.ref().once('value', function(snap){
  Nusers = snap.numChildren() - 2;
  snap.forEach(userSnap => {
    var name = userSnap.key;
    if(name == "Scores"){
      var ref_match = database.ref().child("Scores").once('value', function(snapMatch){
        Ngames_db = snapMatch.val().Ngames;
        points_db = snapMatch.val().points;
        snapMatch.forEach(matchSnap =>{
          var match = matchSnap.val();
          if(match != Ngames_db && match != points_db){
            var homeTeam = match.home;
            var awayTeam = match.away;
            var homeScore = match.home_score;
            var awayScore = match.away_score;
            addMatch(homeTeam, awayTeam, homeScore, awayScore);
          }
        })
      });
    }
    else if (name != "Codes"){
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

function init(){
  if(Nusers == users.length){
    init_scores();
    document.getElementById("espere").innerHTML=""
    users.sort(compare);
    var table = document.getElementById("positions");
    for(var i = 0; i < users.length; i++){
      var row = table.insertRow(1);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = users.length-i;
      cell2.innerHTML = users[users.length-i-1].name;
      cell2.setAttribute("class", "link_users");
      var place = users.length-i
      cell2.setAttribute("onclick","user_predictions("+place+")");
      cell3.innerHTML = users[users.length-i-1].points;
    }
  }
}

function init_scores(){
  for(var i = 1; i < 49; i++){
    var currHomeTeam = document.getElementById("T"+i+"H").innerHTML;
    var currAwayTeam = document.getElementById("T"+i+"A").innerHTML;
    var currHomeScore = document.getElementById("R"+i+"H").innerHTML;
    var currAwayScore = document.getElementById("R"+i+"A").innerHTML;
    if(currHomeScore.length == 0){
      currHomeScore = "vacio";
    }
    if(currAwayScore.length == 0){
      currAwayScore = "vacio";
    }
    var currMatch = getMatch(currHomeTeam, currAwayTeam);
    var dbHomeScore = currMatch.homeScore;
    var dbAwayScore = currMatch.awayScore;
    if((dbHomeScore != currHomeScore) && (dbAwayScore != currAwayScore)){
      document.getElementById("R"+i+"H").innerHTML = dbHomeScore;
      document.getElementById("R"+i+"A").innerHTML = dbAwayScore;
    }
  }

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
    var classified = database.ref().child(name).child("Clasificados").once('value', function(snapClassified){
      var classifiedTeam = snapClassified.val();
      document.getElementById("1ACL").innerHTML = classifiedTeam.ClasificadoA1;
      document.getElementById("2ACL").innerHTML = classifiedTeam.ClasificadoA2;
      document.getElementById("1BCL").innerHTML = classifiedTeam.ClasificadoB1;
      document.getElementById("2BCL").innerHTML = classifiedTeam.ClasificadoB2;
      document.getElementById("1CCL").innerHTML = classifiedTeam.ClasificadoC1;
      document.getElementById("2CCL").innerHTML = classifiedTeam.ClasificadoC2;
      document.getElementById("1DCL").innerHTML = classifiedTeam.ClasificadoD1;
      document.getElementById("2DCL").innerHTML = classifiedTeam.ClasificadoD2;
      document.getElementById("1ECL").innerHTML = classifiedTeam.ClasificadoE1;
      document.getElementById("2ECL").innerHTML = classifiedTeam.ClasificadoE2;
      document.getElementById("1FCL").innerHTML = classifiedTeam.ClasificadoF1;
      document.getElementById("2FCL").innerHTML = classifiedTeam.ClasificadoF2;
      document.getElementById("1GCL").innerHTML = classifiedTeam.ClasificadoG1;
      document.getElementById("2GCL").innerHTML = classifiedTeam.ClasificadoG2;
      document.getElementById("1HCL").innerHTML = classifiedTeam.ClasificadoH1;
      document.getElementById("2HCL").innerHTML = classifiedTeam.ClasificadoH2;

    //  document.getElementById("pred_campeon").innerHTML ="hola" ;
    //  document.getElementById("pred_mejor_arquero").innerHTML = ;
    //  document.getElementById("pred_mejor_jugador_joven").innerHTML = ;
    //  document.getElementById("pred_mejor_jugador").innerHTML = ;
    //  document.getElementById("pred_goleador").innerHTML = ;
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

function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}

deleteAllCookies();
