const startArray = [2,3,4,5,6,7,8,9,20,30,40,50,60,70,80,90,11,21,31,41,51,61,71,81,92,93,94,95,96,97,98,99];
const facingLeft = [20,30,40,50,60,70,80,90];
const facingRight = [11,21,31,41,51,61,71,81];
const facingUp = [92,93,94,95,96,97,98,99];
const facingDown = [2,3,4,5,6,7,8,9];

window.onload = function(){
    var gameSpace = document.getElementById("gameSpace");

    for (i=1; i < 101; i++) {

        //var boxName = "GB" + i;
        //var newBox = '<div id="' + boxName + '" class="gameBox" onclick="summonTank(' + boxName + ', ' + i + ')"> ' + boxName + '</div>'; 
        //gameSpace.innerHTML += newBox;

        var newBox = '<div id="GB' + i + '" class="gameBox" onclick="summonTank(GB' + i + ', ' + i + ')"> ' + i + '</div>'; 
        gameSpace.innerHTML += newBox;

    }
};

function summonTank(gbId, gbNum) {
    //console.log(gbId);
    gbId.outerHTML = '<div id="GB' + gbNum + '" class="gameBox tankBlue" onclick="destroyTank(GB' + gbNum + ', ' + gbNum + ')"></div>'; 
}

function destroyTank(gbId, gbNum) {
    //console.log(gbId);  
    gbId.outerHTML = '<div id="GB' + gbNum + '" class="gameBox" onclick="summonTank(GB' + gbNum + ', ' + gbNum + ')"></div>';
}

function moveTank(tankGbId, gbNum) {
    // either: (A) go to the next highest root of ten if it ends in a 1 or (B) the next lowest if it ends in a 0
    // either: (C) go to the lowest number ending in the same digit or (D) the highest number ending in the same digit.

    // If its (A) leave it be, if its (B) rotate 180 degrees, if its (C) rotate -90 degrees, if its (D) rotate 90 degrees
}

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

function randomTank() {
    startPoint = randomStart();
    gbStartPoint = "GB" + startPoint; 

    gbId = document.getElementById(gbStartPoint);
    summonTank(gbId, startPoint);

    console.log(gbId);
}