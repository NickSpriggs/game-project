const startArray = [2,3,4,5,6,7,8,9,20,30,40,50,60,70,80,90,11,21,31,41,51,61,71,81,92,93,94,95,96,97,98,99];
const goingLeft = [20,30,40,50,60,70,80,90];
const goingRight = [11,21,31,41,51,61,71,81];
const goingUp = [92,93,94,95,96,97,98,99];
const goingDown = [2,3,4,5,6,7,8,9];
var gameSpaceArray = [];
var tankStartPositions = [];
var tankTrackerArray = [];
var killTracker = 0;
var noRunningTanks = true;

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

    tankTrackerArray.push(num + 1);
    setBlueBox(num);
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

function makeThreeTanks() {
    tankStartPositions = [];
    killTracker = 0;

    var firsttankStartPosition = randomInt();
    var secondtankStartPosition = randomInt();
    var thirdtankStartPosition = randomInt();
    tankStartPositions.push(firsttankStartPosition, secondtankStartPosition, thirdtankStartPosition)

    runTank(firsttankStartPosition);
            // takes three seconds to cross completely -> 0.0 -> 3.0 seconds
    setTimeout(function(){
        runTank(secondtankStartPosition);  
            // takes the same but start .8 seconds later  3.5 -> 6.5 seconds
    }, 3500);
    setTimeout(function(){
        runTank(thirdtankStartPosition); 
            // takes the same but start .8 seconds later  7.0 -> 10 seconds
    }, 7000);
}

function replay() {
    runTank(tankStartPositions[0]);
    
    setTimeout(function(){
        runTank(tankStartPositions[1]);  
    }, 3500);
    setTimeout(function(){
        runTank(tankStartPositions[2]); 
    }, 7000);
}

function setMine(num) {
    if (noRunningTanks == true) {
        document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox landMine" onclick="clearBoxBeforeTankRun(' + (num) + ')">'  + (num + 1) + '</div>'; 
        gameSpaceArray[num].boxType = "landMine";         
    }
}

function clearBoxBeforeTankRun(num) {
    if (noRunningTanks == true) {
        clearBox(num);
    }    
}

function setExplosion(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox explosion"> ' + (num + 1) + '</div>'; 
    gameSpaceArray[num].boxType = "explosion"; 
    
    setTimeout(function(){
        setHole(num);
    }, 500)
}

function setCrash(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox crash"> ' + (num + 1) + '</div>'; 
    
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
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox hole"> ' + (num + 1) + '</div>'; 
    gameSpaceArray[num].boxType = "hole";         
}

function fullTest() {
    //beginUserTimer();
    var text = " ";
    noRunningTanks = false;

    makeThreeTanks();
//  Takes 10 seconds to fully run three tanks
    setTimeout(function(){
        noRunningTanks = true;
    }, 10000);

    setTimeout(function(){
        noRunningTanks = false;
        replay();
    }, 15000);
  
    // setTimeout(function(){
    //     if (killTracker == 3) {
    //         text += "You incapacitate all enemy vehicles: " + killTracker;
    //     } else {
    //         text += "You failed, you only incapacitate this many enemy vehicles: " + killTracker;   
    //     }  
    //     noRunningTanks = true;
    //     alert(text);
    // }, 25010);   

    // show results

}

function clearForBlue(end, movement) {
    end += movement;
    for (i = 0; i < 10; i++) {
        end = end - movement;
        document.getElementById("GB" + end).outerHTML = '<div id=' + 'GB' + end + ' class="gameBox" onclick="setMine(' + (end) + ')"> ' + (end + 1) + '</div>'; 
        gameSpaceArray[end].boxType = "empty"; 

        gameSpaceArray[end].direction = "none"; 
    }
}

function clearInBlue(num) {    
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox" onclick="setMine(' + (num) + ')"> ' + (num + 1) + '</div>'; 
    document.getElementById("GB" + num).style.backgroundColor = "rgba(1, 76, 189, 0.603)"; 
    gameSpaceArray[num].boxType = "empty"; 
    gameSpaceArray[num].direction = "none";
}

function setBlueBox(num) {
    var box = document.getElementById("GB" + num);    
    box.style.backgroundColor = "rgba(1, 76, 189, 0.603)";            
}

function beginUserTimer() {
    var msTimer = 0;
    var sTimer = 0;    
    var timeNotationWithZero = ":0";
    var timeNotationWithout = ":"; 
    var timeNotation = "";

    document.getElementById("timeBox").innerHTML = sTimer + timeNotationWithZero + msTimer;

    mPublicTimer = setInterval(function(){
        msTimer++;
        if(msTimer == 100) {
            sTimer++;
            msTimer = 0;
        }
        if(msTimer == 10) {
            timeNotation = timeNotationWithout;
        }
        if(msTimer <= 1) {
            timeNotation = timeNotationWithZero;
        }

        document.getElementById("timeBox").innerHTML = sTimer + timeNotation + msTimer;

        if(sTimer == 25) {
            clearInterval(mPublicTimer);
        }
    }, 10)
}

function setHint() {
    var numOfTanks = tankStartPositions.length;
    var numOfIntersections = 0;

    LeastPossibleNumOfMines = Math.ceil(numOfTanks / 2);
    currentLeastNumOfMines = 0;

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

    //numOfIntersections = ;
    //numOfTanks = ;

    var oneCount = 0;
    var twoCount = 0;
    var tankCount = numOfTanks;

    if (numOfIntersections == 0) {
        currentLeastNumOfMines = tankCount;
    } else if (numOfIntersections > tankCount){
        currentLeastNumOfMines = Math.ceil(tankCount / 2);
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
        currentLeastNumOfMines = oneCount + twoCount;
    }
    
    document.getElementById("infoDetails").innerHTML = "Least Number of Mines: " + currentLeastNumOfMines;
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
  document.getElementById("hintBox").style.display = "block";
  document.getElementById("timeBox").style.display = "none";
}



function runGame() {
    tankRuns = 5;
    tankStartPositions = [];
    killTracker = 0;

    for (i = 0; i < tankRuns; i++) {
        var position = randomInt();
        tankStartPositions.push(position);
    }

    for (i = 0; i < tankRuns; i++) {
        runTank(tankStartPositions[i]);
    }

}