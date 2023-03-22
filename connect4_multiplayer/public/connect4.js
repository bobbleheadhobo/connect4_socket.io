
// 'use strict'
let socket;
var win = false;
var rows = 6;
var columns = 7;
var cell;


socket = io();

socket.emit("joined");

//wait for page to load
document.addEventListener('DOMContentLoaded', () => {
    setBoard();
})



//function to write all the html elements of the board
function setBoard() {
    //creates the array for tracking colum size
    columSize = [0, 0, 0, 0, 0, 0, 0];


    for (let i = 0; i < columns; i++) {

        //create a div for each colum to put the cells in 
        const column = document.createElement("div");
        column.classList.add("column");

        //loop in reverse so that the bottom of the board is row zero
        for (let k = rows - 1; k >= 0; k--) {

            //creates each cell with an event listener
            const cell = document.createElement("div");
            cell.addEventListener("click", setPiece);
            cell.classList.add("cell");

            //give each cell an id that corresponds to it cordinates
            cell.id = i + "-" + k;
            column.appendChild(cell);
        }
        //add column with cells in it to the board div already in the html
        document.getElementById("board").appendChild(column);
    }
}





//updates board on screen
socket.on("updateBoard", (newboard) => {
    console.log("client Update board")
    console.table(newboard);

    for (let i = 0; i < rows; i++) {
        for (let k = 0; k < columns; k++) {
            let cell = document.getElementById(k + "-" + i)
            // console.log(k + "-" + i)


            //switch to change color of cells
            switch(newboard[i][k]) {
                case "red":
                    cell.classList.add("red");
                    break;
                
                case "yellow":
                    cell.classList.add("yellow");
                    break;

                default:
                    cell.classList.remove("red", "yellow");
                    break;
            }//end of switch
        }
    }

});



// this refers to element cell
function setPiece() {

    //if win is true do nothing
    if (win)
        return

    //get cords of div
    let locate = this.id;

    socket.emit("setPiece", locate)

}//end setPiece




//displays win and flashes winning cells
socket.on("win", ({winningCells, currentPlayer}) => {
    win = true;

    //adds text to current player wins to win div
    let winElement = document.querySelector('.win');
    winElement.innerHTML = "Congratulations! " + currentPlayer + " wins!";
    winElement.style.color = currentPlayer;


    // loop through the winning cells and add a "highlight" class to them
    for (let cell of winningCells) {
        // console.log(cell)
        document.getElementById(cell).classList.add("highlight");
    }

});//end win


//displays draw
socket.on("draw", () => {
    //adds text to win div and makes it visible
    let winElement = document.querySelector('.win');
    winElement.innerHTML = "Draw!";

    // Change the display property to "block"
    winElement.style.display = 'block';
});



function reset() {

    columSize = [0, 0, 0, 0, 0, 0, 0];

    socket.emit("reset");
    
    win = false;

     //change text and color in win div
     let winElement = document.querySelector('.win');
     winElement.innerHTML = "CONNECT 4";
     winElement.style.color = "black";

}//end reset


socket.on("reset", () => {
    //gets all cells and puts them in array cell
    let cell = document.querySelectorAll('.cell');

    //reset all cells colors
    for (let i = 0; i < cell.length; i++) {
        // console.log(cell[i]);
        cell[i].classList.remove("red");
        cell[i].classList.remove("yellow");
        cell[i].classList.remove("highlight");
    }
})



socket.on("yourTurn", () => {
    if(win)
        return;

    // Display the message on the page
    let winElement = document.querySelector('.win');
    winElement.innerHTML = "Your Turn";
    winElement.style.color = "black";
  });


  socket.on("notYourTurn", () => {
    if(win)
        return;
        
    // Display the message on the page
    let winElement = document.querySelector('.win');
    winElement.innerHTML = "Connect4";
    winElement.style.color = "black";
  });