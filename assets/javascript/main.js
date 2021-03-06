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
    document.getElementById("areaOne").outerHTML = '<div id="areaOne"><div id="gameTimer">Timer</div></div>';
    document.getElementById("areaTwo").outerHTML = '<div id="areaTwo"><div class="gameTracker" id="tankCount">Number of Tanks</div><div class="gameTracker" id="mineCount">Tips</div><div class="gameTracker" id="killCount"># of Tanks Destroyed</div></div>';   
    document.getElementById("gameSpace").outerHTML = '<div id="gameSpace" class="map"></div>';
    var gameSpace = document.getElementById("gameSpace");
	var i;	
  
    for (i=0; i <  100; i++) {

        var boxNumber = (i + 1);
        var boxDiv = '<div id=' + 'GB' + (i) + ' class="gameBox" onclick="setMine(' + (i) + ')">' + '</div>'; 

        gameSpace.innerHTML += boxDiv;

        var boxDivObject = {
            name: "Box #" + (boxNumber), 
            boxType: "empty",
            direction: "none",
            destination: "departing"
        };
        this.gameSpaceArray.push(boxDivObject); 
    } 
}

function randomInt(arr) {
    var startNumber = 0;
    var startNumberIndex = 0;
    var workingNumberBoolean = false;

    while (workingNumberBoolean == false) {
        startNumber = Math.floor(Math.random() * 101);
      	
      	var i =0;
        for (i=0; i < arr.length; i++) {

            if (startNumber == arr[i]) {
                workingNumberBoolean = true;
                startNumberIndex = arr[i];
            }
        }
    }
    arr.push(startNumberIndex);
    return startNumber;
    // startNumber is the box number NOT the actual index in the array 
}

function getDirection(inputNumber) {
    var direction = "";
    var directionBoolean = false;

    while (directionBoolean == false) {
    		var i;
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
}

function clearBox(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox" onclick="setMine(' + (num) + ')"> ' + '</div>'; 
    gameSpaceArray[num].boxType = "empty"; 

    gameSpaceArray[num].direction = "none";
}

function clearAll() {
  	var i = 0;
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
        if (killTracker > 0) {
            document.getElementById("tankCount").style.backgroundColor = "rgba(200, 71, 8, 0.877)";
            document.getElementById("tankCount").style.color = "white";
            document.getElementById("tankCount").innerText = killTracker + " destroyed!";        
        }
    }
  
  	var end = 0;
  	var movement = 0;

    if (divElement.direction == "goingRight") {
        end = start + 9;
        movement = +1;

        runMovement(start, end, movement, directionVariable);

    }

    if (divElement.direction == "goingLeft") {
        end = start - 9;
        movement = -1;

        runMovement(start, end, movement, directionVariable);

    }

    if (divElement.direction == "goingUp") {
        end = start - 90;
        movement = -10;

        runMovement(start, end, movement, directionVariable);
    }

    if (divElement.direction == "goingDown") {
        end = start + 90;
        movement = 10;

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
                document.getElementById("tankCount").style.backgroundColor = "rgba(200, 71, 8, 0.877)";
                document.getElementById("tankCount").style.color = "white";
                document.getElementById("tankCount").innerText = killTracker + " Destroyed!";
            }
        }
    } , 300);
}

function replay(timeForAllPaths) {
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
    document.getElementById("GB" + num).style.backgroundColor = "rgba(145, 0, 0, 0.274)"; 
    
    setTimeout(function(){
        setHole(num);
    }, 500);
}

function setCrash(num) {
    document.getElementById("GB" + num).outerHTML = '<div id=' + 'GB' + num + ' class="gameBox crash"> ' + '</div>'; 
    document.getElementById("GB" + num).style.backgroundColor = "rgba(145, 0, 0, 0.274)"; 
    
    setTimeout(function(){
        setHole(num);
    }, 500);
}

