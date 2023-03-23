const express = require('express');
const socket = require('socket.io');
const app = express();
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const logic = require("./public/logic.js");

//get gamelogic object
const gameLogic = new logic();

const io = socket(server);

const players = [];

app.use(express.static('public'));

var current = 0;


//open the connection
io.on("connection", (socket) => {
  //fills player array with ids
  players.push(socket.id);
  console.log(players);

  //update board for new users
  io.emit("updateBoard", gameLogic.board); 


  if(players.length > 2){
    io.to(players.slice(2, players.length)).emit("spectate");
    console.log("spectators:   " + players.slice(2, players.length));
  }


  //removes player from array if they disconnect
  socket.on("disconnect", () => {
    const index = players.indexOf(socket.id);
    if (index !== -1) {
      players.splice(index, 1);
      console.log("Player " + socket.id + " has disconnected.");
    }

    //remove spectator message if someone disconnects
    if(players.length > 2){
      io.to(players.slice(2, players.length)).emit("spectate");
      console.log("spectators:   " + players.slice(2, players.length));
    }
  });

    //tell the player its their turn at the start
    io.to(players[current]).emit("yourTurn");
  
    //recives setPiece request
    socket.on("setPiece", (locate) =>{
      if(socket.id === players[current]) {

        //set specator
        if(players.length > 2){
          io.to(players.slice(2, players.length)).emit("spectate");
          console.log("spectators:   " + players.slice(2, players.length));
        }

        //send message that its not their turn now
        io.to(players[current]).emit("notYourTurn");
        
        //adds cell to 2d array board
        gameLogic.setPiece(locate);
        //update cells on the board
        io.emit("updateBoard", gameLogic.board); 
        
        
        //check for draw
        if(gameLogic.checkdraw()){
            io.emit("draw");
        }//end if
      
        else {
        //check for a win and get winning cells    result[0] is boolean t/f    result[1] is array of cords of winning cells
        result = gameLogic.checkWin();
        if(result[0])
          io.emit("win", { winningCells: result[1], currentPlayer : result[2]});
        }//end else
      
        //changes the player color
        gameLogic.nextPlayer();

        //alternates between 1 and 0 to changes players turn
        current = (current + 1) % 2;

        //tells the next player its their turn
        io.to(players[current]).emit("yourTurn");

    }//end if to only let one player move per turn
    });


//resets the board for everyone
socket.on("reset", () => {
  console.log("reset game server");
  gameLogic.reset();
  io.emit("reset");
})


});

server.listen(port, () => console.log(`Server is up and ready on ${port}`));

