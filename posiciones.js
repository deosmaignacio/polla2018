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

function getMatch2F(homeTeam, awayTeam){
  for(var j = 0; j < matches2F.length; j++){
    var match = matches2F[j];
    var currHomeTeam = match.homeTeam;
    var currAwayTeam = match.awayTeam;
    if((currHomeTeam == homeTeam) && (currAwayTeam == awayTeam)){
      return match;
    }
  }
}

var database = firebase.database();

var users = [];
var matches = [];
var matches2F = [];
groups = ["A", "B", "C", "D", "E", "F", "G", "H"];

var Nusers = 0;
var Ngames;
var numberOfEntries = 14; // cambiar a 14 cuando se hayan metido campeon2f y tercero

var stopper = false;

function general(NumberOfGames){
  Ngames = NumberOfGames;
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
          if(matches.length == 48){
            init_scores();
          }
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
}

function general2F(){
  var NgamesTemp = 65;
  var ref = database.ref().once('value', function(snap){
    snap.forEach(userSnap => {
      if(Object.keys(userSnap.val()).length > numberOfEntries && Object.keys(userSnap.val()).length < 100){
        var dataRaw = userSnap.val();
        var names = Object.keys(dataRaw);
        for(var j = 0; j < names.length; j++){
          var data = dataRaw[names[j]];
          var homeTeam = data.home;
          var awayTeam = data.away;
          var homeScore = data.home_score;
          var awayScore = data.away_score;
          addMatch(homeTeam, awayTeam, homeScore, awayScore);
        }
      }
      else if(Object.keys(userSnap.val()).length == numberOfEntries){
        var data = userSnap.val();
        var name = data.name;
        var userPoints = data.points;
        var Games2F = data.Games2f;
        var dbArquero = data.arquero;
        var dbCampeon1F = data.campeon;
        var dbCampeon2F = data.campeon2f;
        var dbGoleador = data.goleador;
        var dbMejorJugador = data.mejor_jugador;
        var dbMejorJugadorJoven = data.mejor_jugador_joven;
        var dbTercero = data.tercero;
        var keys = Object.keys(data.Games2f);
        for(var i = 0; i < keys.length; i++){
          var dbGame = Games2F[keys[i]];
          var dbHomeTeam = dbGame.home;
          var dbAwayTeam = dbGame.away;
          var dbHomeScore = dbGame.home_score;
          var dbAwayScore = dbGame.away_score;
          var dbIndex = dbGame.match;
          for(var j = 49; j < NgamesTemp; j++){
            var currHomeTeam = document.getElementById("T"+j+"H").innerHTML;
            var currAwayTeam = document.getElementById("T"+j+"A").innerHTML;
            var currHomeScore = document.getElementById("R"+j+"H").innerHTML;
            var currAwayScore = document.getElementById("R"+j+"A").innerHTML;
            if((currHomeTeam == dbHomeTeam) || (currAwayTeam == dbAwayTeam)){
              if(((currHomeTeam.length > 3) || (currAwayTeam.length > 3)) && verifyIteration(dbIndex[0], j)){
                userPoints += calculate2fPoints(dbHomeScore, dbAwayScore, dbHomeTeam, dbAwayTeam,
                                                currHomeScore, currAwayScore, currHomeTeam, currAwayTeam, dbIndex[0]);
              }
            }
          }
        }
        userPoints += puntosAdicionales(dbArquero, dbCampeon1F, dbCampeon2F, dbGoleador, dbMejorJugador, dbMejorJugadorJoven, dbTercero);
        add_user(name, userPoints);
      }
    })
    init();
    init_scores();
  });
}

general2F();

// function temp(){
//   var ref = database.ref().child("Ignacio de Osma").child("campeon2f").set("Brasil");
//   var ref2 = database.ref().child("Ignacio de Osma").child("tercero").set("Inglaterra");
// }
//
// temp();

