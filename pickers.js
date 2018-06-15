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

function User(name, points){
  this.name = name;
  this.points = points;
}

function add_user(name, points){
  var user = new User(name, points);
  users.push(user);
}

// Scores
const totalIndexes = 19; // cambiar esto a 48 una vez todos los ids en pickers.html esten bienc
var Ngames;

var reference = database.ref().child("Scores").once('value', function(snap){
  var data = Object.keys(snap.val());
  for(var i = 0; i < data.length; i++){
    if(data[i] != "Ngames" && data[i] != "points"){
      var game = snap.val()[data[i]];
      var homeTeam = game.home;
      var awayTeam = game.away;
      var homeScore = game.home_score;
      var awayScore = game.away_score;
      if(homeScore != "vacio" && awayScore != "vacio"){
        var index;
        if(data[i].length == 5){
          index = data[i].slice(4,5);
        }
        else{
          index = data[i].slice(4,6);
        }
        document.getElementById("R"+index+"H").innerHTML = homeScore;
        document.getElementById("R"+index+"A").innerHTML = awayScore;
      }
    }
  }
  Object.keys(snap.val()).length;
});

// function games(){
//   var numberOfGames = 48;
//   for(var i = 1; i < 20; i++){
//     var homeResult = document.getElementById("R"+i+"H").innerHTML;
//     var awayResult = document.getElementById("R"+i+"A").innerHTML;
//     console.log(i);
//     if(homeResult.length > 2 && awayResult.length > 2){
//       console.log(document.getElementById("PickR"+2+"H").value);
//     }
//   }
// }

function submitResults(){
  if (verifySubmission()){
    var ref = database.ref().child("Scores").once('value', function(snap){
      Ngames_db = snap.val().Ngames;
      for(var i = 1; i < totalIndexes+1; i++){
        if(document.getElementById("R"+i+"H").innerHTML.length > 2){
          var home_team = document.getElementById("PickT"+i+"H").innerHTML;
          var away_team = document.getElementById("PickT"+i+"A").innerHTML;
          var home_goals = document.getElementById("PickR"+i+"H").value;
          var away_goals = document.getElementById("PickR"+i+"A").value;
          var game_name = "Game"+i;
          var games = database.ref().child("Scores").child(game_name).update({
              home: home_team,
              away: away_team,
              home_score: home_goals,
              away_score: away_goals,
            });
      }
    }
    var numberOfGames = totalIndexes;
    for(var i = 1; i < totalIndexes+1; i++){
      var homeResult = document.getElementById("R"+i+"H").innerHTML;
      var awayResult = document.getElementById("R"+i+"A").innerHTML;
      console.log(i);
      if(homeResult.length > 2 && awayResult.length > 2){
        if(document.getElementById("PickR"+i+"H").value == "vacio" &&
           document.getElementById("PickR"+i+"A").value == "vacio"){
             numberOfGames--;
        }
      }
    }
    var ref2 = database.ref().child("Scores").update({
      Ngames: numberOfGames
    });
    });
  }
}

function verifySubmission(){
  var pass = document.getElementsByName("password")[0].value;
  if(pass == "paolotastas"){
    return true;
  }
  return false;
}



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
var countries = ["Rusia","Arabia S.","Egipto","Uruguay","Portugal","España","Marruecos","Iran",
"Francia","Australia","Peru","Dinamarca","Argentina","Islandia","Croacia","Nigeria",
"Brasil","Suiza","Costa Rica","Serbia","Alemania","Mexico","Suecia","Corea","Belgica",
"Panama","Tunez","Inglaterra","Polonia","Senegal","Colombia","Japon"];

