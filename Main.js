var canvas = document.getElementById("canvas").getContext("2d");
var img1 = document.getElementById("Zombie_01");
var img2 = document.getElementById("Zombie_02");
var img3 = document.getElementById("Zombie_03");
var img4 = document.getElementById("Zombie_04");
var img5 = document.getElementById("Zombie_05");
var scoredisplay = document.getElementById("score");
var pauseplay = document.getElementById("pauseplay");

var playerdetails = window.sessionStorage.getItem("name").split(",");
var playerindex = parseInt(playerdetails[0]);
var playername = playerdetails[1];
var score = parseInt(playerdetails[2]);
var currentScore = 0;

var player = {
    x : 100,
    y : 300,
    vx : 200,
    vy : 0,
    scalex : 50,
    scaley : 150,
    health : 100,
    weaponindex : 0
}

var isLeftPressed = false;
var isRightPressed = false;
var isJumpPressed = false;
var isFalling = true;
var isJetPackEnabled = false;
var isThrusting = false;
var canThrust = true;

var isPaused = false;

var angle = 0;

var gravity = 300;
var dt = 0.05;
var force = -600;

var projectiles = [];
var isLoaded = true;
var recoilTime = 0;
var maxRecoilTimer = 10;

var immunity = 10;
var immunityStagger = 20;

var trajectory = [];

var zombies = [];
var zombiesDying = [];
var zombiesAttacking = [];
var zombiesAttackingBlock = [];

var sessiondata = window.sessionStorage.getItem("blocks");
var split_01 = sessiondata.split(",");
var blocks = [];
for(let i in split_01)
{
    let blockdetails = split_01[i].split(";");
    let details = {
        x : parseInt(blockdetails[0]),
        y : parseInt(blockdetails[1]),
        scalex : parseInt(blockdetails[2]),
        scaley : parseInt(blockdetails[3])
    }
    blocks[blocks.length] = details;
}

if(score > 100)
{
    isJetPackEnabled = true;
}

