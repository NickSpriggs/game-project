const startArray = [2,3,4,5,6,7,8,9,20,30,40,50,60,70,80,90,11,21,31,41,51,61,71,81,92,93,94,95,96,97,98,99];
const goingLeft = [20,30,40,50,60,70,80,90];
const goingRight = [11,21,31,41,51,61,71,81];
const goingUp = [92,93,94,95,96,97,98,99];
const goingDown = [2,3,4,5,6,7,8,9];
var mineCounter = 0;
var gameSpaceArray = [];
var tankStartPositions = [];
var tankTrackerArray = [];
var killTracker = 0;
var noRunningTanks = true;

 function setGameBoxes () {
//window.onload = function(){
    document.getElementById("gameSpace").outerHTML = '<div id="gameSpace" class="map"></div>';
    var gameSpace = document.getElementById("gameSpace");

    for (i=0; i <  100; i++) {

        var boxNumber = (i + 1);
        var boxDiv = '<div id=' + 'GB' + (i) + ' class="gameBox" onclick="setMine(' + (i) + ')">' + '</div>'; 
        //var boxDiv = '<div id=' + 'GB' + (i + 1) + ' class="gameBox">' + (i + 1) + '</div>'; 
        gameSpace.innerHTML += boxDiv;

        boxDivObject = {
            name: "Box #" + (boxNumber), 
            boxType: "empty",
            direction: "none",
            destination: "departing"
        };
        this.gameSpaceArray.push(boxDivObject); 
    } 
};

function randomInt() {
    //     random number from either 1-10 / 10s-100 / 91-100 / 1-11-21-31-41...91 to start:
    // (2/3/4/5/6/7/8/9/20/30/40/50/60/70/80/90/11/21/31/41/51/61/71/81/92/93/94/95/96/97/98/99) | [1][10[91][100]
    var startNumber = 0;
    var workingNumberBoolean = false;

    while (workingNumberBoolean == false) {
        startNumber = Math.floor(Math.random() * 101);

        for (i=0; i < startArray.length; i++) {

            if (startNumber == startArray[i]) {
                workingNumberBoolean = true;
            }
        }
    }
    return startNumber;
    // startNumber is the box number NOT the actual index in the array 
}

function getDirection(inputNumber) {
    var direction = "";
    var directionBoolean = false;

    while (directionBoolean == false) {
        for (i=0; i <  goingLeft.length; i++) {
            if (inputNumber == goingLeft[i]) {
                directionBoolean = true;
                direction = "goingLeft";
            }
        }
        for (i=0; i < goingDown.length; i++) {
            if (inputNumber == goingDown[i]) {
                directionBoolean = true;
                direction = "goingDown";
            }
        }
        for (i=0; i < goingUp.length; i++) {
            if (inputNumber == goingUp[i]) {
                directionBoolean = true;
                direction = "goingUp";
            }
        }
        for (i=0; i < goingRight.length; i++) {
            if (inputNumber == goingRight[i]) {
                directionBoolean = true;
                direction = "goingRight";
            }
        }
    }
    return direction;    
}

function rotateDirection(num, direction) { 
    if (direction == "goingDown") {
        document.getElementById("GB" + num).style.transform = 'rotate(90deg)';
    } else if (direction == "goingLeft") {
        document.getElementById("GB" + num).style.transform = 'rotate(180deg)';
    } else if (direction == "goingUp") {
        document.getElementById("GB" + num).style.transform = 'rotate(-90deg)';
    }
}

function setTank(num, directionString) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox tankBlue"> ' + '</div>';
    rotateDirection(num, directionString);  

    gameSpaceArray[num].boxType = "blueTank"; 
    gameSpaceArray[num].direction = directionString;

    tankTrackerArray.push(num + 1);
    setBlueBox(num);
    //console.log(gameSpaceArray[num].name + " | Index in Array: " + num + " | <div id= GB" + (num));
}

function clearBox(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox" onclick="setMine(' + (num) + ')"> ' + '</div>'; 
    gameSpaceArray[num].boxType = "empty"; 

    gameSpaceArray[num].direction = "none";
}

function clearAll() {
    for (i = 0; i <  100; i++) {
        clearBox(i);
        gameSpaceArray[i].boxType = "empty"; 
    }
}

