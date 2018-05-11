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

function User(name, email, password){
  this.password = password;
  this.name = name;
  this.email = email;
  this.id = null;
  this.points = 0;
}

function Team(name, group, id){
  this.name = name;
  this.group = group;
  this.id = id;
  this.pts = 0;
  this.dg = 0;
  this.gf = 0;
  this.gc = 0;
}
// add above to an index.js . pull index.js from all html files

users = [];
teams = [];
groups = ["A", "B", "C", "D", "E", "F", "G", "H"];
// group property in class correspond to group index

function add_user(name, email, password){
  var usr = new User(name, email, password);
  users.push(usr);
}

function add_team(name, group, id){
  var team = new Team(name, group, id);
  teams.push(team);
}
// Grupo A
add_team("Rusia", 0, 1);
add_team("Arabia S.", 0, 2);
add_team("Egipto", 0, 3);
add_team("Uruguay", 0, 4);

// Grupo B
add_team("Portugal", 1, 5);
add_team("España", 1, 6);
add_team("Marruecos", 1, 7);
add_team("Irán", 1, 8);

// Grupo C
add_team("Francia", 2, 9);
add_team("Australia", 2, 10);
add_team("Perú", 2, 11);
add_team("Dinamarca", 2, 12);

// Grupo D
add_team("Argentina", 3, 13);
add_team("Islandia", 3, 14);
add_team("Croacia", 3, 15);
add_team("Nigeria", 3, 16);

// Grupo E
add_team("Brasil", 4, 17);
add_team("Suiza", 4, 18);
add_team("Costa Rica", 4, 19);
add_team("Serbia", 4, 20);

// Grupo F
add_team("Alemania", 5, 21);
add_team("México", 5, 22);
add_team("Suecia", 5, 23);
add_team("Corea", 5, 24);

// Grupo G
add_team("Bélgica", 6, 25);
add_team("Panamá", 6, 26);
add_team("Túnez", 6, 27);
add_team("Inglaterra", 6, 28);

// Grupo H
add_team("Polonia", 7, 29);
add_team("Senegal", 7, 30);
add_team("Colombia", 7, 31);
add_team("Japón", 7, 32);


function get_team_index(team_name){
  for(i = 0; i < teams.length; i++){
    if(teams[i].name == team_name){
      return i;
    }
  }
}

function scoring(home_team, away_team, home_score, away_score){
  var home_team = home_team.trim();
  var away_team = away_team.trim();
  home_t = get_team_index(home_team);
  away_t = get_team_index(away_team);
  home_s = parseInt(home_score);
  away_s = parseInt(away_score);
  // GF
  teams[home_t].gf += home_s;
  teams[away_t].gf += away_s;

  // GC
  teams[home_t].gc += away_s;
  teams[away_t].gc += home_s;

  // DG
  goal_d = home_s - away_s;
  teams[home_t].dg += goal_d;
  teams[away_t].dg += -1*goal_d;

  // PTS
  if(goal_d == 0){
    teams[home_t].pts += 1;
    teams[away_t].pts += 1;
  }
  else if(goal_d > 0){
    teams[home_t].pts += 3;
  }
  else{
    teams[away_t].pts += 3;
  }
}

function reset(group){
  for(i = 0; i < teams.length; i++){
    if(teams[i].group == group){
      teams[i].pts = 0;
      teams[i].dg = 0;
      teams[i].gf = 0;
      teams[i].gc = 0;
    }
  }
}

function group_points(group){
  var index = ((group+1)*6)-5;
  reset(group);
  for(i = 0; i < 6; i++){
    var j = i;
    var home_team = document.getElementById("T"+index+"H").innerHTML;
    var away_team = document.getElementById("T"+index+"A").innerHTML;
    var home_score = document.getElementById("M"+index+"H").value;
    var away_score = document.getElementById("M"+index+"A").value;
    index++;
    scoring(home_team, away_team, home_score, away_score);
    i = j;
  }
  order_group(group);
}

function order_group(group){
  temp = [];
  result = []; // ascending order
  for(i = 0; i < teams.length; i++){
    if(teams[i].group == group){
      temp.push(teams[i]);
    }
  }
  while(temp.length > 0){
    var min_index = 0;
    for(a = 1; a < temp.length; a++){
      if(temp[min_index].pts > temp[a].pts){
        min_index = a;
      }
      else if(temp[min_index].pts == temp[a].pts){
        if(temp[min_index].dg > temp[a].dg){
          min_index = a;
        }
        else if(temp[min_index].dg == temp[a].dg){
          if(temp[min_index].gf > temp[a].gf){
            min_index = a;
          }
        }
      }
    }
    result.push(temp[min_index]);
    var last = temp[temp.length-1];
    temp[temp.length-1] = temp[min_index];
    temp[min_index] = last;
    temp.pop()
  }
  var x = 0;
  while(x < result.length){
    for(y = x+1; y < result.length; y++){
      if((result[x].pts == result[y].pts) && (result[x].dg == result[y].dg) && (result[x].gf == result[y].gf)){
        for(z = 1; z < 7; z++){
          var home = document.getElementById("T"+z+"H").innerHTML;
          var away = document.getElementById("T"+z+"A").innerHTML;
          home = home.trim();
          away = away.trim();
          if((home == result[x].name) && (away == result[y].name)){
            var home_score = document.getElementById("M"+z+"H").value;
            var away_score = document.getElementById("M"+z+"A").value;
            if(home_score > away_score){
              // swap
              var temp = result[x];
              result[x] = result[y];
              result[y] = temp;
            }
          }
          else if((away == result[x].name) && (home == result[y].name)){
            var home_score = document.getElementById("M"+z+"H").value;
            var away_score = document.getElementById("M"+z+"A").value;
            if(away_score > home_score){
              var temp = result[x];
              result[x] = result[y];
              result[y] = temp;
            }
          }
        }
      }
    }
    x++;
  }

  var group_letter = groups[group];
  for(j = 1; j < result.length+1; j++){
    var index = result.length - j;
    if(j < 3){
      // meter en clasificados --> CL es por Clasificado
      document.getElementById(j+group_letter+"CL").innerHTML = result[index].name;
    }
    document.getElementById(j+group_letter).innerHTML = result[index].name;
    document.getElementById(j+group_letter+"PTS").innerHTML = result[index].pts;
    document.getElementById(j+group_letter+"DG").innerHTML = result[index].dg;
    document.getElementById(j+group_letter+"GF").innerHTML = result[index].gf;
    document.getElementById(j+group_letter+"GC").innerHTML = result[index].gc;
  }
}

