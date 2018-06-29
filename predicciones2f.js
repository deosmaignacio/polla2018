// Initialize Firebase
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

var Nusers = 0; // jalar de DB

var codes = [];

function get_codes(){
  var ref = database.ref("Codes");
  ref.once('value', function(data){
    var code = data.val();
    var keys = Object.keys(code);
    for(var i = 0; i < keys.length; i++){
      var k = keys[i];
      if(k != "points"){
        codes.push(code[k].code);
      }
    }
  })
}

// get_codes();

function Classified(team, group, number){
  this.team = team;
  this.group = group;
  this.number = number;
}

var clasificados = [];

function add_team(team, group, number){
  var x = new Classified(team, group, number);
  clasificados.push(x);
}

add_team("2H", "H", 2);
add_team("1H", "H", 1);
add_team("2G", "G", 2);
add_team("1G", "G", 1);
add_team("2F", "F", 2);
add_team("1F", "F", 1);
add_team("2E", "E", 2);
add_team("1E", "E", 1);
add_team("2D", "D", 2);
add_team("1D", "D", 1);
add_team("2C", "C", 2);
add_team("1C", "C", 1);
add_team("2B", "B", 2);
add_team("1B", "B", 1);
add_team("2A", "A", 2);
add_team("1A", "A", 1);

function find_team(group, number){
  for(var i = 0; i < clasificados.length; i++){
    if((clasificados[i].group == group) && (clasificados[i].number == number)){
      return i;
      break;
    }
  }
  return 0;
}

groups = ["A", "B", "C", "D", "E", "F", "G", "H"];

function init(){
  for(var j = 1; j < 3; j++){
    for(var i = 0; i < groups.length; i++){
      var group = groups[i]
      var team_index = find_team(group, j);
      document.getElementById(group+j).value = clasificados[team_index].team;
      document.getElementById(group+j).innerHTML = clasificados[team_index].team;
    }
  }
}

init();

function winner(fase, num){
  var result = [];
  var home_team = document.getElementById(fase+num+"H").value;
  var away_team = document.getElementById(fase+num+"A").value;
  var home_score = document.getElementById(fase+num+"H_score").value;
  var away_score = document.getElementById(fase+num+"A_score").value;
  if((home_score != "vacio") && (away_score != "vacio")){
    if((fase != "S") && (fase != "F") && (fase != "T")){
      if(home_score == away_score){
        result.push(home_team);
        result.push(away_team);
      }
      else if(home_score > away_score){
        result.push(home_team);
      }
      else{
        result.push(away_team);
      }
    }
    else{
      if(home_score == away_score){
        var temp = [];
        temp.push(home_team);
        temp.push(away_team);
        result.push(temp);
      }
      else{
        var temp1 = [];
        var temp2 = [];
        temp1.push(home_team);
        temp2.push(away_team);
        if(home_score > away_score){
          result.push(temp1);
          result.push(temp2);
        }
        else{
          result.push(temp2);
          result.push(temp1);
        }
      }
    }
  }
  return result;
}

function quarter_finals(num){
  var team_arr = winner("O", num);
  var x;
  // remove al existing options from x;
  // if not possible, then include 2 options on each select, and change the entries?
  switch(num){
    case 1:
        x = document.getElementById("Q1H");
        break;
    case 2:
        x = document.getElementById("Q1A");
        break;
    case 3:
        x = document.getElementById("Q2H");
        break;
    case 4:
        x = document.getElementById("Q2A");
        break;
    case 5:
        x = document.getElementById("Q3H");
        break;
    case 6:
        x = document.getElementById("Q3A");
        break;
    case 7:
        x = document.getElementById("Q4H");
        break;
    case 8:
        x = document.getElementById("Q4A");
        break;
  }
  while(x.length > 0){
    x.remove(0);
  }
  for(var i = 0; i < team_arr.length; i++){
    var option = document.createElement("option");
    option.text = team_arr[i];
    option.value = team_arr[i];
    x.add(option);
  }
}

function semi_finals(num){
  var team_arr = winner("Q", num);
  var x;
  switch(num){
    case 1:
        x = document.getElementById("S1H");
        break;
    case 2:
        x = document.getElementById("S1A");
        break;
    case 3:
        x = document.getElementById("S2H");
        break;
    case 4:
        x = document.getElementById("S2A");
        break;
  }
  while(x.length > 0){
    x.remove(0);
  }
  for(var i = 0; i < team_arr.length; i++){
    var option = document.createElement("option");
    option.text = team_arr[i];
    option.value = team_arr[i];
    x.add(option);
  }
}

function final(num){
  console.log("final enter", num);
  var team_arr = winner("S", num);
  console.log(team_arr);
  var x;
  var y;
  switch(num){
    case 1:
        x = document.getElementById("F1H");
        y = document.getElementById("T1H");
        break;
    case 2:
        x = document.getElementById("F1A");
        y = document.getElementById("T1A")
        break;
  }
  while(x.length > 0){
    x.remove(0);
  }
  while(y.length > 0){
    y.remove(0);
  }
  for(var i = 0; i < team_arr.length; i++){
    var element_length = team_arr[i].length;
    if(element_length == 1 && i == 0){
      console.log("enter if 1");
      var option1 = document.createElement("option");
      option1.text = team_arr[i][0];
      option1.value = team_arr[i][0];
      x.add(option1);
    }
    else if(element_length == 1 && i != 0){
      console.log("enter if 2");
      var option1 = document.createElement("option");
      option1.text = team_arr[i][0];
      option1.value = team_arr[i][0];
      y.add(option1);
    }
    else if(element_length == 2 && i == 0){
      console.log("enter correct if");
      var option1 = document.createElement("option");
      var option2 = document.createElement("option");
      option1.text = team_arr[i][0];
      option1.value = team_arr[i][0];
      option2.text = team_arr[i][1];
      option2.value = team_arr[i][1];
      x.options[x.options.length] = new Option(team_arr[i][0], team_arr[i][0]);
      x.options[x.options.length] = new Option(team_arr[i][1], team_arr[i][1]);
      y.add(option1);
      y.add(option2);
    }
  }
}

