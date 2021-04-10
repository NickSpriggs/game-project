const startArray = [2,3,4,5,6,7,8,9,20,30,40,50,60,70,80,90,11,21,31,41,51,61,71,81,92,93,94,95,96,97,98,99];
const goingLeft = [20,30,40,50,60,70,80,90];
const goingRight = [11,21,31,41,51,61,71,81];
const goingUp = [92,93,94,95,96,97,98,99];
const goingDown = [2,3,4,5,6,7,8,9];
var gameSpaceArray = [];

window.onload = function(){
    var gameSpace = document.getElementById("gameSpace");

    for (i=0; i < 100; i++) {

        var boxDiv = '<div id=' + 'GB' + (i + 1) + ' class="gameBox"> ' + (i + 1) + '</div>'; 
        gameSpace.innerHTML += boxDiv;

        boxDivObject = {
            name: "GB" + i, 
            boxType: "empty",
            direction: "none",
            destination: "departing"
        };
        this.gameSpaceArray.push(boxDivObject);
        
    }
};

function randomInt() {
    //random number from either 1-10 / 10s-100 / 91-100 / 1-11-21-31-41...91 to start:
        // [2/3/4/5/6/7/8/9/20/30/40/50/60/70/80/90/11/21/31/41/51/61/71/81/92/93/94/95/96/97/98/99   [1][10[91][100]
    var startNumber = 0;
    var workingNumberBoolean = false;

    while (workingNumberBoolean == false) {
        startNumber = Math.floor(Math.random() * 101);

        for (i=0; i <startArray.length; i++) {

            if (startNumber == startArray[i]) {
                workingNumberBoolean = true;
            }
        }
    }
    return startNumber;
}

function getdirection(inputNumber) {
    var direction = "";
    var directionBoolean = false;

    while (directionBoolean == false) {
        for (i=0; i <goingLeft.length; i++) {
            if (inputNumber == goingLeft[i]) {
                directionBoolean = true;
                direction = "goingLeft";
            }
        }
        for (i=0; i <goingDown.length; i++) {
            if (inputNumber == goingDown[i]) {
                directionBoolean = true;
                direction = "goingDown";
            }
        }
        for (i=0; i <goingUp.length; i++) {
            if (inputNumber == goingUp[i]) {
                directionBoolean = true;
                direction = "goingUp";
            }
        }
        for (i=0; i <goingRight.length; i++) {
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
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox tankBlue"> ' + num + '</div>';  
    gameSpaceArray[num].boxType = "blueTank"; 

    rotateDirection(num, directionString); 
    gameSpaceArray[num].direction = directionString;
}

function removeTank(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox"> ' + num + '</div>'; 
    gameSpaceArray[num].boxType = "empty"; 

    gameSpaceArray[num].direction = "none";
}

function removeAll() {
    for (i = 1; i < 100; i++) {
        removeTank(i);
        gameSpaceArray[i].boxType = "empty"; 
    }
}

function movingTanks() {
    var start = randomInt();
    var directionVariable = getdirection(start); 
  
    var divElement = gameSpaceArray[start];
    setTank(start, directionVariable);
    
///// Tank Moving Code /////

    if (divElement.direction == "goingRight") {
        var end = start + 10;
        var timer = setInterval(function() {
            divElement = gameSpaceArray[start];
 
            removeTank(start);
            start++;
            setTank(start, directionVariable); 

            if (start == end) {
                clearInterval(timer);
                removeTank(start);
            }
        } , 500);
    }

    if (divElement.direction == "goingLeft") {
        var end = start - 10;
        var timer = setInterval(function() {
            divElement = gameSpaceArray[start];
 
            removeTank(start);
            start--;
            setTank(start, directionVariable); 

            if (start == end) {
                clearInterval(timer);
                removeTank(start);
            }
        } , 500);
    }
    if (divElement.direction == "goingUp") {
        var end = start - 90;
        var timer = setInterval(function() {
            divElement = gameSpaceArray[start];
 
            removeTank(start);
            start = start - 10;
            setTank(start, directionVariable); 

            if (start == end) {
                clearInterval(timer);
                removeTank(start);
            }
        } , 500);
    }

    if (divElement.direction == "goingDown") {
        var end = start + 90;
        var timer = setInterval(function() {
            divElement = gameSpaceArray[start];
 
            removeTank(start);
            start = start + 10;
            setTank(start, directionVariable); 

            if (start == end) {
                clearInterval(timer);
                removeTank(start);
            }
        } , 500);
    }
}

function info() {
    var text = "";
    for (i = 1; i < gameSpaceArray.length; i++) {
        var text = text + "" + gameSpaceArray[i].name + " " + gameSpaceArray[i].boxType + " " + gameSpaceArray[i].direction + "<br>";        
    }
    document.getElementById("infoDetails").innerHTML = text;
}