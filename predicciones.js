function User(username, password){
  this.username = username;
  this.password = password;
  this.name = "";
  this.lastname = "";
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
add_team("Iran", 1, 8);

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