var arqueros = ["Igor Akinfeev", "Vladimir Gabulov", "Soslan Dzhanaev", "Essam El Hadary", "Mohamed El-Shennawy", "Sherif Ekramy", "Fernando Muslera", "Anthony Lopes", "Beto", "Rui Patricio", "David de Gea", "Alireza Beiranvand", "Seyed Hossein Hosseini", "Rashid Mazaheri", "Hugo Lloris", "Mat Ryan", "Danny Vukovic", "Brad Jones", "Pedro Gallese", "Carlos Caceda", "Jose Carvallo", "Kasper Schmeichel", "Jonas Lossl", "Frederik Ronow", "Nahuel Guzman", "Willy Caballero", "Franco Armani", "Hannes Halldorsson", "Runar Alex Runarsson", "Frederik Schram", "Subasic", "Kalinic", "Livakovic", "Ikechukwu Ezenwa", "Francis Uzoho", "Daniel Akpeyi", "Alisson", "Ederson", "Cassio", "Keylor Navas", "Leonel Moreira", "Patrick Pemberton", "Bernd Leno", "Manuel Neuer", "Marc-Andre ter Stegen", "Guillermo Ochoa", "Kim Seung-gyu", "Kim Jin-hyeon", "Cho Hyun-woo", "Thibaut Courtois", "Jose Calderon", "Jaime Penedo", "Alex Rodriguez", "Aymen Mathlouthi", "Mouez Hassen", "Farouk Ben Mustapha", "Joe Hart", "Jordan Pickford", "Bartosz Bialkowski", "Lukasz Fabianski", "Lukasz Skorupski", "Ivan Arboleda", "Jose Fernando Cuadrado", "David Ospina"];

var jugadores_jovenes = ["Gabriel Jesus","Bassem Srarfi","Luka Jovic","Nicola Milenkovic","Dawid Kownacki","Ismael Diaz","Chidozie Awaziem","Youssef En Nesyri","Amine Harit","Hamza Mendyl","Edson Alvarez","Albert Gudmundsson","Moussa Wague","Ismaila Sarr","Jose Luis Rodriguez","Francis Uzoho","Lee Seung-woo","Daniel Arzani","Trent Alexander-Arnold","Ian Smith","Kasper Dolberg","Rodrigo Betancur","Ruben Dias","Achraf Hakimi","Kylian Mbappe", "Ousmane Dembele", "Breel Embolo","Youri Tielemans","Marcus Rashford","Sobhy Ramadan"];