function puntosAdicionales(dbArquero, dbCampeon1F, dbCampeon2F, dbGoleador, dbMejorJugador, dbMejorJugadorJoven, dbTercero){
  var result = 0;
  var currArquero = document.getElementById("pred_mejor_arquero").innerHTML;
  var currCampeon1F = document.getElementById("pred_campeon").innerHTML;
  var currCampeon2F = document.getElementById("pred_campeon2f").innerHTML;
  var currGoleador = document.getElementById("pred_goleador").innerHTML;
  var currMejorJugador = document.getElementById("pred_mejor_jugador").innerHTML;
  var currMejorJugadorJoven = document.getElementById("pred_mejor_jugador_joven").innerHTML;
  var currTercero = document.getElementById("pred_3rpuesto").innerHTML;

  if(dbArquero == currArquero){
    result += 150;
  }
  if(dbCampeon1F == currCampeon1F){
    result += 450;
  }
  if(dbCampeon2F == currCampeon2F){
    result += 300;
  }
  if(dbGoleador == currGoleador){
    result += 150;
  }
  if(dbMejorJugador == currMejorJugador){
    result += 150;
  }
  if(dbMejorJugadorJoven == currMejorJugadorJoven){
    result += 150;
  }
  if(dbTercero == currTercero){
    result += 200;
  }
  return result;
}

function userPredictionsEfficient(place){
  var place = parseInt(place);
  var name = document.getElementById("positions").rows[place].cells[1].innerHTML;
  document.getElementById("1f_header").innerHTML = "Predicciones: "+ name;
  var ref = database.ref().child(name).once('value', function(snap){
    var data = snap.val();
    for(var i = 0; i < 48; i++){
      var index = Object.keys(data.Games)[i];
      var awayTeam = data.Games[index].away;
      var homeTeam = data.Games[index].home;
      var awayScore = data.Games[index].away_score;
      var homeScore = data.Games[index].home_score;
      var matchIndex = data.Games[index].match;
      document.getElementById("T"+matchIndex+"H").innerHTML = homeTeam;
      document.getElementById("T"+matchIndex+"A").innerHTML = awayTeam;
      document.getElementById("R"+matchIndex+"H").innerHTML = homeScore;
      document.getElementById("R"+matchIndex+"A").innerHTML = awayScore;
    }

    document.getElementById("1ACL").innerHTML = data.Clasificados.ClasificadoA1;
    document.getElementById("2ACL").innerHTML = data.Clasificados.ClasificadoA2;
    document.getElementById("1BCL").innerHTML = data.Clasificados.ClasificadoB1;
    document.getElementById("2BCL").innerHTML = data.Clasificados.ClasificadoB2;
    document.getElementById("1CCL").innerHTML = data.Clasificados.ClasificadoC1;
    document.getElementById("2CCL").innerHTML = data.Clasificados.ClasificadoC2;
    document.getElementById("1DCL").innerHTML = data.Clasificados.ClasificadoD1;
    document.getElementById("2DCL").innerHTML = data.Clasificados.ClasificadoD2;
    document.getElementById("1ECL").innerHTML = data.Clasificados.ClasificadoE1;
    document.getElementById("2ECL").innerHTML = data.Clasificados.ClasificadoE2;
    document.getElementById("1FCL").innerHTML = data.Clasificados.ClasificadoF1;
    document.getElementById("2FCL").innerHTML = data.Clasificados.ClasificadoF2;
    document.getElementById("1GCL").innerHTML = data.Clasificados.ClasificadoG1;
    document.getElementById("2GCL").innerHTML = data.Clasificados.ClasificadoG2;
    document.getElementById("1HCL").innerHTML = data.Clasificados.ClasificadoH1;
    document.getElementById("2HCL").innerHTML = data.Clasificados.ClasificadoH2;

    for(var x = 0; x < 16; x++){
      var index = Object.keys(data.Games2f)[x];
      var awayTeam = data.Games2f[index].away;
      var homeTeam = data.Games2f[index].home;
      var awayScore = data.Games2f[index].away_score;
      var homeScore = data.Games2f[index].home_score;
      var match = data.Games2f[index].match;
      var game = "";
      if(match[0] == "O"){
        var octavosMatches = [49, 50, 53, 54, 51, 52, 55, 56];
        game = octavosMatches[match[1]-1];
        }
      else if(match[0] == "Q"){
        var cuartosMatches = [57, 58, 59, 60];
        game = cuartosMatches[match[1]-1];
      }
      else if(match[0] == "S"){
        var semisMatches = [61, 62];
        game = semisMatches[match[1]-1];
      }
      else if(match[0] == "F"){
        game = "64";
      }
      else if(match[0] == "T"){
        game = "63";
      }
      document.getElementById("T"+game+"H").innerHTML = homeTeam;
      document.getElementById("T"+game+"A").innerHTML = awayTeam;
      document.getElementById("R"+game+"H").innerHTML = homeScore;
      document.getElementById("R"+game+"A").innerHTML = awayScore;
    }

    document.getElementById("pred_mejor_arquero").innerHTML = data.arquero
    document.getElementById("pred_campeon").innerHTML = data.campeon
    document.getElementById("pred_mejor_jugador_joven").innerHTML = data.mejor_jugador_joven;
    document.getElementById("pred_mejor_jugador").innerHTML = data.mejor_jugador;
    document.getElementById("pred_goleador").innerHTML = data.goleador;
    document.getElementById("pred_campeon2f").innerHTML = data.campeon2f;
    document.getElementById("pred_3rpuesto").innerHTML = data.tercero;
  });
}

