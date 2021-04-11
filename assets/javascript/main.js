const startArray = [2,3,4,5,6,7,8,9,20,30,40,50,60,70,80,90,11,21,31,41,51,61,71,81,92,93,94,95,96,97,98,99];
const goingLeft = [20,30,40,50,60,70,80,90];
const goingRight = [11,21,31,41,51,61,71,81];
const goingUp = [92,93,94,95,96,97,98,99];
const goingDown = [2,3,4,5,6,7,8,9];
var gameSpaceArray = [];

window.onload = function(){
    var gameSpace = document.getElementById("gameSpace");

    for (i=0; i <  100; i++) {

        var GBi = (i + 1);
        var boxDiv = '<div id=' + 'GB' + (i) + ' class="gameBox" onclick="setMine(' + (i) + ')">' + (GBi) + '</div>'; 
        //var boxDiv = '<div id=' + 'GB' + (i + 1) + ' class="gameBox">' + (i + 1) + '</div>'; 
        gameSpace.innerHTML += boxDiv;

        boxDivObject = {
            name: "Box #" + (GBi), 
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

function runTank() {
    var start = randomInt();
    var directionVariable = getDirection(start); 

    console.log("Coded Starting Integer: " + start);
    start = start - 1;

    var divElement = gameSpaceArray[start];

    setTank(start, directionVariable);
    
///// Tank Moving Code /////

    if (divElement.direction == "goingRight") {
        var end = start + 10;
        var timer = setInterval(function() {
 
            clearBox(start);
            start++;
            setTank(start, directionVariable); 

            if (start == end) {
                clearInterval(timer);
                clearBox(start);
            }
        } , 300);
    }

    if (divElement.direction == "goingLeft") {
        var end = start - 10;
        var timer = setInterval(function() {
 
            clearBox(start);
            start--;
            setTank(start, directionVariable); 

            if (start == end) {
                clearInterval(timer);
                clearBox(start);
            }
        } , 300);
    }
    if (divElement.direction == "goingUp") {
        var end = start - 90;
        var timer = setInterval(function() { 

            clearBox(start);
            start = start - 10;
            setTank(start, directionVariable); 

            if (start == end) {
                clearInterval(timer);

                setTimeout(function() {
                    clearBox(start);
                }, 300);    
            }
        } , 300);   
    }

    if (divElement.direction == "goingDown") {
        var end = start + 90;
        var timer = setInterval(function() {
 
            clearBox(start);
            start = start + 10;
            setTank(start, directionVariable); 

            if (start == end) {
                clearInterval(timer);

                setTimeout(function() {
                    clearBox(start);
                }, 300);    
            }
        } , 300); 
    }
}

function getInfo() {
    var text = "";
    for (i = 0; i <  gameSpaceArray.length; i++) {
        var text = text + "" + gameSpaceArray[i].name + " " + gameSpaceArray[i].boxType + " " + gameSpaceArray[i].direction + "<br>";        
    }
    document.getElementById("infoDetails").innerHTML = text;
}

function getMoreInfo() {
    setInterval(function() {
        var text = "";
        for (i = 0; i <  gameSpaceArray.length; i++) {
            var text = text + "" + gameSpaceArray[i].name + " | Index in Array: " + i + " | div id = GB" + i + " | Box Type: " + 
            gameSpaceArray[i].boxType + " | Direction: " + gameSpaceArray[i].direction + "<br>";     
        }
        document.getElementById("infoDetails").style.fontSize = '10px';
        document.getElementById("infoDetails").innerHTML = text;
    }, 250)
}

function makeThreeTanks() {
    runTank();

    setTimeout(function(){
        runTank();        
    }, 3000);

    setTimeout(function(){
        runTank();        
    }, 6000);
}

function makeFiveTanks() {
    runTank();

    setTimeout(function(){
        runTank();        
    }, 3000);

    setTimeout(function(){
        runTank();        
    }, 6000);

    setTimeout(function(){
        runTank();        
    }, 9000);

    setTimeout(function(){
        runTank();        
    }, 12000);
}

function setMine(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox landMine"> ' + (num + 1) + '</div>'; 
    gameSpaceArray[num].boxType = "landMine"; 
}


///// Unused Yet //////
function setExplosion(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox explosion"> ' + num + '</div>'; 
    gameSpaceArray[num].boxType = "explosion";     
}

function setHole(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox hole"> ' + num + '</div>'; 
    gameSpaceArray[num].boxType = "hole";         
}