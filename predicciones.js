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

var codes = [9074513446, 7457755588, 4121741592, 4809691577, 7906391236, 9918786968, 4914714566, 7502124568, 8927162667, 8076220242, 1521342472, 5217890826, 6434700837, 7220632906, 4227214146, 5014252667, 7515823403, 4500827771, 2074493062, 7373901522, 7233515879, 8955696374, 5148396674, 4538936527, 8351951308, 9827360772, 6827997368, 8862956432, 3571641213, 1537051081, 8726960894, 5500787952, 7800392082, 9559631366, 8142384266, 8996179516, 5470501526, 3672958497, 9541795599, 9076814679, 1983672781, 8538854977, 5333912954, 4909768348, 7562397226, 5452013889, 5277287996, 2835932913, 4394887703, 4837874069, 6833533435, 6628998356, 8730190189, 9367456835, 6184638876, 9327318563, 1962971653, 2314754631, 3767419257, 8290582094, 7493586791, 3878808218, 7004909904, 1188726542, 6342641044, 3639909489, 1721832360, 8894310813, 6953382615, 6395638337, 4692270253, 3532301383, 6674939320, 9038896107, 5360707708, 8449822129, 6973004397, 6789624053, 9588217560, 8177994204, 8122092323, 8556319113, 5210379417, 5207818696, 4785048755, 8785879549, 8597037221, 4043898169, 5764177655, 2041593160, 2132154848, 3182621113, 6251243197, 3568915564, 9761133909, 8662123573, 6448867466, 7625146623, 5562008942, 3345262352,];

var Nusers_a = 0; // jalar de DB
var Nusers_b = 0; // updatear manualmente (ESTE SE CAMBIA!)

// FUNCION PARA VER QUE CODIGO DAR (AL USAR, COMMENT OUT)
function print_code(){
alert("Codigo: "+codes[Nusers_b]);
}
// print_code();

