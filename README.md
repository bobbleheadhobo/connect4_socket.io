# connect4_socket.io

## Overview

Multiplayer Connect 4 game using Socket.IO. Players take turns dropping pieces into a grid to get 4 in a row.

## How to Play

- Install dependencies with `npm install`
- Start server with `node server.js`
- Open `localhost:3000` in multiple browser tabs/windows for multiplayer

## Code

### server.js

- Sets up Node.js server with Socket.IO 
- Listens for events like 'connection', 'disconnect', 'setPiece'
- Emits events like 'updateBoard', 'yourTurn' to clients 

### logic.js

- Game logic for board updates, win checks, etc.

### connect4.js 

- Client-side JS - renders UI, handles socket events

### connect4.css 

- Styles for the game 

### connect4.html

- Basic HTML structure

## Credits

By Joey Troyer
