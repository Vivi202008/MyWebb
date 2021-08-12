"use strict";

function drawBoard() {
    //clear game's board
    document.getElementById("board").innerHTML = "";
    //draw map
    for (let y = 0; y < tileMap01.mapGrid.length; y++) {
        const line = tileMap01.mapGrid[y]
        for (let x = 0; x < line.length; x++) {
            let blockDiv = document.createElement("div");
            blockDiv.id = x + "," + y;//id for element
            blockDiv.classList.add("tile-space");

            if (line[x][0] !== " ") {
                blockDiv.classList.add(...line[x][0].split("").map(getClass));
            }
            document.getElementById("board").appendChild(blockDiv);
        }
    }
}

function getClass(value) {
    switch (value) {
        case "W":
            return Tiles.Wall;
            break;
        case " ":
            return Tiles.Space;
            break;
        case "G":
            return Tiles.Goal;
            break;
        case "P":
            return Entities.Character;
            break;
        case "B":
            return Entities.Block;
            break;
        case "BG":
            return Entities.BlockDone;
            break;
        case "PG":
          return "player arrives a goal";
          break;
    }
}

drawBoard();

//player play----key event
document.addEventListener('keydown', onKeyPressListner)

function onKeyPressListner(event) {
    event.preventDefault();
    const playerDiv = document.getElementsByClassName(Entities.Character)[0];  //find player
    const [x, y] = playerDiv.id.split(",").map(Number);//get player's id
    
    switch (event.key) {
        case "ArrowLeft":
            {
                moveToLeft(x, y)
                break;
            }
        case "ArrowRight":
            {
                moveToRight(x, y)
                break;
            }
        case "ArrowUp":
            {
                moveUpwards(x, y)
                break;
            }
        case "ArrowDown":
            {
                moveDownwards(x, y);
                break;
            }
    }

    //Show result
    let blockInGoal=0;
    for (let y = 0; y < tileMap01.mapGrid.length; y++) {
        for (let x = 0; x < tileMap01.mapGrid[y].length; x++) {
            
            if(tileMap01.mapGrid[y][x]=="BG"){
                blockInGoal++;
                if(blockInGoal===1){
                    document.getElementById("gameResult").innerHTML="You have moved a box to goal."
                }else{
                    document.getElementById("gameResult").innerHTML="You have moved "+blockInGoal+" boxes to goal."
                }
                
            }
        }
    }
    
    if (blockInGoal===6){
        document.getElementById("gameResult").innerHTML="Wow, you win!!!"
        document.getElementById("moveTimes").innerHTML="You moved a total of "+moveTimes+" steps.";
    } 
}

function moveToLeft(x, y) {
    let objectStart = tileMap01.mapGrid[y][x][0];
    let [toX, toY] = [x - 1, y]
    let objectEnd = tileMap01.mapGrid[toY][toX][0];

    if (objectStart.includes("B")) {
        move(x, y, toX, toY);
    } else if (objectStart.includes("P")) {
        if (objectEnd.includes("B")) {
            moveToLeft(toX, toY);
        }
        move(x, y, toX, toY);
    }
}

function moveToRight(x, y) {
    let objectStart = tileMap01.mapGrid[y][x][0];
    let [toX, toY] = [x + 1, y]
    let objectEnd = tileMap01.mapGrid[toY][toX][0];

    if (objectStart.includes("B")) {
        move(x, y, toX, toY);
    } else if (objectStart.includes("P")) {
        if (objectEnd.includes("B")) {
            moveToRight(toX, toY);
        }
        move(x, y, toX, toY);
    }
}

function moveUpwards(x, y) {
    let objectStart = tileMap01.mapGrid[y][x][0];
    let [toX, toY] = [x, y - 1]
    let objectEnd = tileMap01.mapGrid[toY][toX][0];

    if (objectStart.includes("B")) {
        move(x, y, toX, toY);
    } else if (objectStart.includes("P")) {
        if (objectEnd.includes("B")) {
            moveUpwards(toX, toY);
        }
        move(x, y, toX, toY);
    }
}

function moveDownwards(x, y) {
    let objectStart = tileMap01.mapGrid[y][x][0];
    let [toX, toY] = [x, y + 1]
    let objectEnd = tileMap01.mapGrid[toY][toX][0];

    if (objectStart.includes("B")) {
        move(x, y, toX, toY);
    } else if (objectStart.includes("P")) {
        if (objectEnd.includes("B")) {
            moveDownwards(toX, toY);
        }
        move(x, y, toX, toY);
    }
}

let moveTimes=0;

function move(x, y, toX, toY) {
    let start = tileMap01.mapGrid[y][x]
    let end = tileMap01.mapGrid[toY][toX]

    function moveStartToEnd(movedObject) {
        if (start[0] === movedObject && end[0] === "G") {
            start[0] = " ";
            end[0] = movedObject + "G";
        } else if (start[0] === movedObject + "G") {
            if (end[0] === "G") {
                start[0] = "G";
                end[0] = movedObject + "G";
            }
            if (end[0] === " ") {
                start[0] = "G";
                end[0] = movedObject;
            }
        } else {
            start[0] = " ";
            end[0] = movedObject;
        }
    }

    if (!["W", "B", "BG"].includes(end[0])) {  //Avoid players into the box or the wall
        if (start[0].includes("P")) {
            moveStartToEnd("P");
            moveTimes++;   //count times that player have moved.
            if (moveTimes===1){
                document.getElementById("moveTimes").innerHTML="You have moved a step. ";
            }else{
                document.getElementById("moveTimes").innerHTML="You have moved "+moveTimes+" steps. ";
            }

        } else {
            moveStartToEnd("B");
        }

        drawBoard();  //draw new board after player moves.          
    }
}


