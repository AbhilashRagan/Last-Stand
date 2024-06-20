var name_01 = document.getElementById("name_01");
var name_02 = document.getElementById("name_02");
var name_03 = document.getElementById("name_03");
var name_04 = document.getElementById("name_04");
var name_05 = document.getElementById("name_05");

var score_01 = document.getElementById("score_01");
var score_02 = document.getElementById("score_02");
var score_03 = document.getElementById("score_03");
var score_04 = document.getElementById("score_04");
var score_05 = document.getElementById("score_05");

var names = window.localStorage.getItem(0).split(",");
var scores = window.localStorage.getItem(1).split(",");

for(let i = 0;i < 5;i++)
{
    for(let j = 0;j < 4;j++)
    {
        if(parseInt(scores[j]) < parseInt(scores[j+1]))
        {
            let tempname = names[j];
            let tempscore = scores[j];
            names[j] = names[j+1];
            scores[j] = scores[j+1];
            names[j+1] = tempname;
            scores[j+1] = tempscore;
            break;
        }   
    }
}

name_01.innerHTML = names[0];
name_02.innerHTML = names[1];
name_03.innerHTML = names[2];
name_04.innerHTML = names[3];
name_05.innerHTML = names[4];

score_01.innerHTML = scores[0];
score_02.innerHTML = scores[1];
score_03.innerHTML = scores[2];
score_04.innerHTML = scores[3];
score_05.innerHTML = scores[4];

function loadHome()
{
    window.location.href = "index.html";
}