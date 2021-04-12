const startArray = [2,3,4,5,6,7,8,9,20,30,40,50,60,70,80,90,11,21,31,41,51,61,71,81,92,93,94,95,96,97,98,99];
const goingLeft = [20,30,40,50,60,70,80,90];
const goingRight = [11,21,31,41,51,61,71,81];
const goingUp = [92,93,94,95,96,97,98,99];
const goingDown = [2,3,4,5,6,7,8,9];
var gameSpaceArray = [];
var trackerArray = [];
var killTrackerArray = [];

window.onload = function(){
    var gameSpace = document.getElementById("gameSpace");

    for (i=0; i <  100; i++) {

        var boxNumber = (i + 1);
        var boxDiv = '<div id=' + 'GB' + (i) + ' class="gameBox" onclick="setMine(' + (i) + ')">' + (boxNumber) + '</div>'; 
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
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox tankBlue"> ' + (num + 1) + '</div>';
    rotateDirection(num, directionString);  

    gameSpaceArray[num].boxType = "blueTank"; 
    gameSpaceArray[num].direction = directionString;



    trackerArray.push(gameSpaceArray[num].name + " | Index: " + num);
    //console.log(gameSpaceArray[num].name + " | Index in Array: " + num + " | <div id= GB" + (num));
}

function clearBox(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox" onclick="setMine(' + (num) + ')"> ' + (num + 1) + '</div>'; 
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

    setTankOrExplosion(start, directionVariable);
    
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

function runMovement(start, end, plusNum, directionVariable) {
        var timer = setInterval(function() {
            
        clearBox(start);
        start = start + plusNum;
        setTankOrExplosion(start, directionVariable); 
        
        if (start == end || gameSpaceArray[start].boxType == "explosion" || gameSpaceArray[start].boxType == "hole") {
                //console.log("Box #" + (start + 1) + "| Array Index: " + start + " | Box Type: "  + gameSpaceArray[start].boxType);

            clearInterval(timer);

            if (start == end || gameSpaceArray[start].boxType == "explosion") {
                setTimeout(function() {
                clearBox(start);
                killTrackerArray.push(start);
                }, 300);
            }
            
            if (gameSpaceArray[start].boxType == "hole") {
                setHole(start);  
                killTrackerArray.push(start);            
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

function makeThreeTanks() {
    trackerArray = [];
    var firstTankStart = randomInt();
    var secondTankStart = randomInt();
    var thirdTankStart = randomInt();
    trackerArray.push(firstTankStart, secondTankStart, thirdTankStart)

    runTank(firstTankStart);
    setTimeout(function(){
        runTank(secondTankStart);        
    }, 3000);
    setTimeout(function(){
        runTank(thirdTankStart);        
    }, 6000);
}

function replay() {
    trackerArray;
    killTrackerArray = [];

    runTank(trackerArray[0]);
    setTimeout(function(){
        runTank(trackerArray[1]);        
    }, 3500);
    setTimeout(function(){
        runTank(trackerArray[2]);        
    }, 6500);
}

function setMine(num) {
    var noRunningTanks = checkBoard();

    if (noRunningTanks == true) {
        document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox landMine" onclick="clearBoxBeforeTankRun(' + (num) + ')">'  + (num + 1) + '</div>'; 
        gameSpaceArray[num].boxType = "landMine";         
    }
}

function clearBoxBeforeTankRun(num) {
    var noRunningTanks = checkBoard();

    if (noRunningTanks == true) {
        clearBox(num);
    }    
}

function checkBoard() {
    var noRunningTanks = true;

    for (i=0; i < 100; i++) {
        if (gameSpaceArray[i].boxType == "blueTank") {
            noRunningTanks = false;
        }
    }
    return noRunningTanks;
}

function setExplosion(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox explosion"> ' + (num + 1) + '</div>'; 
    gameSpaceArray[num].boxType = "explosion"; 
    
    setTimeout(function(){
        setHole(num);
    }, 500)
}

function setTankOrExplosion(num, directionString) {
    //console.log("Box #" + (num + 1) + "| Array Index: " + num + " | Box Type: "  + gameSpaceArray[num].boxType);
    if (gameSpaceArray[num].boxType == "empty") {
        setTank(num, directionString);        
    } else if (gameSpaceArray[num].boxType == "landMine") {
        setExplosion(num);        
    }
}

function setHole(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox hole"> ' + (num + 1) + '</div>'; 
    gameSpaceArray[num].boxType = "hole";         
}

function fullTest() {
    var text = " ";
    makeThreeTanks();

    setTimeout(function(){
        replay();
    }, 20000);

    if (killTrackerArray.length == 3) {
        text += "You incapacitate all enemy vehicles: " + killTrackerArray.length;
    } else {
        text += "You failed, you did not incapacitate all enemy vehicles: " + killTrackerArray.length;   
    }    
    setTimeout(function(){
        alert(text);
    }, 35000);    
}