function setTankOrExplosionOrCrash(num, directionString) {
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
    document.getElementById("GB" + num).style.backgroundColor = "rgba(145, 0, 0, 0.274)"; 
    gameSpaceArray[num].boxType = "hole";         
}

function showResults() { 
    var score = "";
    var numOfTanks = tankStartPositions.length;

    clearAll();

    document.getElementById("areaOne").outerHTML = '<div id="areaOne"><div id="gameTimer">Timer</div></div>';
    document.getElementById("areaTwo").outerHTML = '<div id="areaTwo"><div class="gameTracker" id="tankCount">Number of Tanks</div><div class="gameTracker" id="mineCount">Tips</div><div class="gameTracker" id="killCount"> # of Tanks Destroyed</div></div>';   

    document.getElementById("welcomeOverlay").style.backgroundColor = "rgba(8, 8, 8, 0.726)";
    document.getElementById("welcomeOverlay").style.display = "block";

    if (killTracker == numOfTanks) {
        score = score + "Congratulations! You managed to destroy all " + numOfTanks + " tanks!";
    } else if (killTracker < numOfTanks && killTracker > 0) {
        score = score + "Don't feel bad! You managed to destroy " + killTracker + " of them!";
    } else if (killTracker == 0) {
        score = score + "You need more practice!";   
    } 
    alert(score);
}

function clearForBlue(end, movement) {
    end += movement;
  	var i = 0;
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

    var mPublicTimer = setInterval(function() {
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
    }, 10);
}

function setHint() {
    var minimum = getMinimum();

    document.getElementById("mineCount").style.backgroundColor = "rgba(200, 71, 8, 0.877)";
    document.getElementById("mineCount").style.color = "white";
    document.getElementById("mineCount").innerText = tankStartPositions.length + " Tanks";  
    document.getElementById("tankCount").innerText = "Only Need: " + minimum;    

}

function getMinimum() {
    var numOfTanks = tankStartPositions.length;
    var numOfIntersections = 0;

    var minimumMines = 0;

    var arr = tankTrackerArray;

    numOfIntersections = 0;
  	var i;
  	var j;
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

    return minimumMines; // The least number of mines possible to win with.
}