var database = firebase.database();

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
teams = [];
groups = ["A", "B", "C", "D", "E", "F", "G", "H"];
// group property in class correspond to group index


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
  if ((home_score=="vacio" || away_score=="vacio")==false) {

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
          else if(temp[min_index].gf == temp[a].gf){
            if(temp[min_index].id < temp[a].id){
              min_index = a;
            }
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
            if ((home_score=="vacio" || away_score=="vacio")==false) {
              if(home_score > away_score){
                // swap
                var temp = result[x];
                result[x] = result[y];
                result[y] = temp;
              }
            }
          }
          else if((away == result[x].name) && (home == result[y].name)){
            var home_score = document.getElementById("M"+z+"H").value;
            var away_score = document.getElementById("M"+z+"A").value;
            if ((home_score=="vacio" || away_score=="vacio")==false) {
              if(away_score > home_score){
                var temp = result[x];
                result[x] = result[y];
                result[y] = temp;
              }
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
function submit(x){
  if(x == -1 || x == 1){
    var temp = Nusers_a + 1;
    var name = document.getElementsByName("name")[0].value;
    var email = document.getElementsByName("email")[0].value;
    var code = document.getElementsByName("code")[0].value;
    var arquero = document.getElementById("arquero").value;
    var jj = document.getElementById("jugador_joven").value;
    var mj = document.getElementById("mejor_jugador").value;
    var goleador = document.getElementById("goleador").value;
    var campeon = document.getElementById("campeon").value;
    var name_db = database.ref(name);
    var data1 = name_db.set({
      name: name,
      email: email,
      code: code,
      points: 0,
      arquero: arquero,
      mejor_jugador_joven: jj,
      mejor_jugador: mj,
      goleador: goleador,
      campeon: campeon
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
        var data2 = name_db.child("Games").push({
          home: home_team,
          away: away_team,
          home_score: home_score,
          away_score: away_score,
          match: index
        });
        index++;
      }
    }
    for(var a = 0; a < 8; a++){
      group_points(a);
    }
    var data3 = name_db.child("Clasificados").set({
      ClasificadoA1: document.getElementById("1ACL").innerHTML,
      ClasificadoA2: document.getElementById("2ACL").innerHTML,
      ClasificadoB1: document.getElementById("1BCL").innerHTML,
      ClasificadoB2: document.getElementById("2BCL").innerHTML,
      ClasificadoC1: document.getElementById("1CCL").innerHTML,
      ClasificadoC2: document.getElementById("2CCL").innerHTML,
      ClasificadoD1: document.getElementById("1DCL").innerHTML,
      ClasificadoD2: document.getElementById("2DCL").innerHTML,
      ClasificadoE1: document.getElementById("1ECL").innerHTML,
      ClasificadoE2: document.getElementById("2ECL").innerHTML,
      ClasificadoF1: document.getElementById("1FCL").innerHTML,
      ClasificadoF2: document.getElementById("2FCL").innerHTML,
      ClasificadoG1: document.getElementById("1GCL").innerHTML,
      ClasificadoG2: document.getElementById("2GCL").innerHTML,
      ClasificadoH1: document.getElementById("1HCL").innerHTML,
      ClasificadoH2: document.getElementById("2HCL").innerHTML
    });
    document.getElementById("submit_result").innerHTML = "¡Gracias! Sus predicciones han sido registradas.";
  }
  else if(x == 0){
    alert("Usted a ingresado con el codigo de otro usuario. Su nombre ha sido guardado y no podrá participar en la polla.")
  }
  else{
    alert("Ha ocurrido un error. Asegurese de tener un código valido.");
  }
}

function check_result(){
  if(check_entries()){
    var curr_code = document.getElementsByName("code")[0].value;
    var curr_name = document.getElementsByName("name")[0].value;
    var usersChecked = 0;
    var result = -2;
    var bool = false;
    if(codes.includes(curr_code)){
      result = -1;
    }
    var ref = database.ref().once('value', function(snap){
      Nusers_a = snap.numChildren();
      snap.forEach(userSnap => {
        var name = userSnap.key;
        var ref_name = database.ref().child(name).once('value', data =>{
          var code = data.val().code;
          usersChecked++;
          if((code == curr_code) && (name == curr_name)){
            result = 1;
            bool = true;
          }
          if((code == curr_code) && (name != curr_name) && !bool){
            result = 0;
          }
          if(usersChecked == Nusers_a){
            submit(result);
          }
        });
      })
    });
  }
}

function check_entries(){
  // 1. nombre y codigo
  var code = document.getElementsByName("code")[0].value;
  var name = document.getElementsByName("name")[0].value;
  if((code.length == 0) || (name.length == 0)){
    alert("Asegurarse de llenar casillas de nombre y código.");
    return false;
  }
  // 2. casillas no en blanco en predicciones
  for(var i = 0; i < 48; i++){
    var home_score = document.getElementById("M"+(i+1)+"H").value;
    var away_score = document.getElementById("M"+(i+1)+"A").value;
    if((home_score == "vacio") || (away_score == "vacio")){
      // alert("Asegurarse de no dejar ninguna casilla de resultado en blanco.");
      // return false;
    }
  }
  // 3. premios
  var arquero = document.getElementById("arquero").value;
  var mjj = document.getElementById("jugador_joven").value;
  var mj = document.getElementById("mejor_jugador").value;
  var goleador = document.getElementById("goleador").value;
  var campeon = document.getElementById("campeon").value;
  if(!((arqueros.includes(arquero)) &&
     (countries.includes(campeon)) &&
     (jugadores.includes(mj)) &&
     (jugadores_jovenes.includes(mjj)) &&
     (jugadores.includes(goleador)))){
       // alert("Asegurarse de dar click en su selección de 'Premios Individuales'");
       // return false;
     }
  return true;
}

function load_predictions(){
  var curr_code = document.getElementsByName("code")[0].value;
  var curr_name = document.getElementsByName("name")[0].value;
  if((curr_code.length == 0) || (curr_name.length == 0)){
    alert("Asegurarse de llenar casillas de nombre y código.");
  }
  var bool = false;
  var usersChecked = 0;
  var ref = database.ref().once('value', function(snap){
    snap.forEach(userSnap => {
      usersChecked++;
      var name = userSnap.key;
      if(curr_name == name){
        bool = true;
        var index = 1;
        var ref_name = database.ref().child(name).once('value', data =>{
          var code = data.val().code;
          if(code != curr_code){
            alert("El codigo que ha ingresado es incorrecto.")
          }
          else if(code == curr_code){
            document.getElementById("arquero").value = data.val().arquero;
            document.getElementById("jugador_joven").value = data.val().mejor_jugador_joven;
            document.getElementById("mejor_jugador").value = data.val().mejor_jugador;
            document.getElementById("goleador").value = data.val().goleador;
            document.getElementById("campeon").value = data.val().campeon;
            var clasificados = database.ref().child(name).child("Clasificados").once('value', snapClas =>{
              snapClas.forEach(snapDat =>{
                var first = snapDat.key.slice(11, 13)[0];
                var second = snapDat.key.slice(11, 13)[1];
                document.getElementById(second+first+"CL").innerHTML = snapDat.val();
              })
            });
            var game = database.ref().child(name).child("Games").once('value', snapGame =>{
              snapGame.forEach(GameSnap =>{
                var game = GameSnap.val();
                var home_score = game.home_score;
                var away_score = game.away_score;
                var match = game.match;
                document.getElementById("M"+index+"H").value = home_score;
                document.getElementById("M"+index+"A").value = away_score;
                index++;
              })
            });
          }
        });
      }
    })
    if(!bool){
      alert("No tenemos información sobre usted en nuestra base de datos.")
    }
  });
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
var countries = ["Rusia","Arabia S.","Egipto","Uruguay","Portugal","España","Marruecos","Irán",
"Francia","Australia","Perú","Dinamarca","Argentina","Islandia","Croacia","Nigeria",
"Brasil","Suiza","Costa Rica","Serbia","Alemania","México","Suecia","Corea","Bélgica",
"Panamá","Túnez","Inglaterra","Polonia","Senegal","Colombia","Japón"];

var arqueros = ["Igor Akinfeev", "Vladimir Gabulov", "Soslan Dzhanaev", "Essam El Hadary", "Mohamed El-Shennawy", "Sherif Ekramy", "Fernando Muslera", "Anthony Lopes", "Beto", "Rui Patrício", "David de Gea", "Alireza Beiranvand", "Seyed Hossein Hosseini", "Rashid Mazaheri", "Hugo Lloris", "Mat Ryan", "Danny Vukovic", "Brad Jones", "Pedro Gallese", "Carlos Cáceda", "José Carvallo", "Kasper Schmeichel", "Jonas Lossl", "Frederik Ronow", "Sergio Romero", "Willy Caballero", "Franco Armani", "Hannes Halldorsson", "Runar Alex Runarsson", "Frederik Schram", "Subasic", "Kalinic", "Livakovic", "Ikechukwu Ezenwa", "Francis Uzoho", "Daniel Akpeyi", "Alisson", "Ederson", "Cassio", "Keylor Navas", "Leonel Moreira", "Patrick Pemberton", "Bernd Leno", "Manuel Neuer", "Marc-Andre ter Stegen", "Guillermo Ochoa", "Kim Seung-gyu", "Kim Jin-hyeon", "Cho Hyun-woo", "Thibaut Courtois", "José Calderón", "Jaime Penedo", "Alex Rodríguez", "Aymen Mathlouthi", "Mouez Hassen", "Farouk Ben Mustapha", "Joe Hart", "Jordan Pickford", "Bartosz Bialkowski", "Lukasz Fabianski", "Lukasz Skorupski", "Iván Arboleda", "José Fernando Cuadrado", "David Ospina"];

var jugadores_jovenes = ["Gabriel Jesús", "Leroy Sané", "Beto da Silva"];

var jugadores = ["Igor Akinfeev", "Vladimir Gabulov", "Soslan Dzhanaev", "Andrey Lunev", "Vladimir Granat", "Ruslan Kambolov", "Fedor Kudryashov", "Ilya Kutepov", "Roman Neustadter", "Konstantin Rausch", "Andrey Semenov", "Igor Smolnikov", "Mario Fernandes", "Yuri Gazinskiy", "Alexsandr Golovin", "Alan Dzagoev", "Alexsandr Erokhin", "Yuri Zhirkov", "Daler Kuzyaev", "Roman Zobnin", "Alexsandr Samedov", "Anton Miranchuk", "Alexsandr Tashaev", "Denis Cheryshev", "Artem Dzyuba", "Aleksey Miranchuk", "Fedor Smolov", "Fedor Chalov", "Essam El Hadary", "Mohamed El-Shennawy", "Sherif Ekramy", "Mohamed Awad", "Ahmed Fathi", "Saad Samir", "Ayman Ashraf", "Mahmoud Hamdy", "Mohamed Abdel-Shafy", "Ahmed Hegazy", "Ali Gabr", "Ahmed Al-Muhammadi", "Karim Hafez", "Omar Gaber", "Tarek Amro", "Tarek Hamed", "Mahmoud Abdel Aziz", "Shikabala", "Abdallah Said", "Sam Morsy", "Mohamed El Nenny", "Kahraba", "Ramadan Sobhi", "Trezeguet", "Amr Warda", "Marwan Mohsen", "Ahmed Gomaa", "Kouka", "Mohamed Salah", "Fernando Muslera", "Maxi Pereira", "Diego Godin", "Martin Caceres", "Jose Gimenez", "Sebastian Coates", "Gaston Silva", "Mathias Corujo", "Egidio Arevalo Rios", "Alvaro Gonzalez", "Nicolas Lodeiro", "Carlos Sanchez", "Cristian Rodriguez", "Matias Vecino", "Edinson Cavani", "Luis Suarez", "Cristhian Stuani", "Diego Rolan", "Anthony Lopes", "Beto", "Rui Patrício", "Antunes", "Bruno Alves", "Cedric Soares", "Joao Cancelo", "José Fonte", "Luis Neto", "Mario Rui", "Nelson Semedo", "Pepe", "Raphael Guerreiro", "Ricardo Pereira", "Rolando", "Rúben Dias", "Adrien Silva", "André Gomes", "Bruno Fernandes", "Joao Mario", "Joao Moutinho", "Manuel Fernandes", "Ruben Neves", "Sergio Oliveira", "William Carvalho", "André Silva", "Bernardo Silva", "Cristiano Ronaldo", "Éder", "Gelson Martins", "Gonçalo Guedes", "Nani", "Paulinho", "Ricardo Quaresma", "Ronny Lopes", "David de Gea", "Jordi Alba", "Nacho", "Nacho Monreal", "Gerard Pique", "Sergio Ramos", "Daniel Carvajal", "Sergio Busquets", "Thiago Alcantara", "Francisco Alracón (Isco)", "Koke", "Marco Asensio", "Andres Iniesta", "David Villa", "Saul Niguez", "Alvaro Morata", "Vitolo", "Diego Costa", "Alireza Beiranvand", "Seyed Hossein Hosseini", "Rashid Mazaheri", "Amir Abedzadeh", "Ramin Rezaeian", "Voria Ghafouri", "Steven Beitashour", "Seyed Jalal Hosseini", "Mohammad Reza khanzadeh", "Morteza Pouraliganji", "Mohammad Ansari", "Pejman Montazeri", "Seyed Majid Hosseini", "Milad Mohammadi", "Omid Norafkan", "Saeid Aghaei", "Roozbeh Cheshmi", "Saeid Ezatolahi", "Masoud Shojaei", "Ahmad Abdolahzadeh", "Saman Ghoddos", "Mehdi Torabi", "Ashkan Dejagah", "Omid Ebrahimi", "Ehsan Hajsafi", "Ali Karimi", "Soroush Rafiei", "Ali Gholizadeh", "Vahid Amiri", "Alireza Jahanbakhsh", "Karim Ansarifard", "Mahdi Taremi", "Sardar Azmoun", "Reza Ghoochannejhad", "Kaveh Rezaei", "Hugo Lloris", "Raphael Varane", "Lucas Digne", "Djibril Sidibe", "Samuel Umtiti", "Layvin Kurzawa", "Laurent Koscielny", "Blaise Matuidi", "N'Golo Kante", "Thomas Lemar", "Adrien Rabiot", "Paul Pogba", "Olivier Giroud", "Antoine Griezmann", "Alexandre Lacazette", "Kylian Mbappe", "Ousmane Dembele", "Anthony Martial", "Mat Ryan", "Danny Vukovic", "Brad Jones", "Aziz Behich", "Milos Degenek", "Matthew Jurman", "James Meredith", "Josh Risdon", "Trent Sainsbury", "Fran Karacic", "Josh Brillante", "Mile Jedinak", "Mark Milligan", "Robbie Kruse", "Jackson Irvine", "Massimo Luongo", "Aaron Mooy", "Tom Rogic", "James Troisi", "Tim Cahill", "Tomi Juric", "Matthew Leckie", "Andrew Nabbout", "Nikita Rukavytsya", "Dimitri Petratos", "Daniel Arzani", "Pedro Gallese", "Carlos Cáceda", "José Carvallo", "Aldo Corzo", "Luis Advíncula", "Miguel Araujo", "Alberto Rodríguez", "Christian Ramos", "Anderson Santamaría", "Luis Abram", "Miguel Trauco", "Nilson Loyola", "Renato Tapia", "Pedro Aquino", "Yoshimar Yotún", "Sergio Peña", "Edison Flores", "Paolo Hurtado", "Wilder Cartagena", "Christian Cueva", "André Carrillo", "Jefferson Farfán", "Andy Polo", "Raúl Ruidíaz", "Kasper Schmeichel", "Jonas Lossl", "Frederik Ronow", "Jesper Hansen", "Simon Kjaer", "Andreas Christensen", "Mathias Jorgensen", "Jannik Vestergaard", "Andreas Bjelland", "Henrik Dalsgaard", "Peter Ankersen", "Jens Stryger", "Riza Durmisi", "Jonas Knudsen", "Nicolai Boilesen", "William Kvist", "Thomas Delaney", "Lukas Lerager", "Lasse Schone", "Mike Jensen", "Christian Eriksen", "Daniel Wass", "Pierre-Emile Hojbjerg", "Mathias Jensen", "Michael Krohn-Dehli", "Robert Skov", "Pione Sisto", "Martin Braithwaite", "Andreas Cornelius", "Viktor Fischer", "Yussuf Poulsen", "Nicolai Jorgensen", "Nicklas Bendtner", "Kasper Dolberg", "Kenneth Zohore", "Sergio Romero", "Willy Caballero", "Franco Armani", "Nahuel Guzmán", "Gabriel Mercado", "Eduardo Salvio", "Federico Fazio", "Nicolás Otamendi", "Marcos Acuña", "Nicolás Tagliafico", "Marcos Rojo", "Ramiro Funes Mori", "Javier Mascherano", "Germán Pezzella", "Cristian Ansaldi", "Manuel Lanzini", "Lucas Biglia", "Giovani Lo Celso", "Ángel Di María", "Guido Pizarro", "Éver Banega", "Leandro Paredes", "Enzo Pérez", "Rodrigo Battaglia", "Pablo Pérez", "Maximiliano Meza", "Ricardo Centurión", "Cristian Pavón", "Lionel Messi", "Paulo Dybala", "Sergio Agüero", "Gonzalo Higuaín", "Diego Perotti", "Mauro Icardi", "Lautaro Martínez", "Hannes Halldorsson", "Runar Alex Runarsson", "Frederik Schram", "Holmar Orn Eyjolfsson", "Sverrir Ingi Ingason", "Hordur Magnusson", "Birkir Saevarsson", "Ragnar Sigurdsson", "Ari Freyr Skulason", "Kari Arnason", "Birkir Bjarnason", "Jon Dadi Bodvarsson", "Samuel Fridjonsson", "Aron Gunnarsson", "Emil Hallfredsson", "Arnor Ingvi Traustason", "Gylfi Sigurdsson", "Olafur Ingi Skulason", "Rurik Gislason", "Albert Gudmundsson", "Johann Berg Gudmundsson", "Alfred Finnbogason", "Bjorn Bergmann Sigurdarson", "Subasic", "Kalinic", "Livakovic", "Karlo Letica", "Vedran Corluka", "Vida", "Strinić", "Lovren", "Vrsaljko", "Pivaric", "Jedvaj", "Mitrovic", "Borna Barišić", "Zoran Nizic", "Caleta-Car", "Borna Sosa", "Luka Modric", "Mateo Kovacic", "Rakitic", "Badelj", "Brozović", "Marko Horn", "Pašalić", "Filip Bradarić", "Mandzukic", "Perisic", "Kalinic", "Kramarić", "Pjaca", "Rebic ", "Duje Cop", "Ivan Santini", "Ikechukwu Ezenwa", "Francis Uzoho", "Daniel Akpeyi", "Dele Ajiboye", "Abdullahi Shehu", "Tyronne Ebuehi", "Olaoluwa Aina", "Elderson Echiejile", "Brian Idowu", "Chidozie Awaziem", "William Ekong", "Leon Balogun", "Kenneth Omeruo", "Stephen Eze", "Mikel John Obi", "Ogenyi Onazi", "Wilfred Ndidi", "Oghenekaro Etebo", "John Ogu", "Uche Agbo", "Joel Obi", "Mikel Agu", "Ahmed Musa", "Kelechi Iheanacho", "Moses Simon", "Victor Moses", "Odion Ighalo", "Alex Iwobi", "Nwankwo Simeon", "Junior Lokosa", "Alisson", "Ederson", "Cassio", "Miranda", "Marquinhos", "Thiago Silva", "Geromel", "Marcelo", "Filipe Luis", "Fagner", "Danilo", "Casemiro", "Paulinho", "Fernandinho", "Fred", "Renato Augusto", "Willian", "Coutinho", "Neymar", "Gabriel Jesus", "Firmino", "Douglas Costa", "Taison", "Keylor Navas", "Leonel Moreira", "Patrick Pemberton", "Cristian Gamboa", "Ian Smith", "Ronald Matarrita", "Bryan Oviedo", "Óscar Duarte", "Giancarlo González", "Francisco Calvo", "Kendall Waston", "Johnny Acosta", "David Guzmán", "Yeltsin Tejeda", "Celso Borges", "Randall Azofeifa", "Rodney Wallace", "Bryan Ruiz", "Christian Bolaños", "Daniel Colindres", "Johan Venegas", "Joel Campbell", "Marco Ureña", "Bernd Leno", "Manuel Neuer", "Marc-Andre ter Stegen", "Kevin Trapp", "Matthias Ginter", "Jonas Hector", "Jerome Boateng", "Mats Hummels", "Niklas Sule", "Joshua Kimmich", "Marvin Plattenhardt", "Antonio Rudiger", "Jonathan Tah", "Julian Brandt", "Julian Draxler", "Mario Gomez", "Leon Goretzka", "Ilkay Gundogan", "Leroy Sane", "Sami Khedira", "Toni Kroos", "Thomas Muller", "Sebastian Rudy", "Mesut Ozil", "Nils Petersen", "Marco Reus", "Timo Werner", "Guillermo Ochoa", "Hugo Ayala", "Diego Reyes", "Hector Moreno", "Jesus Gallardo", "Miguel Layun", "Carlos Salcedo", "Jonathan dos Santos", "Giovani dos Santos", "Andres Guardado", "Hector Herrera", "Javier Aquino", "Jesus Corona", "Hirving Lozano", "Raul Jimenez", "Carlos Vela", "Javier Hernandez", "Oribe Peralta", "Zlatan Ibrahimovic", "Kim Seung-gyu", "Kim Jin-hyeon", "Cho Hyun-woo", "Kim young-gwon", "Jang Hyun-soo", "Jung Seung-hyun", "Yun Yong-sun", "Kwon Kyung-won", "Oh Ban-suk", "Kim Jin-su", "Kim Min-woo", "Park Joo-ho", "Hong Chul", "Lee Yong", "Go Yo-han", "Ki Sung-yueng", "Jung Woo-young", "Kwon Chang-hoon", "Ju Se-jong", "Koo Ja-cheol", "Lee Jae-sung", "Lee Seung-woo", "Lee Chung-yong", "Moon Seon-min", "Kim Shin-wook", "Son Heung-min", "Lee Keun-ho", "Hwang Hee-chan", "Thibaut Courtois", "Toby Alderweireld", "Thomas Vermaelen", "Jan Vertonghen", "Vincent Kompany", "Thomas Meunier", "Axel Witsel", "Radja Nainggolan", "Kevin De Bruyne", "Marouane Fellaini", "Youri Tielemans", "Mousa Dembele", "Nacer Chadli", "Eden Hazard", "Yannick Carrasco", "Dries Mertens", "Michy Batshuayi", "Romelu Lukaku", "José Calderón", "Jaime Penedo", "Alex Rodríguez", "Azmahar Ariano", "Felipe Baloy", "Harold Cummings", "Eric Davis", "Fidel Escobar", "Luis Ovalle", "Francisco Palacios", "Richard Peralta", "Román Torres", "Ricardo Ávila", "Edgar Barcenas", "Ricardo Buitrago", "Miguel Camargo", "Adalberto Carrasquilla", "Armando Cooper", "Aníbal Godoy", "Gabriel Gómez", "José González", "Cristian Martínez", "Valentín Pimentel", "Alberto Quintero", "José Luis Rodríguez", "Abdiel Arroyo", "Ronaldo Blackburn", "Ismael Díaz", "José Fajardo", "Roberto Nurse", "Blas Pérez", "Luis Tejada", "Gabriel Torres", "Aymen Mathlouthi", "Mouez Hassen", "Farouk Ben Mustapha", "Moez Ben Chrifia", "Syam Ben Youssef", "Yohan Benalouane", "Yassine Meriah", "Bilel Moshni", "Rami Bedoui", "Hamdi Nagguez", "Ali Maaloul", "Khalil Chemmam", "Oussama Haddadi", "Dylan Bronn", "Ellyes Skhiri", "Ferjani Sassi", "Karim Laribi", "Ahmed Khalil", "Mohamed Amine Ben Amor", "Ghailene Chaalali", "Mohamed Larbi", "Anice Badri", "Saif-Eddine Khaoui", "Saber Khalifa", "Naim Sliti", "Fakhreddine Ben Youssef", "Wahbi Khazri", "Bassem Srarfi", "Ahmed Akaichi", "Joe Hart", "Jordan Pickford", "Gary Cahill", "Kyle Walker", "John Stones", "Ryan Bertrand", "Danny Rose", "Phil Jones", "Jordan Henderson", "Alex Oxlade-Chamberlain", "Dele Alli", "Eric Dier", "Adam Lallana", "Jesse Lingard", "Raheem Sterling", "Harry Kane", "Marcus Rashford", "Jamie Vardy", "Bartosz Bialkowski", "Lukasz Fabianski", "Lukasz Skorupski", "Wojciech Szczesny", "Jan Bednarek", "Bartosz Bereszynski", "Thiago Cionek", "Kamil Glik", "Marcin Kaminski", "Tomasz Kedziora", "Lukasz Piszczek", "Artur Jedrzejczyk", "Michal Pazdan", "Jakub Blaszczykowski", "Pawel Dawidowicz", "Przemyslaw Frankowski", "Jacek Goralski", "Kamil Grosicki", "Damian Kadzior", "Grzegorz Krychowiak", "Rafal Kurzawa", "Karol Linetty", "Maciej Makuszewski", "Krzysztof Maczynski", "Slawomir Peszko", "Maciej Rybus", "Sebastian Szymanski", "Piotr Zielinski", "Szymon Zurkowski", "Dawid Kownacki", "Robert Lewandowski", "Arkadiusz Milik", "Krzysztof Piatek", "Lukasz Teodorczyk", "Kamil Wilczek", "Iván Arboleda", "José Fernando Cuadrado", "David Ospina", "Camilo Vargas", "Santiago Arias", "Farid Díaz", "Bernardo Espinosa", "Frank Fabra", "Stefan Medina", "Yerry Mina", "Johan Mojica", "Óscar Murillo", "Davinson Sánchez", "William Tesillo", "Cristian Zapata", "Abel Aguilar", "Wílmar Barrios", "Edwin Cardona", "Juan Guillermo Cuadrado", "Gustavo Cuéllar", "Jefferson Lerma", "Giovanni Moreno", "Sebastián Pérez", "Juan Fernando Quintero", "James Rodríguez", "Carlos Sánchez", "Mateus Uribe", "Carlos Bacca", "Miguel Borja", "Yimmi Chará", "Radamel Falcao García", "Teófilo Gutiérrez", "José Heriberto Izquierdo", "Luis Fernando Muriel", "Duván Zapata"];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("campeon"), countries);
autocomplete(document.getElementById("arquero"), arqueros);
autocomplete(document.getElementById("jugador_joven"), jugadores_jovenes);
autocomplete(document.getElementById("mejor_jugador"), jugadores);
autocomplete(document.getElementById("goleador"), jugadores);