var jugadores = ["Manuel Neuer" , "Bernd Leno" , "Marc-Andre ter Stegen" , "Kevin Trapp" , "Jerome Boateng" , "Matthias Ginter " , "Jonas Hector " , "Mats Hummels" , "Joshua Kimmich" , "Antonio Rudiger" , "Niklas Sule" , "Marvin Plattenhardt" , "Jonathan Tah" , "Julian Brandt" , "Julian Draxler" , "Serge Gnabry" , "Leon Goretzka" , " Sami Khedira" , "Toni Kroos" , "Mesut Ozil" , "Sebastian Rudy" , "Ilkay Gundogan" , "Marco Reus" , "Leroy Sane" , "Mario Gomez" , "Timo Werner" , "Thomas Muller" , "Nils Petersen" , "Assaf Al-Qarny" , "Mohammed Al-Owais" , "Yasser Al-Musailem" , "Abdullah Al-Mayuf" , "Mansoor Al-Harbi" , "Yasser Al-Shahrani" , "Mohammed Al-Breik" , "Saeed Al-Mowalad" , "Motaz Hawsawi" , "Osama Hawsawi" , "Omar Hawsawi" , "Mohammed Jahfali" , "Ali Al-Bulaihi" , "Abdullah Al-Khaibari" , "Abdulmalek Al-Khaibri" , "Abdullah Otayf" , "Taiseer Al-Jassim" , "Houssain Al-Mogahwi" , "Salman Al-Faraj" , "Nawaf Al-Abed" , "Mohamed Kanno" , "Hattan Bahebri" , "Mohammed Al-Kwikbi" , "Salem Al-Dawsari" , "Yehya Al-Shehri" , "Fahad Al-Muwallad" , "Mohammad Al-Sahlawi" , "Muhannad Assiri" , "Sergio Romero" , "Willy Caballero" , "Franco Armani" , "Gabriel Mercado" , "Eduardo Salvio" , "Federico Fazio" , "Nicolas Otamendi" , "Marcos Acuña" , "Nicolas Tagliafico" , "Marcos Rojo" , "Javier Mascherano" , "Cristian Ansaldi" , "Manuel Lanzini" , "Lucas Biglia" , "Giovani Lo Celso" , "Angel Di Maria" , "Ever Banega" , "Maximiliano Meza" , "Cristian Pavon" , "Lionel Messi" , "Paulo Dybala" , "Sergio Aguero" , "Gonzalo Higuain" , "Matt Ryan" , "Brad Jones" , "Danny Vukovic" , "Trent Sainsbury" , "Matthew Jurman" , "Milos Degenek" , "Joshua Risdon" , "Aziz Behich" , "James Meredith" , "Fran Karacic" , "Mile Jedinak" , "Aaron Mooy" , "Tom Rogic" , "Massimo Luongo" , "Jackson Irvine" , "Joshua Brillante" , "Dimi Petratos" , "Mark Milligan" , "Tim Cahill" , "Tomi Juric" , "Mathew Leckie" , "James Troisi" , "Daniel Arzani" , "Andrew Nabbout" , "Nikita Rukavytsya" , "Robbie Kruse" , "Alisson" , "Ederson" , "Cassio" , "Miranda" , "Marquinhos" , "Thiago Silva" , "Geromel" , "Marcelo" , "Filipe Luis" , "Fagner" , "Danilo" , "Casemiro" , "Paulinho" , "Fernandinho" , "Fred" , "Renato Augusto" , "Willian" , "Coutinho" , "Neymar" , "Gabriel Jesus" , "Roberto Firmino" , "Douglas Costa" , "Taison" , "Ivan Arboleda" , "Jose Fernando Cuadrado" , "David Ospina" , "Camilo Vargas" , "Santiago Arias" , "Farid Diaz" , "Bernardo Espinosa" , "Frank Fabra" , "Stefan Medina" , "Yerry Mina" , "Johan Mojica" , "Oscar Murillo" , "Davinson Sanchez" , "William Tesillo" , "Cristian Zapata" , "Abel Aguilar" , "Wilmar Barrios" , "Edwin Cardona" , "Juan Guillermo Cuadrado" , "Gustavo Cuellar" , "Jefferson Lerma" , "Giovanni Moreno" , "Sebastian Perez" , "Juan Fernando Quintero" , "James Rodriguez" , "Carlos Sanchez" , "Mateus Uribe" , "Carlos Bacca" , "Miguel Borja" , "Yimmi Chara" , "Radamel Falcao Garcia" , "Teofilo Gutierrez" , "Jose Heriberto Izquierdo" , "Luis Fernando Muriel" , "Duvan Zapata" , "Kim Seung-gyu" , "Kim Jin-hyeon" , "Cho Hyun-woo" , "Kim young-gwon" , "Jang Hyun-soo" , "Jung Seung-hyun" , "Yun Yong-sun" , "Kwon Kyung-won" , "Oh Ban-suk" , "Kim Jin-su" , "Kim Min-woo" , "Park Joo-ho" , "Hong Chul" , "Lee Yong" , "Go Yo-han" , "Ki Sung-yueng" , "Jung Woo-young" , "Kwon Chang-hoon" , "Ju Se-jong" , "Koo Ja-cheol" , "Lee Jae-sung" , "Lee Seung-woo" , "Lee Chung-yong" , "Moon Seon-min" , "Kim Shin-wook" , "Son Heung-min" , "Lee Keun-ho" , "Hwang Hee-chan" , "Keylor Navas" , "Leonel Moreira" , "Patrick Pemberton" , "Cristian Gamboa" , "Ian Smith" , "Ronald Matarrita" , "Bryan Oviedo" , "oscar Duarte" , "Giancarlo Gonzalez" , "Francisco Calvo" , "Kendall Waston" , "Johnny Acosta" , "David Guzman" , "Yeltsin Tejeda" , "Celso Borges" , "Randall Azofeifa" , "Rodney Wallace" , "Bryan Ruiz" , "Christian Bolaños" , "Daniel Colindres" , "Johan Venegas" , "Joel Campbell" , "Marco Ureña" , "Subasic" , "Kalinic" , "Livakovic" , "Karlo Letica" , "Vedran Corluka" , "Vida" , "Strinic" , "Lovren" , "Vrsaljko" , "Pivaric" , "Jedvaj" , "Mitrovic" , "Borna Barisic" , "Zoran Nizic" , "Caleta-Car" , "Borna Sosa" , "Luka Modric" , "Mateo Kovacic" , "Rakitic" , "Badelj" , "Brozovic" , "Marko Horn" , "Pasalic" , "Filip Bradaric" , "Mandzukic" , "Perisic" , "Kalinic" , "Kramaric" , "Pjaca" , "Rebic" , "Duje Cop" , "Ivan Santini" , "Kasper Schmeichel" , "Jonas Lossl" , "Frederik Ronow" , "Jesper Hansen" , "Simon Kjaer" , "Andreas Christensen" , "Mathias Jorgensen" , "Jannik Vestergaard" , "Andreas Bjelland" , "Henrik Dalsgaard" , "Peter Ankersen" , "Jens Stryger" , "Riza Durmisi" , "Jonas Knudsen" , "Nicolai Boilesen" , "William Kvist" , "Thomas Delaney" , "Lukas Lerager" , "Lasse Schone" , "Mike Jensen" , "Christian Eriksen" , "Daniel Wass" , "Pierre-Emile Hojbjerg" , "Mathias Jensen" , "Michael Krohn-Dehli" , "Robert Skov" , "Pione Sisto" , "Martin Braithwaite" , "Andreas Cornelius" , "Viktor Fischer" , "Yussuf Poulsen" , "Nicolai Jorgensen" , "Nicklas Bendtner" , "Kasper Dolberg" , "Kenneth Zohore" , "Hugo Lloris" , "Steve Mandanda" , "Alphonse Areola" , "Benjamin Pavard" , "Presnel Kimpembe" , "Adil Rami" , "Benjamin Mendy" , "Lucas Hernandez" , "Djibril Sidibe" , "Samuel Umtiti" , "Raphaël Varane" , "N'Golo Kante" , "Blaise Matuidi" , "Paul Pogba" , "Corentin Tolisso" , "Steven N'Zonzi" , "Ousmane Dembele" , "Olivier Giroud" , "Antoine Griezmann" , "Kylian Mbappe" , "Thomas Lemar" , "Nabil Fekir" , "Florian Thauvin" , "Jack Butland" , "Jordan Pickford" , "Nick Pope" , "Trent Alexander-Arnold" , "Gary Cahill" , "Kyle Walker" , "John Stones" , "Harry Maguire" , "Kieran Trippier" , "Danny Rose" , "Phil Jones" , "Ashley Young" , "Eric Dier" , "Dele Alli" , "Jesse Lingard" , "Jordan Henderson" , "Fabian Delph" , "Ruben Loftus-Cheek" , "Jamie Vardy" , "Marcus Rashford" , "Raheem Sterling" , "Danny Welbeck" , "Harry Kane" , "Hannes Halldorsson" , "Runar Alex Runarsson" , "Frederik Schram" , "Holmar Orn Eyjolfsson" , "Sverrir Ingi Ingason" , "Hordur Magnusson" , "Birkir Saevarsson" , "Ragnar Sigurdsson" , "Ari Freyr Skulason" , "Kari Arnason" , "Birkir Bjarnason" , "Jon Dadi Bodvarsson" , "Samuel Fridjonsson" , "Aron Gunnarsson" , "Emil Hallfredsson" , "Arnor Ingvi Traustason" , "Gylfi Sigurdsson" , "Olafur Ingi Skulason" , "Rurik Gislason" , "Albert Gudmundsson" , "Johann Berg Gudmundsson" , "Alfred Finnbogason" , "Bjorn Bergmann Sigurdarson" , "Munir" , "Bono" , "Ahmed Reda Tagnaouti" , "Mehdi Benatia" , "Romain Saiss" , "Manuel Da Costa" , "Badr Benoun" , "Nabil Dirar" , "Achraf Hakimi" , "Hamza Mendyl" , "Mbark Boussoufa" , "Karim El Ahmadi" , "Youssef Ait Bennasser" , "Sofian Amrabat" , "Younes Belhanda" , "Fayçal Fajr" , "Amine Harit" , "Khalid Boutaib" , "Aziz Bouhaddouz" , "Ayoub El Kaabi" , "Nordin Amrabat" , "Hakim Ziyech" , "Mehdi Carcela" , "Guillermo Ochoa" , "Jose de Jesus Corona" , "Alfredo Talavera" , "Carlos Salcedo" , "Nestor Araujo" , "Diego Reyes" , "Hector Moreno" , "Hugo Ayala" , "Oswaldo Alanis" , "Edson Alvarez" , "Jesus Gallardo" , "Miguel Layun" , "Jesus Molina" , "Rafael Marquez" , "Hector Herrera" , "Jonathan Dos Santos" , "Andres Guardado" , "Erick Gutierrez" , "Marco Fabian" , "Giovanni Dos Santos" , "Javier Hernandez" , "Raul Jimenez" , "Oribe Peralta" , "Jesus Manuel Corona" , "Carlos Vela" , "Javier Aquino" , "Hirving Lozano" , "Jurgen Damm" , "Ikechukwu Ezenwa" , "Francis Uzoho" , "Daniel Akpeyi" , "Dele Ajiboye" , "Abdullahi Shehu" , "Tyronne Ebuehi" , "Olaoluwa Aina" , "Elderson Echiejile" , "Brian Idowu" , "Chidozie Awaziem" , "William Ekong" , "Leon Balogun" , "Kenneth Omeruo" , "Stephen Eze" , "Mikel John Obi" , "Ogenyi Onazi" , "Wilfred Ndidi" , "Oghenekaro Etebo" , "John Ogu" , "Uche Agbo" , "Joel Obi" , "Mikel Agu" , "Ahmed Musa" , "Kelechi Iheanacho" , "Moses Simon" , "Victor Moses" , "Odion Ighalo" , "Alex Iwobi" , "Nwankwo Simeon" , "Junior Lokosa" , "Jose Calderon" , "Jaime Penedo" , "Alex Rodriguez" , "Azmahar Ariano" , "Felipe Baloy" , "Harold Cummings" , "Eric Davis" , "Fidel Escobar" , "Luis Ovalle" , "Francisco Palacios" , "Richard Peralta" , "Roman Torres" , "Ricardo avila" , "Edgar Barcenas" , "Ricardo Buitrago" , "Miguel Camargo" , "Adalberto Carrasquilla" , "Armando Cooper" , "Anibal Godoy" , "Gabriel Gomez" , "Jose Gonzalez" , "Cristian Martinez" , "Valentin Pimentel" , "Alberto Quintero" , "Jose Luis Rodriguez" , "Abdiel Arroyo" , "Ronaldo Blackburn" , "Ismael Diaz" , "Jose Fajardo" , "Roberto Nurse" , "Blas Perez" , "Luis Tejada" , "Gabriel Torres" , "Pedro Gallese" , "Carlos Caceda" , "Jose Carvallo" , "Aldo Corzo" , "Luis Advincula" , "Miguel Araujo" , "Alberto Rodriguez" , "Christian Ramos" , "Anderson Santamaria" , "Paolo Guerrero" , "Miguel Trauco" , "Nilson Loyola" , "Renato Tapia" , "Pedro Aquino" , "Yoshimar Yotun" , "Sergio Peña" , "Edison Flores" , "Paolo Hurtado" , "Wilder Cartagena" , "Christian Cueva" , "Andre Carrillo" , "Jefferson Farfan" , "Andy Polo" , "Raul Ruidiaz" , "Bartosz Bialkowski" , "Lukasz Fabianski" , "Lukasz Skorupski" , "Wojciech Szczesny" , "Jan Bednarek" , "Bartosz Bereszynski" , "Thiago Cionek" , "Kamil Glik" , "Marcin Kaminski" , "Tomasz Kedziora" , "Lukasz Piszczek" , "Artur Jedrzejczyk" , "Michal Pazdan" , "Jakub Blaszczykowski" , "Pawel Dawidowicz" , "Przemyslaw Frankowski" , "Jacek Goralski" , "Kamil Grosicki" , "Damian Kadzior" , "Grzegorz Krychowiak" , "Rafal Kurzawa" , "Karol Linetty" , "Maciej Makuszewski" , "Krzysztof Maczynski" , "Slawomir Peszko" , "Maciej Rybus" , "Sebastian Szymanski" , "Piotr Zielinski" , "Szymon Zurkowski" , "Dawid Kownacki" , "Robert Lewandowski" , "Arkadiusz Milik" , "Krzysztof Piatek" , "Lukasz Teodorczyk" , "Kamil Wilczek" , "Anthony Lopes" , "Beto" , "Rui Patricio" , "Bruno Alves" , "Cedric Soares" , "Jose Fonte" , "Mario Rui" , "Pepe" , "Raphael Guerreiro" , "Ricardo Pereira" , "Ruben Dias" , "Adrien Silva" , "Bruno Fernandes" , "Joao Mario" , "Joao Moutinho" , "Manuel Fernandes" , "William Carvalho" , "Andre Silva" , "Bernardo Silva" , "Cristiano Ronaldo" , "Gelson Martins" , "Gonçalo Guedes" , "Ricardo Quaresma" , "Igor Akinfeev" , "Vladimir Gabulov" , "Soslan Dzhanaev" , "Andrey Lunev" , "Vladimir Granat" , "Ruslan Kambolov" , "Fedor Kudryashov" , "Ilya Kutepov" , "Roman Neustadter" , "Konstantin Rausch" , "Andrey Semenov" , "Igor Smolnikov" , "Mario Fernandes" , "Yuri Gazinskiy" , "Alexsandr Golovin" , "Alan Dzagoev" , "Alexsandr Erokhin" , "Yuri Zhirkov" , "Daler Kuzyaev" , "Roman Zobnin" , "Alexsandr Samedov" , "Anton Miranchuk" , "Alexsandr Tashaev" , "Denis Cheryshev" , "Artem Dzyuba" , "Aleksey Miranchuk" , "Fedor Smolov" , "Fedor Chalov" , "Abdoulaye Diallo" , "Alfred Gomis" , "Khadim Ndiaye" , "Lamine Gassama" , "Saliou Ciss" , "Kalidou Koulibaly" , "Kara Mbodii" , "Youssouf Sabaly" , "Salif Sane" , "Moussa Wague" , "Idrissa Gueye" , "Cheikhou Kouyate" , "Alfred Ndiaye" , "Badou Ndiaye" , "Cheikh Ndoye" , "Ismaila Sarr" , "Keita Balde" , "Mame Biram Diouf" , "Moussa Konate" , "Sadio Mane" , "Mbaye Niang" , "Diafra Sakho" , "Moussa Sow" , "Robin Olsen" , "Karl-Johan Johnsson" , "Kristoffer Nordfeldt" , "Mikael Lustig" , "Victor Nilsson Lindelof" , "Andreas Granqvist" , "Martin Olsson" , "Ludwig Augustinsson" , "Filip Helander" , "Emil Krafth" , "Pontus Jansson" , "Victor Claesson" , "Jimmy Durmaz" , "Emil Forsberg" , "Sebastian Larsson" , "Gustav Svensson" , "Albin Ekdal" , "Oscar Hiljemark" , "Marcus Rohden" , "Marcus Berg" , "John Guidetti" , "Isaac Kiese Thelin" , "Ola Toivonen" , "Aymen Mathlouthi" , "Moez Ben Cherifia" , "Moez Hassen" , "Farouk Ben Mustapha" , "Hamdi Nagguez" , "Dylan Bron" , "Rami Bedoui" , "Yohan Ben Alouane" , "Syam Ben Youssef" , "Yassine Meriah" , "Bilel Mohsni" , "Khalil Chammam" , "Oussama Haddadi" , "Ali Maâloul" , "Elyes Skhiri" , "Mohamed Amine Ben Amor" , "Ghaylane Chaâlali" , "Karim Laâribi" , "Ferjani Sassi" , "Ahmed Khalil" , "Seifeddine El Khaoui" , "Mohamed Wael Laârbi" , "Fakhreddine Ben Youssef" , "Anis Badri" , "Bassem Srarfi" , "Ahmed Akaichi" , "Naim Sliti" , "Saber Khelifa" , "Wahbi Khazri" , "Fernando Muslera" , "Martin Silva" , "Martin Campana" , "Diego Godin" , "Sebastian Coates" , "Jose Maria Gimenez" , "Maximiliano Pereira" , "Gaston Silva" , "Martin Caceres" , "Guillermo Varela" , "Nahitan Nandez" , "Lucas Torreira" , "Matias Vecino" , "Federico Valverde" , "Rodrigo Betancur" , "Carlos Sanchez" , "Gaston Ramirez" , "Nicolas Lodeiro" , "Jonathan Urretaviscaya" , "Giorgian de Arrascaeta" , "Diego Laxalt" , "Cristian Rodriguez" , "Christian Stuani" , "Edinson Cavani" , "Maximiliano Gomez" , "Luis Suarez" , "David de Gea" ,"Pepe Reina", "Kepa", "Jordi Alba" , "Nacho" , "Nacho Monreal" , "Gerard Pique" , "Sergio Ramos" , "Daniel Carvajal" ,"Alvaro Odriozola","Sergio Busquets" , "Thiago Alcantara" , "Francisco Alracón (Isco)" , "Koke" , "Marco Asensio" , "Andres Iniesta" , "David Silva" , "Saul Niguez" ,"Lucas Vasquez" ,"Rodrigo Moreno" , "Iago Aspas" , "Diego Costa" , "Thibaut Courtois" ,"Simon Mignolet","Koen Casteels", "Toby Alderweireld" , "Thomas Vermaelen" , "Jan Vertonghen" , "Vincent Kompany" ,"Dedryck Boyata", "Thomas Meunier" ,"Leander Dendoncker", "Axel Witsel" , "Jordan Lukaku" , "Kevin De Bruyne" , "Marouane Fellaini" ,"Christian Kabasele","Matz Sels","Laurent Ciman","Thorgan Hazard","Adnan Januzaj" ,"Youri Tielemans" , "Mousa Dembele" , "Nacer Chadli" , "Eden Hazard" , "Yannick Carrasco" , "Dries Mertens" , "Michy Batshuayi","Christian Benteke" , "Romelu Lukaku","Sobhy Ramadan","Youssef En Nesyri","Nicola Milenkovic","Luka Jovic"];

/*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
autocomplete(document.getElementById("campeon"), countries);
autocomplete(document.getElementById("tercero"), countries);
autocomplete(document.getElementById("arquero"), arqueros);
autocomplete(document.getElementById("jugador_joven"), jugadores_jovenes);
autocomplete(document.getElementById("mejor_jugador"), jugadores);
autocomplete(document.getElementById("goleador"), jugadores);