//// Firebase
function init(){
  var x = "a";
  var database = firebase.database();
  var fruitRef = database.ref('title');
  var result = fruitRef.push({
    name: 'sub1',
    color: {red: 0, blue: 1}
  });
}

function submit(){
  var database = firebase.database();
  var name = document.getElementsByName("name")[0].value;
  var email = document.getElementsByName("email")[0].value;
  var password = document.getElementsByName("password")[0].value;
  add_user(name, email, password);
  var name_db = database.ref(name);
  var data1 = name_db.set({
    name: name,
    email: email,
    password: password,
    points: 0
  });
  var index = 1;
  for(i = 0; i < groups.length; i++){
    for(j = 0; j < 6; j++){
      var home_team = document.getElementById("T"+index+"H").innerHTML;
      var away_team = document.getElementById("T"+index+"A").innerHTML;
      var home_score = document.getElementById("M"+index+"H").value;
      var away_score = document.getElementById("M"+index+"A").value;
      home_team = home_team.trim();
      away_team = away_team.trim();
      var data2 = name_db.push({
        match: index,
        home: home_team,
        away: away_team,
        home_score: home_score,
        away_score: away_score
      });
      index++;
    }
  }
}




// AUTO COMPLETE
function autocomplete(inp, arr) {
  /*the autocomplete function takes two arguments,
  the text field element and an array of possible autocompleted values:*/
  var currentFocus;
  /*execute a function when someone writes in the text field:*/
  inp.addEventListener("input", function(e) {
      var a, b, i, val = this.value;
      /*close any already open lists of autocompleted values*/
      closeAllLists();
      if (!val) { return false;}
      currentFocus = -1;
      /*create a DIV element that will contain the items (values):*/
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      /*append the DIV element as a child of the autocomplete container:*/
      this.parentNode.appendChild(a);
      /*for each item in the array...*/
      for (i = 0; i < arr.length; i++) {
        /*check if the item starts with the same letters as the text field value:*/
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
          /*create a DIV element for each matching element:*/
          b = document.createElement("DIV");
          /*make the matching letters bold:*/
          b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
          b.innerHTML += arr[i].substr(val.length);
          /*insert a input field that will hold the current array item's value:*/
          b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          /*execute a function when someone clicks on the item value (DIV element):*/
          b.addEventListener("click", function(e) {
              /*insert the value for the autocomplete text field:*/
              inp.value = this.getElementsByTagName("input")[0].value;
              /*close the list of autocompleted values,
              (or any other open lists of autocompleted values:*/
              closeAllLists();
          });
          a.appendChild(b);
        }
      }
  });
  /*execute a function presses a key on the keyboard:*/
  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the currentFocus variable:*/
        currentFocus++;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the currentFocus variable:*/
        currentFocus--;
        /*and and make the current item more visible:*/
        addActive(x);
      } else if (e.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        e.preventDefault();
        if (currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (x) x[currentFocus].click();
        }
      }
  });
  function addActive(x) {
    /*a function to classify an item as "active":*/
    if (!x) return false;
    /*start by removing the "active" class on all items:*/
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    /*add class "autocomplete-active":*/
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }
  function closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    var x = document.getElementsByClassName("autocomplete-items");
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
        x[i].parentNode.removeChild(x[i]);
      }
    }
  }
  /*execute a function when someone clicks in the document:*/
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
      });
}

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
}

/*An array containing all the country names in the world:*/
var countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua & Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia & Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central Arfrican Republic","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica","Cote D Ivoire","Croatia","Cuba","Curacao","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauro","Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre & Miquelon","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","St Kitts & Nevis","St Lucia","St Vincent","Sudan","Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad & Tobago","Tunisia","Turkey","Turkmenistan","Turks & Caicos","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States of America","Uruguay","Uzbekistan","Vanuatu","Vatican City","Venezuela","Vietnam","Virgin Islands (US)","Yemen","Zambia","Zimbabwe"];

var arqueros = ["Pedro Gallesse", "Sergio Romero", "David De Gea"]
var jugadores_jovenes = ["Gabriel Jesús", "Leroy Sané", "Beto da Silva"]
var jugadores = ["Lionel Messi", "Cristiano Ronaldo", "Thiago Alcantara", "Paolo Guerrero"]

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("campeon"), countries);
autocomplete(document.getElementById("arquero"), arqueros);
autocomplete(document.getElementById("jugador_joven"), jugadores_jovenes);
autocomplete(document.getElementById("mejor_jugador"), jugadores);
autocomplete(document.getElementById("goleador"), jugadores);
