class logic {
    constructor() {
      this.board = [];
      this.columSize = [0, 0, 0, 0, 0, 0, 0];
      this.nextSpot = 0;
      this.win = false;
      this.rows = 6;
      this.columns = 7;
      this.currentPlayer = "red";

      // creates 2d array
      for (let i = 0; i < this.rows; i++) {
      this.board[i] = [];
      for (let k = this.columns - 1; k >= 0; k--)
        this.board[i][k] = "-";
      }//end outer for
        
    }//end constructor
  


    setPiece(locate) {

    //find the next available spot in the colum
    this.nextSpot = this.columSize[locate[0]];

    locate = locate[0] + "-" + this.nextSpot;


    //check if rows in the column is full
    if (this.nextSpot < this.rows) {

        this.board[locate[2]][locate[0]] = this.currentPlayer;
        this.columSize[locate[0]]++;
    }
    }



    nextPlayer(){
        //alternates current player
        this.currentPlayer === "red" ? this.currentPlayer = "yellow" : this.currentPlayer = "red";
    }




    checkWin() {
        let count = 0;
        let winningCells = [];
        let x = 0;
    
        // check for horizontal win
        for (let i = 0; i < this.rows; i++) {
            for (let k = 1; k < this.columns; k++) {
                //console.log(this.board[i][k - 1], this.board[i][k], this.board[i][k - 1] === this.board[i][k] && this.board[i][k] != "-", count)
                if (this.board[i][k - 1] === this.board[i][k] && this.board[i][k] != "-") {
                    count++;
                    // add winning cell into array for highlighting
                    winningCells.push(`${k-1}-${i}`);
    
                    if (count >= 3) {
                        console.log("Wins the game by Horizontal");
                        winningCells.push(`${k}-${i}`);
                        return [true, winningCells, this.currentPlayer];
                    }
    
                }//end outer if
                else{
                    count = 0;
                    winningCells = [];
                }
            }
            count = 0;
            winningCells = [];
        }//end outer for
    
    
    
    
        // check for vertical win
        for (let i = 0; i < this.columns; i++) {
            for (let k = 1; k < this.rows; k++) {
                if (this.board[k - 1][i] === this.board[k][i] && this.board[k][i] != "-") {
                    winningCells.push(`${i}-${k-1}`);
                    count++;
    
                    if (count >= 3) {
                        console.log("Wins the game by vertical");
                        winningCells.push(`${i}-${k}`);
                        return [true, winningCells, this.currentPlayer];
                    }
    
                }//end outer if
                else{
                    count = 0;
                    winningCells = [];
                }
            }
            count = 0;
            winningCells = [];
        }//end outer for
    
    
    
        // check for diagonal win going left
        for (let i = 0; i < this.rows - 3; i++) {
            x = i;
            for (let k = this.columns; k > 0; k--) {
                if (this.board[x + 1][k - 1] === this.board[x][k] && this.board[x][k] != "-") {
                    count++;
                    winningCells.push(`${k-1}-${x+1}`);
    
                    if (count >= 3) {
                        winningCells.push(`${k+2}-${x-2}`);
                        console.log("Wins the game by diagonal left");
                        return [true, winningCells, this.currentPlayer];
                    }
                    x++;
    
                }//end outer if
                else {
                    count = 0;
                    winningCells = [];
                }
                }
                count = 0;
                winningCells = [];
        }//end outer for
    
    
         // check for diagonal win going right
         for (let i = 0; i < this.rows - 3; i++) {
            x = i;
            for (let k = 0; k < this.columns; k++) {
                if (this.board[x + 1][k + 1] === this.board[x][k] && this.board[x][k] != "-") {
                    winningCells.push(`${k+1}-${x+1}`);
                    count++;
    
                    if (count >= 3) {
                        winningCells.push(`${k-2}-${x-2}`);
                        console.log("Wins the game by diagonal right");
                        return [true, winningCells, this.currentPlayer];
                    }
                    x++;
    
                }//end outer if
                else{
                    count = 0;
                    winningCells = [];
                }
            }
        }//end outer for
    
        return false
    }//end check win





//if columsize array is full we have a draw
checkdraw(){
    let count = 0;
    for(let i = 0; i < this.columSize.length; i++){
        if(this.columSize[i] === 6)
            count++
    }

    if(count == 7){
        console.log("Its a Draw")
        return true
    }

    return false

}//end checkdraw




//clears the arrays for tracking a win
reset() {
    console.log("RESET GAME logic");

    this.win = false;

    //clear arrays used to check for win
    for (let i = 0; i < this.rows; i++) {
        this.board[i] = [];
        for (let k = this.columns - 1; k >= 0; k--)
          this.board[i][k] = "-";
        }//end outer for
  
    this.columSize = [0, 0, 0, 0, 0, 0, 0];

}//end reset



}



module.exports = logic
  