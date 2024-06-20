if(window.localStorage.getItem(0) == null)
{
    window.localStorage.setItem(0, "Player_01,Player_02,Player_03,Player_04,Player_05");
}

if(window.localStorage.getItem(1) == null)
{
    window.localStorage.setItem(1, "0,0,0,0,0");
}

window.sessionStorage.setItem("blocks", "");

var names = window.localStorage.getItem(0).split(",");
var scores = window.localStorage.getItem(1).split(",");

if(window.sessionStorage.getItem("name") == null)
{
    window.sessionStorage.setItem("name", "0," + names[0] + "," + scores[0]); 
}

function loadGame()
{
    window.location.href = "Preparation_Phase.html";
}

function loadChoosePlayer()
{
    window.location.href = "ChoosePlayer.html";
}

function loadLeaderBoard()
{
    window.location.href = "LeaderBoard.html";
}