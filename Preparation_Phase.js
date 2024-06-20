var canvas = document.getElementById("canvas").getContext("2d");

var player = {
    x : 100,
    y : 600,
    vx : 200,
    scalex : 50,
    scaley : 150,
}

var dt = 0.05;

var isRightPressed = false;
var isLeftPressed = false;
var isClicked = false;

var countBlock = 12;
var blocks = [];

var timer = 20;
var timerIndex = 0;

document.onkeydown = function(key){
    if(key.keyCode == 37)
    {
        isLeftPressed = true;
    }
    else if(key.keyCode == 39)
    {
        isRightPressed = true;
    }
}

document.onkeyup = function(key){
    if(key.keyCode == 37)
    {
        isLeftPressed = false;
    }
    else if(key.keyCode == 39)
    {
        isRightPressed = false;
    }
}

function spawnBlock(x, y)
{
    let canSpawn = true;

    if(countBlock > 0)
    {
        for(let i in blocks)
        {
            let tx = blocks[i].x;
            let ty = blocks[i].y;
            if(x >= tx && x <= tx + blocks[i].scalex && canSpawn)
            {
                canSpawn = false;
                let current = blocks[i];
                current.y -= 50;
                current.scaley += 50;
                blocks.splice(i, 1, current);
                countBlock -= 1;
                break;
            }
        }
        if(canSpawn)
        {
            let block = {
                x : x,
                y : 700,
                scalex : 50,
                scaley : 50
            }
            blocks[blocks.length] = block;
            countBlock -= 1;
        }
        if(blocks.length == 0)
        {
            let block = {
                x : x,
                y : 700,
                scalex : 50,
                scaley : 50
            }
            blocks[blocks.length] = block;
            countBlock -=1
        }
    }
}

document.onmousedown = function(mouse){
    spawnBlock(mouse.clientX, mouse.clientY);
}

function handleTimer()
{
    if(timer > 0)
    {
        timerIndex += 1;
        if(timerIndex == 20)
        {
            timer -= 1;
            timerIndex = 0;
        }
        if(timer == 0)
        {
            timer = -1;
            deployPlayer();
        }
    }
}

function deployPlayer()
{
    let data = "";
    for(let i in blocks)
    {
        let x = blocks[i].x;
        let y = blocks[i].y;
        let scalex = blocks[i].scalex;
        let scaley = blocks[i].scaley;
        let temp = x + ";" + y + ";" + scalex + ";" + scaley;
        data += temp + ",";
    }
    data = data.slice(0, data.length - 1);
    window.sessionStorage.setItem("blocks", data);
    window.location.href = "Main.html";
}

var update = function(){
    handleTimer();
    if(isRightPressed && player.x < 1450)
    {
        player.x += player.vx * dt;
    }
    else if(isLeftPressed && player.x > 0)
    {
        player.x -= player.vx * dt;
    }
    canvas.clearRect(0, 0, 1500, 750);
    canvas.fillRect(player.x, player.y, player.scalex, player.scaley);
    canvas.save();
    canvas.fillStyle = "blue";
    canvas.strokeStyle = "black";
    canvas.lineWidth = "5";
    for(let i in blocks)
    {
        canvas.rect(blocks[i].x, blocks[i].y, blocks[i].scalex, blocks[i].scaley);
        canvas.stroke();
        canvas.fill();
    }
    canvas.restore();
    canvas.font = "40px Arial";
    canvas.fillText("Block: " + countBlock, 10, 40);
    canvas.fillText("Deploy In: " + timer, 10, 80);
}

setInterval(update, 50);