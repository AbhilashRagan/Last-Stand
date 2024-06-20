var name_01 = document.getElementById("name_01");
var name_02 = document.getElementById("name_02");
var name_03 = document.getElementById("name_03");
var name_04 = document.getElementById("name_04");
var name_05 = document.getElementById("name_05");
var currentPlayer = document.getElementById("currentPlayer");
var currentPlayerIndex = 0;

var names = window.localStorage.getItem(0).split(",");
var scores = window.localStorage.getItem(1).split(",");

name_01.value = names[0];
name_02.value = names[1];
name_03.value = names[2];
name_04.value = names[3];
name_05.value = names[4];

currentPlayer.innerHTML = names[currentPlayerIndex];

function loadHome()
{
    window.location.href = "index.html";
}

function changeName_01()
{
    names[0] = name_01.value;
}

function changeName_02()
{
    names[1] = name_02.value;
}

function changeName_03()
{
    names[2] = name_03.value;
}

function changeName_04()
{
    names[3] = name_04.value;
}

function changeName_05()
{
    names[4] = name_05.value;
}

function saveGame()
{
    let data = names[0] + "," + names[1] + "," + names[2] + "," + names[3] + "," + names[4];
    window.localStorage.setItem(0, data);
}

function moveRight()
{
    currentPlayerIndex += 1;
    if(currentPlayerIndex > 4)
    {
        currentPlayerIndex = 0;
    }
    currentPlayer.innerHTML = names[currentPlayerIndex];
    window.sessionStorage.setItem("name", currentPlayerIndex + "," + names[currentPlayerIndex] + "," + scores[currentPlayerIndex]);
}

function moveLeft()
{
    currentPlayerIndex -= 1;
    if(currentPlayerIndex < 0)
    {
        currentPlayerIndex = 4;
    }
    currentPlayer.innerHTML = names[currentPlayerIndex];
    window.sessionStorage.setItem("name", names[currentPlayerIndex]);
}