document.onkeydown = function(key){
    if(key.keyCode == 37)
    {
        isLeftPressed = true;
    }
    else if(key.keyCode == 39)
    {
        isRightPressed = true;
    }
    else if(key.keyCode == 32 && !isFalling && !isThrusting)
    {
        isJumpPressed = true;
    }
    else if(key.keyCode == 38)
    {
        if(isJetPackEnabled)
        {
            isThrusting = true;
        }
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
    else if(key.keyCode == 38)
    {
        isThrusting = false;
    }
}

document.onmousemove = function(mouse){
    let x = mouse.clientX - player.x - player.scalex/2;
    let y = mouse.clientY - player.y - player.scaley/4;
    if(x > 0)
    {
        angle = Math.atan(y/x)*180/Math.PI;
    }
    else
    {
        angle = 180 + Math.atan(y/x)*180/Math.PI;
    }
}

document.onmousedown = function(mouse){
    if(isLoaded)
    {
        spawnProjectile();
        isLoaded = false;
        recoilTime = maxRecoilTimer;
    }
}

function togglePausePlay()
{
    if(!isPaused)
    {
        isPaused = true;
        pauseplay.src = "Resources/Play.png";
    }
    else if(isPaused)
    {
        isPaused = false;
        pauseplay.src = "Resources/Pause.png";
    }
}

function swapweapon()
{
    if(player.weaponindex == 0)
    {
        player.weaponindex = 1;
        maxRecoilTimer = 40;
        console.log("Swapped");
    }
    else if(player.weaponindex == 1)
    {
        player.weaponindex = 0;
        maxRecoilTimer = 10;
        console.log("Swapped");
    }
}

function simulatePhysics()
{
    if(player.y + player.vy*dt < 600)
    {
        player.vy += gravity*dt;
        player.y += player.vy*dt;
    }
    else
    {
        player.vy = 0;
        player.y = 600;
        isFalling = false;
    }

    if(player.y < 50)
    {
        canThrust = false;
    }
    else
    {
        canThrust = true;
    }
}

function spawnProjectile()
{
    let proj = {
        x : player.x + player.scalex/2 + 100*Math.cos(angle*Math.PI/180),
        y : player.y + player.scaley/4 + 100*Math.sin(angle*Math.PI/180),
        angle : angle,
        vx : 500*Math.cos(angle*Math.PI/180),
        vy : 500*Math.sin(angle*Math.PI/180)
    };
    projectiles[projectiles.length] = proj;
}

function projectilePhysics()
{
    for(let i in projectiles)
    {
        projectiles[i].vy += gravity*dt;
        projectiles[i].x += projectiles[i].vx*dt;
        projectiles[i].y += projectiles[i].vy*dt;
        if(projectiles[i].x > 1500 || projectiles[i].x < 0 || projectiles[i].y < 0 || projectiles[i].y > 750)
        {
            projectiles.splice(i, 1);
        }
    }
}

function generatePath()
{
    trajectory = [];
    let x = player.x + player.scalex/2 + 100*Math.cos(angle*Math.PI/180);
    let y = player.y + player.scaley/4 + 100*Math.sin(angle*Math.PI/180);
    let vx = 500*Math.cos(angle*Math.PI/180);
    let vy = 500*Math.sin(angle*Math.PI/180);
    while(y < 750)
    {
        vy += gravity*dt;
        x += vx*dt;
        y += vy*dt;
        trajectory[trajectory.length] = [x, y];
    }
}

function recoilHandler()
{
    if(!isLoaded)
    {
        recoilTime -= 1;
        if(recoilTime == 0)
        {
            isLoaded = true;
        }
    }
}

function spawnZombie(direction)
{
    if(direction == "left")
    {
        let z = {
            img : img1,
            x : -100,
            y : 669,
            scalex : 100,
            scaley : 100,
            frameX : 0,
            facing : "right"
        };
        zombies[zombies.length] = z;
    }
    else if(direction == "right")
    {
        let z = {
            img : img2,
            x : 1500,
            y : 669,
            scalex : 100,
            scaley : 100,
            frameX : 0,
            facing : "left"
        };
        zombies[zombies.length] = z;
    }
}

function moveZombie()
{
    for(let i in zombies)
    {
        if(zombies[i].facing == "right")
        {
            zombies[i].x += 5;
            zombies[i].img = img1;
            zombies[i].frameX += 1;
            if(zombies[i].frameX >= 11)
            {
                zombies[i].frameX = 0;
            }
        }
        else if(zombies[i].facing == "left")
        {
            zombies[i].img = img2;
            zombies[i].x -= 5;
            zombies[i].frameX += 1;
            if(zombies[i].frameX >= 11)
            {
                zombies[i].frameX = 0;
            }
        }
    }
}

function collisionHandler()
{
    for(let i in zombies)
    {
        for(let j in projectiles)
        {
            if(projectiles[j].x > zombies[i].x + 22 && projectiles[j].x < zombies[i].x + 62 + 100 && projectiles[j].y > zombies[i].y + 17)
            {
                projectiles.splice(j, 1);
                killZombie(zombies[i]);
                zombies.splice(i, 1);
                break;
            }
        }
    }
    for(let i in zombiesAttacking)
    {
        for(let j in projectiles)
        {
            if(projectiles[j].x > zombiesAttacking[i].x + 22 && projectiles[j].x < zombiesAttacking[i].x + 62 + 100 && projectiles[j].y > zombiesAttacking[i].y + 17)
            {
                projectiles.splice(j, 1);
                killZombie(zombiesAttacking[i]);
                zombiesAttacking.splice(i, 1);
                break;
            }
        }
    }
    for(let i in zombiesAttackingBlock)
    {
        for(let j in projectiles)
        {
            if(projectiles[j].x > zombiesAttackingBlock[i][0].x + 22 && projectiles[j].x < zombiesAttackingBlock[i][0].x + 62 + 100 && projectiles[j].y > zombiesAttackingBlock[i][0].y + 17)
            {
                projectiles.splice(j, 1);
                zombiesAttackingBlock[i][0].frameX = 1;
                zombiesAttackingBlock[i][0].img = img3;
                zombiesDying[zombiesDying.length] = zombiesAttackingBlock[i][0];
                zombiesAttackingBlock.splice(i, 1);
                break;
            }
        }
    }
}

function killZombie(z)
{
    let zombie = z;
    zombie.img = img3;
    zombie.frameX = 1;
    zombiesDying[zombiesDying.length] = zombie;
}

function animateDying()
{
    for(let i in zombiesDying)
    {
        zombiesDying[i].frameX += 1;
        if(zombiesDying[i].frameX >= 14)
        {
            zombiesDying.splice(i ,1);
            currentScore += 10;
        }
    }
}

function turnZombie()
{
    for(let i in zombies)
    {
        if(player.x - zombies[i].x > 0)
        {
            zombies[i].facing = "right";
        }
        else if(player.x - zombies[i].x < 0)
        {
            zombies[i].facing = "left";
        }
    }
}

function attackZombie()
{
    for(let i in zombies)
    {
        if((zombies[i].x + 100 > player.x + 5 && zombies[i].x < player.x + player.scalex - 5 && player.y > 580))
        {
            zombies[i].frameX = 0;
            if(zombies[i].facing == "right")
            {
                zombies[i].img = img4;
            }
            else if(zombies[i].facing == "left")
            {
                zombies[i].img = img5;
            }
            zombiesAttacking[zombiesAttacking.length] = zombies[i];
            zombies.splice(i, 1);
        }
    }
    for(let i in zombiesAttacking)
    {
        if(!(zombiesAttacking[i].x + 100 > player.x + 5 && zombiesAttacking[i].x < player.x + player.scalex - 5 && player.y > 580))
        {
            zombiesAttacking[i].frameX = 0;
            if(zombiesAttacking[i].facing == "right")
            {
                zombiesAttacking[i].img = img1;
            }
            else if(zombiesAttacking[i].facing == "left")
            {
                zombiesAttacking[i].img = img2;
            }
            zombies[zombies.length] = zombiesAttacking[i];
            zombiesAttacking.splice(i ,1);
        }
    }
    for(let i in zombiesAttacking)
    {
        if(player.x - zombiesAttacking[i].x > 0)
        {
            zombiesAttacking[i].facing = "right";
            zombiesAttacking[i].img = img4;
        }
        else if(player.x - zombiesAttacking[i].x < 0)
        {
            zombiesAttacking[i].facing = "left";
            zombiesAttacking[i].img = img5;
        }
    }
}

function animateAttack()
{
    for(let i in zombiesAttacking)
    {
        zombiesAttacking[i].frameX += 1;
        if(zombiesAttacking[i].frameX >= 11)
        {
            zombiesAttacking[i].frameX = 0;
            if(player.health > 0 && immunity <= 0)
            {
                player.health -= 5;
            }
        }
    }
}

function blockDestruction()
{
    for(let i in zombies)
    {
        for(let j in blocks)
        {
            if(zombies[i].facing == "right")
            {
                if(zombies[i].x + 100 > blocks[j].x && zombies[i].x < blocks[j].x + blocks[j].scalex)
                {
                    zombies[i].frameX = 0;
                    zombies[i].img = img4;
                    zombiesAttackingBlock[zombiesAttackingBlock.length] = [zombies[i], blocks[j]];
                    zombies.splice(i, 1);
                    break;
                }
            }
            else if(zombies[i].facing == "left")
            {
                if(zombies[i].x + 100 > blocks[j].x + blocks[j].scalex && zombies[i].x < blocks[j].x + blocks[j].scalex)
                {
                    zombies[i].frameX = 0;
                    zombies[i].img = img5;
                    zombiesAttackingBlock[zombiesAttackingBlock.length] = [zombies[i], blocks[j], j];
                    zombies.splice(i, 1);
                    break;
                }
            }
        }
    }
}

function animateBlockDestruction()
{
    for(let i in zombiesAttackingBlock)
    {
        zombiesAttackingBlock[i][0].frameX += 1;
        if(zombiesAttackingBlock[i][0].frameX >= 11)
        {
            zombiesAttackingBlock[i][0].frameX = 0;
            zombiesAttackingBlock[i][1].scaley -= 50;
            zombiesAttackingBlock[i][1].y += 50;
            if(zombiesAttackingBlock[i][1].scaley <= 0)
            {
                zombiesAttackingBlock[i][0].frameX = 0;
                if(zombiesAttackingBlock[i][0].facing == "right")
                {
                    zombiesAttackingBlock[i][0].img = img1;
                }
                else if(zombiesAttackingBlock[i][0].facing == "left")
                {
                    zombiesAttackingBlock[i][0].img = img2;
                }
                zombies[zombies.length] = zombiesAttackingBlock[i][0];
                zombiesAttackingBlock.splice(i, 1);
            }
        }
    }
}

function destroyBlocks()
{
    for(let i in blocks)
    {
        if(blocks[i].scaley <= 0)
        {
            blocks.splice(i, 1);
        }
    }
}

function immunityTimer()
{
    if(immunity > 0)
    {
        immunityStagger -= 1;
        if(immunityStagger <= 0)
        {
            immunityStagger = 20;
            immunity -= 1;
        }
    }
}

function gameOverStatus()
{
    if(player.health <= 0)
    {
        let allScores = window.localStorage.getItem(1).split(",");
        if(currentScore > score)
        {
            allScores[playerindex] = currentScore;
            let newallScores = allScores[0] + "," + allScores[1] + "," + allScores[2] + "," + allScores[3] + "," + allScores[4];
            window.localStorage.setItem(1, newallScores);
        }
        window.location.href = "index.html";
    }
}

function spawnHandler()
{
    let random = Math.round(Math.random());
    if(random == 0)
    {
        spawnZombie("left");
    }
    else if(random == 1)
    {
        spawnZombie("right");
    }
}

setTimeout(() => {spawnZombie("left");}, 0);
setTimeout(() => {spawnZombie("left");}, 2000);
setTimeout(() => {spawnZombie("left");}, 4000);
setTimeout(() => {spawnZombie("right");}, 0);
setTimeout(() => {spawnZombie("right");}, 2000);
setTimeout(() => {spawnZombie("right");}, 4000);

var update = function(){
    if(!isPaused)
    {
        canvas.clearRect(0, 0, 1500, 750);

        if(isLeftPressed && player.x > 0)
        {
            player.x -= player.vx * dt;
        }
        else if(isRightPressed & player.x <= 1500 - player.scalex)
        {
            player.x += player.vx * dt;
        }

        if(isJumpPressed && !isFalling)
        {
            isFalling = true;
            isJumpPressed = false;
            player.vy = -300;
        }

        if(isThrusting && canThrust)
        {
            player.vy += force * dt;
            player.y += player.vy * dt;
        }

        simulatePhysics();

        projectilePhysics();

        generatePath();

        recoilHandler();

        collisionHandler();

        moveZombie();

        attackZombie();

        turnZombie();
        
        animateAttack();

        animateDying();

        blockDestruction();

        animateBlockDestruction();

        destroyBlocks();

        immunityTimer();

        gameOverStatus();

        if(player.health > 0)
        {
            canvas.fillStyle = "black";
            canvas.fillRect(player.x, player.y, player.scalex, player.scaley);
            if(player.weaponindex == 0)
            {
                canvas.fillStyle = "red";
            }
            else if(player.weaponindex == 1)
            {
                canvas.fillStyle = "green";
            }
            canvas.save();
            canvas.translate(player.x + player.scalex/2, player.y + player.scaley/4);
            canvas.rotate(angle * Math.PI/180);
            canvas.fillRect(0, -12.5, 100, 25);
            canvas.restore();
        }
        canvas.fillStyle = "red";
        for(let i in projectiles)
        {
            if(projectiles[i].x < 1500 && projectiles[i].x > 0 && projectiles[i].y > 0 && projectiles[i].y < 750 && player.health > 0)
            {
                canvas.beginPath();
                canvas.arc(projectiles[i].x, projectiles[i].y, 8, 0, 2 * Math.PI);
                canvas.fill();
            }
        }
        canvas.fillStyle = "black";
        for(let i in trajectory)
        {
            if(player.health > 0)
            {
                canvas.beginPath();
                canvas.arc(trajectory[i][0], trajectory[i][1], 2, 0, 2 * Math.PI);
                canvas.fill();
            }
        }
        for(let i in zombies)
        {
            if(player.health > 0)
            {
                canvas.drawImage(zombies[i].img, zombies[i].frameX * 900, 0, 900, 900, zombies[i].x, zombies[i].y, zombies[i].scalex, zombies[i].scaley);
            }
        }
        for(let i in zombiesAttacking)
        {
            if(player.health > 0)
            {
                canvas.drawImage(zombiesAttacking[i].img, zombiesAttacking[i].frameX * 900, 0, 900, 900, zombiesAttacking[i].x, zombiesAttacking[i].y, zombiesAttacking[i].scalex, zombiesAttacking[i].scaley);
            }
        }
        for(let i in zombiesDying)
        {
            if(player.health > 0)
            {
                canvas.drawImage(img3, zombiesDying[i].frameX * 900, 0, 900, 900, zombiesDying[i].x, zombiesDying[i].y, zombiesDying[i].scalex, zombiesDying[i].scaley);
            }
        }
        for(let i in zombiesAttackingBlock)
        {
            canvas.drawImage(zombiesAttackingBlock[i][0].img, zombiesAttackingBlock[i][0].frameX * 900, 0, 900, 900, zombiesAttackingBlock[i][0].x, zombiesAttackingBlock[i][0].y, zombiesAttackingBlock[i][0].scalex, zombiesAttackingBlock[i][0].scaley);
        }
        for(let i in blocks)
        {
            canvas.fillStyle = "blue";
            canvas.strokeStyle = "black";
            canvas.lineWidth = "5";
            canvas.rect(blocks[i].x, blocks[i].y, blocks[i].scalex, blocks[i].scaley);
            canvas.stroke();
            canvas.fill();
        }
        canvas.fillStyle = "black";
        canvas.font = "40px Arial";
        canvas.fillText("Health: " + player.health, 10, 40);
        if(immunity > 0)
        {
            canvas.fillText("Immunity: " + immunity, 10, 80);
        }
        scoredisplay.innerHTML = currentScore;
        console.log(maxRecoilTimer);
    }
}

setInterval(update, 50);
setInterval(spawnHandler, 3000);