function runTank(start) {
    var directionVariable = getDirection(start); 

    start = start - 1;
    var divElement = gameSpaceArray[start];

    setTankOrExplosionOrCrash(start, directionVariable);


    if (gameSpaceArray[start].boxType == "hole" || gameSpaceArray[start].boxType == "explosion") {
        killTracker++; 
    }
    
    ///// Tank Moving Code /////

    if (divElement.direction == "goingRight") {
        var end = start + 9;
        var movement = +1;

        runMovement(start, end, movement, directionVariable);

    }

    if (divElement.direction == "goingLeft") {
        var end = start - 9;
        var movement = -1;

        runMovement(start, end, movement, directionVariable);

    }

    if (divElement.direction == "goingUp") {
        var end = start - 90;
        var movement = -10;

        runMovement(start, end, movement, directionVariable);
    }

    if (divElement.direction == "goingDown") {
        var end = start + 90;
        var movement = 10;

        runMovement(start, end, movement, directionVariable);
    }
}

function runMovement(start, end, movement, directionVariable) {
        var timer = setInterval(function() {

        clearInBlue(start);
        start = start + movement;
        setTankOrExplosionOrCrash(start, directionVariable); 
        
        if (start == end || gameSpaceArray[start].boxType == "explosion" || gameSpaceArray[start].boxType == "hole") {
            
            clearInterval(timer);
            if (start == end) {
                setTimeout(function() {
                clearInBlue(start);
                clearForBlue(end, movement);
                
                }, 300);
            }

            if (gameSpaceArray[start].boxType == "hole" || gameSpaceArray[start].boxType == "explosion") {
                killTracker++; 
                //console.log("Box #" + (start + 1) + "| Array Index: " + start + " | Box Type: "  + gameSpaceArray[start].boxType);
            }
        }
    } , 300);
}

function getMoreInfo() {
    setInterval(function() {
        var text = "";
        for (i = 0; i <  gameSpaceArray.length; i++) {
            var text = text + "" + gameSpaceArray[i].name + " | Array Index: " + i + " | div id = GB" + i + " | Box Type: " + 
            gameSpaceArray[i].boxType + " | Direction: " + gameSpaceArray[i].direction + "<br>";     
        }
        document.getElementById("infoDetails").style.fontSize = '10px';
        document.getElementById("infoDetails").innerHTML = text;
    }, 250)
}

// edit replayer
function replay() {
    runTank(tankStartPositions[0]);
    
    setTimeout(function(){
        runTank(tankStartPositions[1]);  
    }, 3500);
    setTimeout(function(){
        runTank(tankStartPositions[2]); 
    }, 7000);
}

function replayTwo(timeForAllPaths) {
    runTank(tankStartPositions[0]);
    // takes three seconds to cross completely -> 0.0 -> 3.0 seconds

    var currentTime = 3400;
    var nextTank = 1;

    var tankTime = setInterval(function(){
        runTank(tankStartPositions[nextTank]);
        nextTank++;
        currentTime = currentTime + 3500;        
        if (currentTime > timeForAllPaths) {
            clearInterval(tankTime);
        }
    }, 3500); // about half a second after the previous finishes
    //  Takes 10 seconds to fully run three tanks
}




function setMine(num) {
    if (noRunningTanks == true) {
        document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox landMine" onclick="clearBoxBeforeTankRun(' + (num) + ')">'  + '</div>'; 
        gameSpaceArray[num].boxType = "landMine";
        mineCounter++;         
    }
}

function clearBoxBeforeTankRun(num) {
    if (noRunningTanks == true) {
        clearBox(num);
        mineCounter--;
    }    
}

function setExplosion(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox explosion"> ' + '</div>'; 
    gameSpaceArray[num].boxType = "explosion"; 
    document.getElementById("GB" + num).style.backgroundColor = "rgba(145, 0, 0, 0.274)"; // red death
    
    setTimeout(function(){
        setHole(num);
    }, 500)
}

function setCrash(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox crash"> ' + '</div>'; 
    document.getElementById("GB" + num).style.backgroundColor = "rgba(145, 0, 0, 0.274)"; // red death
    
    setTimeout(function(){
        setHole(num);
    }, 500)
}

function setTankOrExplosionOrCrash(num, directionString) {
    //console.log("Box #" + (num + 1) + "| Array Index: " + num + " | Box Type: "  + gameSpaceArray[num].boxType);
    if (gameSpaceArray[num].boxType == "empty") {
        setTank(num, directionString);        
    } else if (gameSpaceArray[num].boxType == "landMine") {
        setExplosion(num);        
    } else if (gameSpaceArray[num].boxType == "hole") {
        setCrash(num);         
    }
}

function setHole(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox hole"> ' + '</div>'; 
    document.getElementById("GB" + num).style.backgroundColor = "rgba(145, 0, 0, 0.274)"; // red death
    gameSpaceArray[num].boxType = "hole";         
}

