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

  io.emit("updateBoard", gameLogic.board); 


  //removes player from array if they disconnect
  socket.on("disconnect", () => {
    const index = players.indexOf(socket.id);
    if (index !== -1) {
      players.splice(index, 1);
      console.log("Player " + socket.id + " has disconnected.");
    }
  });

    io.to(players[current]).emit("yourTurn");
  
    //recives setPiece request
    socket.on("setPiece", (locate) =>{
      if(socket.id === players[current]) {

        //send message that its their turn
        io.emit("notYourTurn");
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

        //alternates between 1 and 0
        current = (current + 1) % 2;
        io.to(players[current]).emit("yourTurn");

    }//end if
    });



socket.on("reset", () => {
  console.log("reset game server");
  gameLogic.reset();
  io.emit("reset");
})


});

server.listen(port, () => console.log(`Server is up and ready on ${port}`));