function calculate2fPoints(dbHomeScore, dbAwayScore, dbHomeTeam, dbAwayTeam,
                           currHomeScore, currAwayScore, currHomeTeam, currAwayTeam, dbIndex){

  var result = 0;
  if(dbIndex == "Q"){
    if(dbHomeTeam == currHomeTeam){
      result += 150;
    }
    if(dbAwayTeam == currAwayTeam){
      result+= 150;
    }
  }
  else if(dbIndex == "S"){
    if(dbHomeTeam == currHomeTeam){
      result += 200;
    }
    if(dbAwayTeam == currAwayTeam){
      result += 200;
    }
  }
  else if(dbIndex == "F"){
    if(dbHomeTeam == currHomeTeam){
      result += 250;
    }
    if(dbAwayTeam == currAwayTeam){
      result += 250;
    }
  }
  result += Points2fIndependentGame(dbHomeScore, dbAwayScore, currHomeScore, currAwayScore);
  return result;
}

function Points2fIndependentGame(dbHomeScore, dbAwayScore, currHomeScore, currAwayScore){
  var result = 0;
  var dgReal = currHomeScore - currAwayScore;
  var dgPred = dbHomeScore - dbAwayScore;

  if((dbHomeScore == currHomeScore) && (dbAwayScore == currAwayScore)){
    result = 30;
  }
  else if(dgReal == dgPred){
    result = 10;
  }
  return result;
}

function verifyIteration(dbIndex, j){
  if((dbIndex == "O" && j < 57) ||
     (dbIndex == "Q" && j > 56 && j < 61) ||
     (dbIndex == "S" && j > 60 && j < 63) ||
     (dbIndex == "F" && j==64) ||
     (dbIndex == "T" && j==63))
  {
    return true;
  }
  return false;
}

function Classified(){
  var ref = database.ref().once('value', function(snap){
    snap.forEach(userSnap => {
      var name = userSnap.key;
      if(name == "Ignacio de Osma"){
      if((name != "Scores") && (name != "Codes")){
        var ref_name = database.ref().child(name).once('value', function(snapGame){
          var data = snapGame.val();
          var userPoints = data.points;
          var classA1 = data.Clasificados.ClasificadoA1;
          var classA2 = data.Clasificados.ClasificadoA2;
          var classB1 = data.Clasificados.ClasificadoB1;
          var classB2 = data.Clasificados.ClasificadoB2;
          var classC1 = data.Clasificados.ClasificadoC1;
          var classC2 = data.Clasificados.ClasificadoC2;
          var classD1 = data.Clasificados.ClasificadoD1;
          var classD2 = data.Clasificados.ClasificadoD2;
          var classE1 = data.Clasificados.ClasificadoE1;
          var classE2 = data.Clasificados.ClasificadoE2;
          var classF1 = data.Clasificados.ClasificadoF1;
          var classF2 = data.Clasificados.ClasificadoF2;
          var classG1 = data.Clasificados.ClasificadoG1;
          var classG2 = data.Clasificados.ClasificadoG2;
          var classH1 = data.Clasificados.ClasificadoH1;
          var classH2 = data.Clasificados.ClasificadoH2;

          var clasificadoA1 = document.getElementById("1ACL").innerHTML;
          var clasificadoA2 = document.getElementById("2ACL").innerHTML;
          var clasificadoB1 = document.getElementById("1BCL").innerHTML;
          var clasificadoB2 = document.getElementById("2BCL").innerHTML;
          var clasificadoC1 = document.getElementById("1CCL").innerHTML;
          var clasificadoC2 = document.getElementById("2CCL").innerHTML;
          var clasificadoD1 = document.getElementById("1DCL").innerHTML;
          var clasificadoD2 = document.getElementById("2DCL").innerHTML;
          var clasificadoE1 = document.getElementById("1ECL").innerHTML;
          var clasificadoE2 = document.getElementById("2ECL").innerHTML;
          var clasificadoF1 = document.getElementById("1FCL").innerHTML;
          var clasificadoF2 = document.getElementById("2FCL").innerHTML;
          var clasificadoG1 = document.getElementById("1GCL").innerHTML;
          var clasificadoG2 = document.getElementById("2GCL").innerHTML;
          var clasificadoH1 = document.getElementById("1HCL").innerHTML;
          var clasificadoH2 = document.getElementById("2HCL").innerHTML;

          userPoints += calculateClassifiedPoints(classA1, classA2, clasificadoA1, clasificadoA2);
          userPoints += calculateClassifiedPoints(classB1, classB2, clasificadoB1, clasificadoB2);
          userPoints += calculateClassifiedPoints(classC1, classC2, clasificadoC1, clasificadoC2);
          userPoints += calculateClassifiedPoints(classD1, classD2, clasificadoD1, clasificadoD2);
          userPoints += calculateClassifiedPoints(classE1, classE2, clasificadoE1, clasificadoE2);
          userPoints += calculateClassifiedPoints(classF1, classF2, clasificadoF1, clasificadoF2);
          userPoints += calculateClassifiedPoints(classG1, classG2, clasificadoG1, clasificadoG2);
          userPoints += calculateClassifiedPoints(classH1, classH2, clasificadoH1, clasificadoH2);

          database.ref().child(name).update({points: userPoints});

        });
      }
    }
    })
  });
}

