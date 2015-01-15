var fps = 7.5;
var W = 432;
var H = 528;
var X = 0;
var Y = 0;
ITER = 0;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle="#000000";
ctx.fillRect(0,0,432,528);
var canvasData = ctx.getImageData(0,0,432,528);
ctx.putImageData(canvasData,0,0);

var gameStatus = {
    points: 0,
    fps: 7.5,
    boardW: 432,
    boardH: 528
}


var keyPresses = [ 0 ];

var storedFunctions = [];

var tetro = {
    position: {x: (W-48)/2,y:0},
    boundaryPoints: [ [ 18, 36, 54,{x:24,y:48},{x:48,y:48}], [ 48, 48, 48 ] ]
}

function Tetro(imgSrc, xBound1, yBound1, xBound2, yBound2, xBound3, yBound3) {
    this.image = new Image();
    this.image.src = imgSrc,
    this.boundaryPoints = [ xBound1, yBound1, xBound2, yBound2, xBound3, yBound3 ]  
}

var tetroO = new Tetro("images/tetro_o.png", 12, 48, 36, 48, 36, 48);
var tetroT = new Tetro("images/tetro_t.png", 12, 48, 36, 48, 60, 48);
var tetroT1 = new Tetro("images/tetro_t1.png", 12, 48, 36, 72, 36, 72);
var tetroT2 = new Tetro("images/tetro_t2.png", 12, 24, 36, 48, 60, 24);
var tetroT3 = new Tetro("images/tetro_t3.png", 12, 72, 36, 48, 36, 48);
var tetroI = new Tetro("images/tetro_i.png", 12, 96, 12, 96, 12, 96);
var tetroI1 = new Tetro("images/tetro_i1.png", 12, 24, 36, 24, 84, 24);
var tetroJ = new Tetro("images/tetro_j.png", 12, 48, 36, 48, 60, 48);
var tetroJ1 = new Tetro("images/tetro_j1.png", 12, 72, 36, 72, 12, 72);
var tetroJ2 = new Tetro("images/tetro_j2.png", 12, 24, 36, 24, 60, 48);
var tetroJ3 = new Tetro("images/tetro_j3.png", 12, 72, 36, 24, 36, 24);
var tetroL = new Tetro("images/tetro_l.png", 12, 48, 36, 48, 60, 48);
var tetroL1 = new Tetro("images/tetro_l1.png", 12, 24, 36, 72, 36, 72);
var tetroL2 = new Tetro("images/tetro_l2.png", 12, 48, 36, 24, 60, 24);
var tetroL3 = new Tetro("images/tetro_l3.png", 12, 72, 36, 72, 36, 72);
var tetroZ = new Tetro("images/tetro_z.png", 12, 24, 36, 48, 60, 48);
var tetroZ1 = new Tetro("images/tetro_z1.png", 12, 72, 36, 48, 36, 48);
var tetroS = new Tetro("images/tetro_s.png", 12, 48, 36, 48, 60, 24);
var tetroS1 = new Tetro("images/tetro_s1.png", 12, 48, 36, 72, 36, 72);
var currTetro = new Tetro("images/tetro_o.png", 12, 48, 36, 48, 36, 48)

function rotateTetro() {
    if (currTetro == tetroJ) {
        currTetro = tetroJ1;
    } else if (currTetro == tetroJ1) {
        currTetro = tetroJ2;
    } else if (currTetro == tetroJ2) {
        currTetro = tetroJ3;
    } else if (currTetro == tetroJ3) {
        currTetro = tetroJ;
    } else if (currTetro == tetroT) {
        currTetro = tetroT1;
    } else if (currTetro == tetroT1) {
        currTetro = tetroT2;
    } else if (currTetro == tetroT2) {
        currTetro = tetroT3;
    } else if (currTetro == tetroT3) {
        currTetro = tetroT;
    } else if (currTetro == tetroI) {
        currTetro = tetroI1;
    } else if (currTetro == tetroI1) {
        currTetro = tetroI;
    } else if (currTetro == tetroL) {
        currTetro = tetroL1;
    } else if (currTetro == tetroL1) {
        currTetro = tetroL2;
    } else if (currTetro == tetroL2) {
        currTetro = tetroL3;
    } else if (currTetro == tetroL3) {
        currTetro = tetroL;
    } else if (currTetro == tetroS) {
        currTetro = tetroS1;
    } else if (currTetro == tetroS1) {
        currTetro = tetroS;
    } else if (currTetro == tetroZ) {
        currTetro = tetroZ1;
    } else if (currTetro == tetroZ1) {
        currTetro = tetroZ;
    }
}