function champion(){
  var team_arr = winner("F", 1);
  x = document.getElementById("Winner");
  while(x.length > 0){
    x.remove(0);
  }
  for(var i = 0; i < team_arr.length; i++){
    var element_length = team_arr[i].length;
    if(element_length == 1 && i == 0){
      var option1 = document.createElement("option");
      option1.text = team_arr[i][0];
      option1.value = team_arr[i][0];
      x.add(option1);
    }
    else if(element_length == 2 && i == 0){
      var option1 = document.createElement("option");
      option1.text = team_arr[i][0];
      option1.value = team_arr[i][0];
      var option2 = document.createElement("option");
      option2.text = team_arr[i][1];
      option2.value = team_arr[i][1];
      x.add(option1);
      x.add(option2);
    }
  }
}

function third(){
  var team_arr = winner("T", 1);
  x = document.getElementById("Third");
  while(x.length > 0){
    x.remove(0);
  }
  x = document.getElementById("Third");
  for(var i = 0; i < team_arr.length; i++){
    var element_length = team_arr[i].length;
    if(element_length == 1 && i == 0){
      var option1 = document.createElement("option");
      option1.text = team_arr[i][0];
      option1.value = team_arr[i][0];
      x.add(option1);
    }
    else if(element_length == 2 && i == 0){
      var option1 = document.createElement("option");
      option1.text = team_arr[i][0];
      option1.value = team_arr[i][0];
      var option2 = document.createElement("option");
      option2.text = team_arr[i][1];
      option2.value = team_arr[i][1];
      x.add(option1);
      x.add(option2);
    }
  }
}

function submit(x){
  if(x == 1){
    console.log("enter submit");
    var name = document.getElementsByName("name")[0].value;
    var code = document.getElementsByName("code")[0].value;
    var name_db = database.ref(name);
    var stages = ["O", "Q", "S", "F", "T"];
    var games = [8, 4, 2, 1, 1];
    for(var i = 0; i < stages.length; i++){
      var fase = stages[i];
      var nStageGames = games[i];
      for(var j = 1; j <= nStageGames; j++){
        var home_team = document.getElementById(fase+j+"H").value;
        var away_team = document.getElementById(fase+j+"A").value;
        var home_score = document.getElementById(fase+j+"H_score").value;
        var away_score = document.getElementById(fase+j+"A_score").value;
        var index = fase+j+"H";
        var data2 = name_db.child("Games2f").push({
          home: home_team,
          away: away_team,
          home_score: home_score,
          away_score: away_score,
          match: index
        });
      }
    }
    document.getElementById("submit_result").innerHTML = "¡Gracias! Tus predicciones han sido registradas. Para verificar que ya estás inscrito, mira la tabla, ahí aparecerá tu nombre";
  }
  else if(x == 0){
    alert("Usted a ingresado con un nombre que no corresponde a ese código. Asegúrese de escribir su nombre como lo escribió la primera vez. Si no se acuerda, puede buscarlo en la Tabla de posiciones.")
  }
  else if(x == -1){
    alert("Código inválido. Consulte con los organizadores y confirme que su código es el correcto.");
  }
  else{
    alert("Ha ocurrido un error. Asegúrese de escribir su nombre como lo escribió la primera vez. Si no se acuerda, puede buscarlo en la Tabla de posiciones.");
  }
}

function check_result(){
  if(check_entries()){
    var curr_code = document.getElementsByName("code")[0].value;
    currCode = parseInt(curr_code);
    var currName = document.getElementsByName("name")[0].value;
    var ref = database.ref().child(currName).once('value', function(snap){
      var trueCode = snap.val().code;
      if(trueCode == currCode){
        submit(1);
      }
      else if(trueCode != currCode){
        submit(-1);
      }
      else if((trueCode == currCode) && (name != currName)){
        submit(0);
      }
  });
  }
}


function check_entries(){
  // 1. nombre y código
  var code = document.getElementsByName("code")[0].value;
  var name = document.getElementsByName("name")[0].value;
  if((code.length == 0) || (name.length == 0)){
    alert("Asegurarse de llenar casillas de nombre y código.");
    return false;
  }
  // 2. toda casilla con equipo
  var stages = ["O", "Q", "S", "F", "T"];
  var games = [8, 4, 2, 1, 1];
  for(var i = 0; i < stages.length; i++){
    var fase = stages[i];
    var nStageGames = games[i];
    for(var j = 1; j <= nStageGames; j++){
      var home_score = document.getElementById(fase+j+"H_score").value;
      var away_score = document.getElementById(fase+j+"A_score").value;
      if((home_score == "vacio") || (away_score == "vacio")){
        alert("Asegurarse de llenar todas las casillas.");
        return false;
      }
    }
  }
  return true;
}