// Classified();

function classifiedCheck(){
  var ref = database.ref().child("Ignacio de Osma").once('value', function(snap) {
    var points = snap.val().points;
    if (points == 1500){
      Classified();
    }
  });
}

classifiedCheck();

function calculateClassifiedPoints(pred1, pred2, actual1, actual2){
  var result = 0;
  if(pred1 == actual1){
    result += 100
  }
  if(pred2 == actual2){
    result+= 100
  }
  if(pred1 == actual2){
    result += 25;
  }
  if(pred2 == actual1){
    result += 25
  }
  return result;
}

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

 function dbGames(){
   var ref_match = database.ref().child("Scores").once('value', function(snap){
     general(snap.val().Ngames);
   });
}

// dbGames();


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
  // if(Nusers - 2 == users.length){
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
      cell2.setAttribute("onclick","userPredictionsEfficient("+place+")");
      cell3.innerHTML = users[users.length-i-1].points;
    }
  // }
}

function initTemp(){
  var ref = database.ref().once('value', function(snap){
    var dataRaw = snap.val();
    var names = Object.keys(dataRaw);
    for(var i = 0; i < names.length; i++){
      if(names[i] == "Scores"){
        var data = dataRaw[names[i]];
        var matchesKeys = Object.keys(data);
        for(var j = 0; j < matchesKeys.length; j++){
          var matchData = data[matchesKeys[j]];
          var homeTeam = matchData.home;
          var awayTeam = matchData.away;
          var homeScore = matchData.home_score;
          var awayScore = matchData.away_score;
          addMatch(homeTeam, awayTeam, homeScore, awayScore);
        }
      }
      else if(names[i] != "Codes"){
        var data = dataRaw[names[i]];
        add_user(names[i], data.points);
      }
    }
    init();
    init_scores();
  });
}

// initTemp();

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
    });
    var awards = database.ref().child(name).once('value', function(data){
      var vals = Object.keys(data.val());
      for(var j = 0; j < vals.length; j++){
        if(vals[j] == "arquero"){
          document.getElementById("pred_mejor_arquero").innerHTML = data.val().arquero;
        }
        else if(vals[j] == "campeon"){
          document.getElementById("pred_campeon").innerHTML = data.val().campeon;
        }
        else if(vals[j] == "mejor_jugador_joven"){
          document.getElementById("pred_mejor_jugador_joven").innerHTML = data.val().mejor_jugador_joven;
        }
        else if(vals[j] == "mejor_jugador"){
          document.getElementById("pred_mejor_jugador").innerHTML = data.val().mejor_jugador;
        }
        else if(vals[j] == "goleador"){
          document.getElementById("pred_goleador").innerHTML = data.val().goleador;
        }
      }
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

function no2F(){
  var ref = database.ref().once('value', function(snap){
    var data = snap.val();
    var keys = Object.keys(snap.val());
    for(var i = 0; i < keys.length; i++){
      if(Object.keys(data[keys[i]]).length == 11){
        console.log(data[keys[i]].name);
      }
    }
  });
}

// no2F();

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