function runGame(difficulty) {
    tankStartPositions = [];
    var tankPaths = 0;  
    var tempStartArray = startArray;
    var firsttankStartPosition = 0;
    var secondtankStartPosition = 0;
    var thirdtankStartPosition = 0;
    var fourthtankStartPosition = 0;
    var fifthtankStartPosition = 0;
  	var timeForAllPaths = 0;

    if (difficulty == "easy") {
        firsttankStartPosition = randomInt(tempStartArray);
        secondtankStartPosition = randomInt(tempStartArray);
        thirdtankStartPosition = randomInt(tempStartArray);
        tankPaths = 3;
        timeForAllPaths = (tankPaths * 3000) + 1000;
        tankStartPositions.push(firsttankStartPosition, secondtankStartPosition, thirdtankStartPosition);        
    }

    if (difficulty == "medium") {
        firsttankStartPosition = randomInt(tempStartArray);
        secondtankStartPosition = randomInt(tempStartArray);
        thirdtankStartPosition = randomInt(tempStartArray);
        fourthtankStartPosition = randomInt(tempStartArray);
        tankPaths = 4;
        timeForAllPaths = (tankPaths * 3100) + 1000;
        tankStartPositions.push(firsttankStartPosition, secondtankStartPosition, thirdtankStartPosition, fourthtankStartPosition);        
    }

    if (difficulty == "hard") {
        firsttankStartPosition = randomInt(tempStartArray);
        secondtankStartPosition = randomInt(tempStartArray);
        thirdtankStartPosition = randomInt(tempStartArray);
        fourthtankStartPosition = randomInt(tempStartArray);
        fifthtankStartPosition = randomInt(tempStartArray);
        tankPaths = 5;
        timeForAllPaths = (tankPaths * 3200) + 1000;
        tankStartPositions.push(firsttankStartPosition, secondtankStartPosition, thirdtankStartPosition, fourthtankStartPosition, fifthtankStartPosition);        
    }

    var timeForPlaying = timeForAllPaths + 10000;
    noRunningTanks = false;

    killTracker = 0;

    runTank(tankStartPositions[0]);
    // takes three seconds to cross completely -> 0.0 -> 3.0 seconds 


    var currentTime = 3400; 
    var nextTank = 1;

    var tankTime = setInterval(function(){
        runTank(tankStartPositions[nextTank]);
        currentTime = currentTime + 3500;
        nextTank++;    
        if (currentTime > timeForAllPaths) {
            clearInterval(tankTime);
        }
    }, 3500); // about half a second after the previous finishes
    //  Takes 10 seconds to fully run three tanks



    setTimeout(function(){
        document.getElementById("blinkingOverlay").style.display = "none";
        setHint();
        noRunningTanks = true; // Tanks have finished running and user is able to set mines.
        beginUserTimer();
    }, timeForAllPaths);

    setTimeout(function(){
        document.getElementById("blinkingOverlay").style.display = "block";
        noRunningTanks = false;

        replay(timeForAllPaths); // need to adjust for blue squares

        document.getElementById("tankCount").style.backgroundColor = "white";
        document.getElementById("tankCount").style.color = "black";
        document.getElementById("tankCount").innerHTML = "# of Tanks Destroyed";

        document.getElementById("mineCount").innerHTML = "Only Need: " + getMinimum();

        document.getElementById("killCount").style.backgroundColor = "rgba(200, 71, 8, 0.877)";
        document.getElementById("killCount").style.color = "white";
        document.getElementById("killCount").innerText = tankStartPositions.length + " Tanks";   

    }, timeForPlaying);

    setTimeout(function() {
        document.getElementById("blinkingOverlay").style.display = "none";
        showResults();
    }, (timeForPlaying + timeForAllPaths + 500));
}

function runGameEasy() {
    setGameBoxes();
    document.getElementById("welcomeOverlay").style.display = "none";
    document.getElementById("blinkingOverlay").style.backgroundColor = "transparent";
    document.getElementById("blinkingOverlay").style.display = "block";

    setTimeout(function() {
        runGame("easy");
        document.getElementById("tankCount").innerText = "3 Tanks";
        document.getElementById("tankCount").style.backgroundColor = "rgba(200, 71, 8, 0.877)";
        document.getElementById("tankCount").style.color = "white";
    }, 1000);
}

function runGameMedium() {
    setGameBoxes();
    document.getElementById("welcomeOverlay").style.display = "none";
    document.getElementById("blinkingOverlay").style.backgroundColor = "transparent";
    document.getElementById("blinkingOverlay").style.display = "block";

    setTimeout(function() {
        runGame("medium");
        document.getElementById("tankCount").innerText = "4 Tanks";
        document.getElementById("tankCount").style.backgroundColor = "rgba(200, 71, 8, 0.877)";
        document.getElementById("tankCount").style.color = "white";
    }, 1000);
}

function runGameHard() {
    setGameBoxes();
    document.getElementById("welcomeOverlay").style.display = "none";
    document.getElementById("blinkingOverlay").style.backgroundColor = "transparent";
    document.getElementById("blinkingOverlay").style.display = "block";

    setTimeout(function() {
        runGame("hard");
        document.getElementById("tankCount").innerText = "5 Tanks";
        document.getElementById("tankCount").style.backgroundColor = "rgba(200, 71, 8, 0.877)";
        document.getElementById("tankCount").style.color = "white";
    }, 1000);
}

function getRules() {
    var rules = "The goal of the game is simple! Memorize the path of the tanks and destroy them with as few mines as possible. The first half of the game is just observation after the tanks make their first run you'll have ten seconds to place your mines. Follow their paths closely! You never know when they might intersect. You may just get a two-for-one! ";
    alert(rules);
}