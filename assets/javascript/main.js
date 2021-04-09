const startArray = [2,3,4,5,6,7,8,9,20,30,40,50,60,70,80,90,11,21,31,41,51,61,71,81,92,93,94,95,96,97,98,99];
const facingLeft = [20,30,40,50,60,70,80,90];
const facingRight = [11,21,31,41,51,61,71,81];
const facingUp = [92,93,94,95,96,97,98,99];
const facingDown = [2,3,4,5,6,7,8,9];
var gameSpaceArray = [];

window.onload = function(){
    var gameSpace = document.getElementById("gameSpace");

    for (i=1; i < 101; i++) {

        var boxDiv = '<div id=' + 'GB' + i + ' class="gameBox"> ' + i + '</div>'; 
        gameSpace.innerHTML += boxDiv;

        boxDivObject = {
            name: "GB" + i, 
            type: "empty",
            orientation: "none"
        };
        this.gameSpaceArray.push(boxDivObject);

    }
};

function randomStart() {
    //random number from either 1-10 / 10s-100 / 91-100 / 1-11-21-31-41...91 to start:
        // [2/3/4/5/6/7/8/9/20/30/40/50/60/70/80/90/11/21/31/41/51/61/71/81/92/93/94/95/96/97/98/99   [1][10[91][100]
    var startNumber;
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
        for (i=0; i <facingLeft.length; i++) {
            if (inputNumber == facingLeft[i]) {
                orientationBoolean = true;
                orientation = "facingLeft";
            }
        }
        for (i=0; i <facingDown.length; i++) {
            if (inputNumber == facingDown[i]) {
                orientationBoolean = true;
                orientation = "facingDown";
            }
        }
        for (i=0; i <facingUp.length; i++) {
            if (inputNumber == facingUp[i]) {
                orientationBoolean = true;
                orientation = "facingUp";
            }
        }
        for (i=0; i <facingRight.length; i++) {
            if (inputNumber == facingRight[i]) {
                orientationBoolean = true;
                orientation = "facingRight";
            }
        }
    }
    return orientation;    
}

function rotateOrientation(num, orientation) {
    if (orientation == "facingDown") {
        document.getElementById("GB" + num).style.transform = 'rotate(90deg)';
    } else if (orientation == "facingLeft") {
        document.getElementById("GB" + num).style.transform = 'rotate(180deg)';
    } else if (orientation == "facingUp") {
        document.getElementById("GB" + num).style.transform = 'rotate(-90deg)';
    gameSpaceArray[num].orientation = orientation;
    }
}

function submit() {
    var num = randomStart();

    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox tankBlue"> ' + num + '</div>';   
    gameSpaceArray[num].type = "blueTank"; 

    var orientation = getOrientation(num);  
    rotateOrientation(num, orientation);
    
    console.log(gameSpaceArray);
}