function drawCanvas() {
    ctx.putImageData(canvasData,0,0);
}

function copyCanvas() {
    canvasData = ctx.getImageData(0,0,432,528);
}


function drawTetro(tetro,xpos,ypos) {
    ctx.drawImage(tetro,xpos,ypos);
}

function detectCollision() {
    getHitInfo();
    if (tetro.position.y + currTetro.image.height == H || (currTetro.hit1.data[0] != 0 || currTetro.hit2.data[1] !=0 || currTetro.hit3.data[0] != 0)) {
        rowCheck();
        resetTetro();
        copyCanvas();
        ITER++;
    }
}

function rowCheck() {
    var imgDataArray = [ [],
                         [],
                         [],
                         [],
                         [],
                         [],
                         [] ];
    var positionArray = [ 516, 492, 468, 444, 420, 396, 372 ];
    for (var j=0; j<positionArray.length; j++) {
        for (var x=12; x<420; x+=24) {
            var imgData = ctx.getImageData(x,positionArray[j],1,1);
            imgDataArray[j].push(imgData);
        }
    }
    
    for (var m=0; m<imgDataArray.length; m++) {
        var rowChecked = checkRows(m,imgDataArray);
        if (rowChecked == true) {
            clearRow(m);
        }
    }

}
    
function checkRows(row, imgDataArray) {
    for (var i=0; i<imgDataArray[row].length; i++) {
        if (imgDataArray[row][i].data[0] == 0 && imgDataArray[row][i].data[1] == 0 && imgDataArray[row][i].data[2] == 0) {
            return false;
        }
    }
    return true;
}

function clearRow(row) {
    var arrayRow = [ 504, 480, 456, 432, 408, 384, 360 ];
    var savedCanvas = ctx.getImageData(0,0,W,arrayRow[row]);
    ctx.putImageData(savedCanvas,0,24);
    gameStatus.points+=100;
    var score = document.getElementById("score");
    score.innerHTML = "SCORE: " + gameStatus.points;
}

function resetTetro(){
    tetro.position.y = 0;
    currTetro = randomizeTetro();
    tetro.position.x = (W-48)/2;
}

var storedT = [ tetroO, tetroI, tetroJ, tetroL, tetroT, tetroZ, tetroS ];

function randomizeTetro() {
    //return storedT[1];
    var randomTetro = Math.floor(Math.random()*7);
    return storedT[randomTetro];
}

var gameStart = setInterval(updateGameState, 1000 / fps);

function updateGameState() {
    drawCanvas();
    copyCanvas();
    tetro.position.y+=12;
    moveX();
    drawTetro(currTetro.image,tetro.position.x,tetro.position.y);
    detectCollision();
}

function getHitInfo() {
    currTetro.hit1 = ctx.getImageData(tetro.position.x+currTetro.boundaryPoints[0],tetro.position.y+currTetro.boundaryPoints[1]+1,1,1);
    currTetro.hit2 = ctx.getImageData(tetro.position.x+currTetro.boundaryPoints[2],tetro.position.y+currTetro.boundaryPoints[3]+1,1,1);
    currTetro.hit3 = ctx.getImageData(tetro.position.x+currTetro.boundaryPoints[4],tetro.position.y+currTetro.boundaryPoints[5]+1,1,1)   
}

function moveX(eraseArray) {
    tetro.position.x+=keyPresses[0];
    tetro.position.x = Math.max(0, Math.min(tetro.position.x, (W - currTetro.image.width)));
    keyPresses.unshift(0);
}

function dropDownTetro() {
    while (tetro.position.y != 0) {
        tetro.position.y+=12;
        getHitInfo();
        if (tetro.position.y + currTetro.image.height == H || (currTetro.hit1.data[0] != 0 || currTetro.hit2.data[1] !=0 || currTetro.hit3.data[0] != 0)) {
            drawCanvas();
            drawTetro(currTetro.image,tetro.position.x,tetro.position.y);
            rowCheck();
            copyCanvas();
            resetTetro();
            ITER++;
        }
    }
}

function storeKey(ev) {
    arrows = ((ev.which))||((ev.keyCode));

    switch(arrows){
        case 32:
            dropDownTetro();
        case 37:
            keyPresses.unshift(-24);
            break;
        case 38:
            rotateTetro();
            break;
        case 39:
            keyPresses.unshift(24);
            break;
        case 40:
            tetro.position.y+=12;
            break;
            }
        }


    