function showResults() { 
    var score = "";
    var minimum = getMinimum();
    var numOfMinesUsed;
    var numOfTanks = tankStartPositions.length;

    clearAll();
    document.getElementById("introBox").style.backgroundColor = "rgb(0, 0, 0)";
    document.getElementById("introBox").style.height = "90.5%";
    document.getElementById("introBox").style.textAlign = "center";
    document.getElementById("introBox").style.fontSize = "40px";
    var text = '<div id="importantDetails"></div> <div class="buttonCustomMain">Instructions</div> <div class="buttonCustom" onclick="runGameEasy()">Easy</div> <div class="buttonCustom" onclick="runGameMedium()">Medium</div> <div class="buttonCustom" onclick="runGameHard()">Hard </div>';
    document.getElementById("introBox").style.display = "block";
    document.getElementById("introBox").innerHTML = text;

    document.getElementById("welcomeOverlay").style.backgroundColor = "rgba(8, 8, 8, 0.5)";
    document.getElementById("welcomeOverlay").style.display = "block";

    if (killTracker == numOfTanks && numOfMinesUsed == minimum) {
        score += "Three Stars";
    } else if (killTracker == numOfTanks && numOfMinesUsed > minimum) {
        score += "Two Stars";
    } else if (killTracker < numOfTanks && killTracker > 0) {
        score += "One Stars";   
    } else if (killTracker == 0) {
        score += "Zero Stars";
    }
    document.getElementById("importantDetails").innerHTML = score;
}

function clearForBlue(end, movement) {
    end += movement;
    for (i = 0; i < 10; i++) {
        end = end - movement;
        document.getElementById("GB" + end).outerHTML = '<div id=' + 'GB' + end + ' class="gameBox" onclick="setMine(' + (end) + ')"> ' + '</div>'; 
        gameSpaceArray[end].boxType = "empty"; 

        gameSpaceArray[end].direction = "none"; 
    }
}

function clearInBlue(num) {    
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox" onclick="setMine(' + (num) + ')"> ' + '</div>'; 
    document.getElementById("GB" + num).style.backgroundColor = "rgba(1, 76, 189, 0.603)"; 
    gameSpaceArray[num].boxType = "empty"; 
    gameSpaceArray[num].direction = "none";
}

function setBlueBox(num) {
    var box = document.getElementById("GB" + num);    
    box.style.backgroundColor = "rgba(1, 76, 189, 0.603)";            
}

function beginUserTimer() {
    var timeNotationWithZero = ":0";
    var timeNotationWithout = ":"; 
    var timeNotation = "";

    var sTimer = 9; 
    var msTimer = 99;
    document.getElementById("gameTimer").innerHTML = sTimer + timeNotationWithout + "00";

    mPublicTimer = setInterval(function() {
        if(msTimer == 0) {
            sTimer--;
            msTimer = 99;
        }
        if(msTimer > 10) {
            timeNotation = timeNotationWithout;
        }
        if(msTimer < 10) {
            timeNotation = timeNotationWithZero;
        }

        document.getElementById("gameTimer").innerHTML = sTimer + timeNotation + msTimer;
        msTimer--;

        if(sTimer == 0 && msTimer == 0) {
            clearInterval(mPublicTimer);
            document.getElementById("gameTimer").innerHTML = "STOP!";
        }
    }, 10)
}

function setHint() {
    var minimum = getMinimum();
    var text =  "Mines: " + minimum;
    
}

function getMinimum() {
    var numOfTanks = tankStartPositions.length;
    var numOfIntersections = 0;

    minimumMines = 0;

    var arr = tankTrackerArray;

    testText = "";

    numOfIntersections = 0;
    for(i = 0; i < arr.length; i++) {  
        for(j = i + 1; j < arr.length; j++) {  
            if(arr[i] == arr[j]) { 
            numOfIntersections++;
            }
        }
    }

    var oneCount = 0;
    var twoCount = 0;
    var tankCount = numOfTanks;

    if (numOfIntersections == 0) {
        minimumMines = tankCount;
    } else if (numOfIntersections > tankCount){
        minimumMines = Math.ceil(tankCount / 2);
    } else {
        for (i = 0; i < numOfIntersections; i++) {
            if(tankCount > 1) {
            tankCount = tankCount - 2;     
            twoCount++;
       
            }
            if (tankCount <= 0) {
                tankCount = 0;
            }
        }
        oneCount =  numOfTanks - (twoCount * 2);
        minimumMines = oneCount + twoCount;
    }

    //document.getElementById("importantDetails").innerHTML = "Least Number of Mines: " + minimumMines;

    return minimumMines; // The least number of mines possible to win with.
}


