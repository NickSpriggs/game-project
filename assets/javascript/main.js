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
            orientation: "none",
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

function getOrientation(inputNumber) {
    var orientation = "";
    var orientationBoolean = false;

    while (orientationBoolean == false) {
        for (i=0; i <goingLeft.length; i++) {
            if (inputNumber == goingLeft[i]) {
                orientationBoolean = true;
                orientation = "goingLeft";
            }
        }
        for (i=0; i <goingDown.length; i++) {
            if (inputNumber == goingDown[i]) {
                orientationBoolean = true;
                orientation = "goingDown";
            }
        }
        for (i=0; i <goingUp.length; i++) {
            if (inputNumber == goingUp[i]) {
                orientationBoolean = true;
                orientation = "goingUp";
            }
        }
        for (i=0; i <goingRight.length; i++) {
            if (inputNumber == goingRight[i]) {
                orientationBoolean = true;
                orientation = "goingRight";
            }
        }
    }
    return orientation;    
}

function rotateOrientation(num) {
    var orientation = getOrientation(num); 

    if (orientation == "goingDown") {
        document.getElementById("GB" + num).style.transform = 'rotate(90deg)';
    } else if (orientation == "goingLeft") {
        document.getElementById("GB" + num).style.transform = 'rotate(180deg)';
    } else if (orientation == "goingUp") {
        document.getElementById("GB" + num).style.transform = 'rotate(-90deg)';
    }
    gameSpaceArray[num].orientation = orientation;
}

function setTank(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox tankBlue"> ' + num + '</div>';  
    rotateOrientation(num); 
    gameSpaceArray[num].boxType = "blueTank"; 
}

function removeTank(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox"> ' + num + '</div>'; 
    gameSpaceArray[num].orientation = "none";
}

function removeAll() {
    for (i = 1; i < 100; i++) {
        removeTank(i);
        gameSpaceArray[i].boxType = "empty"; 
    }
}

function movingTanks() {
    var num = randomInt();
    setTank(num);
}

function info() {
    var text = "";
    for (i = 1; i < gameSpaceArray.length; i++) {
        var text = text + "" + gameSpaceArray[i].name + " " + gameSpaceArray[i].boxType + " " + gameSpaceArray[i].orientation + "<br>";        
    }
    document.getElementById("infoDetails").innerHTML = text;
}