function getPositions() {
    var text = "";
    for (i = 0; i <  tankTrackerArray.length; i++) {
        var text = text + "" + tankTrackerArray[i] + "<br>";     
    }
    document.getElementById("infoDetails").innerHTML = text;
}

function overlayOff() {
  document.getElementById("welcomeOverlay").style.display = "none";
}



function runGame(difficulty) {
    tankStartPositions = [];
    var tankPaths = 0;  

    if (difficulty == "easy") {
        var firsttankStartPosition = randomInt();
        var secondtankStartPosition = randomInt();
        var thirdtankStartPosition = randomInt();
        tankPaths = 3
        tankStartPositions.push(firsttankStartPosition, secondtankStartPosition, thirdtankStartPosition)        
    }

    if (difficulty == "medium") {
        var firsttankStartPosition = randomInt();
        var secondtankStartPosition = randomInt();
        var thirdtankStartPosition = randomInt();
        var fourthtankStartPosition = randomInt();
        var fifthtankStartPosition = randomInt();
        tankPaths = 5;
        tankStartPositions.push(firsttankStartPosition, secondtankStartPosition, thirdtankStartPosition, fourthtankStartPosition, fifthtankStartPosition)        
    }

    if (difficulty == "hard") {
        var firsttankStartPosition = randomInt();
        var secondtankStartPosition = randomInt();
        var thirdtankStartPosition = randomInt();
        var fourthtankStartPosition = randomInt();
        var fifthtankStartPosition = randomInt();
        tankPaths = 5;
        tankStartPositions.push(firsttankStartPosition, secondtankStartPosition, thirdtankStartPosition, fourthtankStartPosition, fifthtankStartPosition)        
    }

    var timeForAllPaths = (tankPaths * 3000) + 1000;
    var timeForPlaying = timeForAllPaths + 10000;
    noRunningTanks = false;

    killTracker = 0;

    runTank(tankStartPositions[0]);
    // takes three seconds to cross completely -> 0.0 -> 3.0 seconds

    var currentTime = 3400;
    var nextTank = 1;

    var tankTime = setInterval(function(){
        runTank(tankStartPositions[nextTank]);
        nextTank++;
        currentTime = currentTime + 3500;        
        if (currentTime > timeForAllPaths) {
            clearInterval(tankTime);
        }
    }, 3500); // about half a second after the previous finishes
    //  Takes 10 seconds to fully run three tanks

    setTimeout(function(){
        document.getElementById("welcomeOverlay").style.display = "none";
        setHint();
        noRunningTanks = true; // Tanks have finished running and user is able to set mines.
        beginUserTimer();
    }, timeForAllPaths);

    setTimeout(function(){
        document.getElementById("welcomeOverlay").style.display = "block";
        noRunningTanks = false;
        replayTwo(timeForAllPaths); // need to adjust for blue squares
    }, timeForPlaying);

    setTimeout(function() {
        showResults();
    }, (timeForPlaying + timeForAllPaths + 500));
}

function preGame() {

    document.getElementById("introBox").style.backgroundColor = "transparent";
    document.getElementById("introBox").style.fontcolor = "red";
//    document.getElementById("introBox").style.height = "600px";
    document.getElementById("introBox").style.textAlign = "center";
    document.getElementById("introBox").style.fontSize = "500px";

    document.getElementById("introBox").innerText = 3;    
    document.getElementById("welcomeOverlay").style.backgroundColor = "transparent";
    document.getElementById("welcomeOverlay").style.display = "block";

    setTimeout(function(){
        document.getElementById("welcomeOverlay").style.display = "none"
    }, 500);

    setTimeout(function(){
        document.getElementById("introBox").innerText = 2; 
        document.getElementById("welcomeOverlay").style.display = "block";
    },  950);

    setTimeout(function(){
        document.getElementById("welcomeOverlay").style.display = "none"
    }, 1610);

    setTimeout(function(){
        document.getElementById("introBox").innerText = 1; 
        document.getElementById("welcomeOverlay").style.display = "block";
    },  2100);

    setTimeout(function(){
        document.getElementById("introBox").innerText = " ";
        document.getElementById("introBox").style.backgroundColor = "transparent"; // invisible gaurd
    }, 2800);     
}

function runGameEasy() {
    setGameBoxes();
    preGame();

    setTimeout(function() {
        runGame("easy");
    }, 2900);
}

function runGameMedium() {
    setGameBoxes();
    preGame();

    setTimeout(function() {
        runGame("medium");
    }, 2900);
}

function runGameHard() {
    preGame();
    setGameBoxes();

    setTimeout(function() {
        runGame("hard");
    }, 2900);
}