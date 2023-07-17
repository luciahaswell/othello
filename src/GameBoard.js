import React, { useState, useEffect } from 'react';

const GameBoard = () => {

    //initializing the board
    let board = [];
    for (let i = 0; i < 8; i++) {
        board.push(Array(8).fill(""));
    }
    board[3][3] = 'W';
    board[3][4] = 'O';
    board[4][3] = 'O';
    board[4][4] = 'W';

    const [boardSpaces, setBoardSpaces] = useState(board);
    const [currentTurn, setCurrentTurn] = useState('O');
    const oppositeTurn = currentTurn === 'O' ? 'W' : 'O';
    const [showPopUpWin, setShowPopUpWin] = useState(false);
    const [winningMessage, setWinningMessage] = useState('null');
    let [orangeScore, setOrangeScore] = useState(2);
    let [whiteScore, setWhiteScore] = useState(2);

    //recalculating the score of the game
    useEffect(() => {
        // Calculating score
        let newOrangeScore = 0;
        let newWhiteScore = 0;
        const testBoard3 = JSON.parse(JSON.stringify(boardSpaces));
        for (let row of testBoard3) {
            for (let cell of row) {
                if (cell === 'W') {
                    newWhiteScore++;
                } else if (cell === 'O') {
                    newOrangeScore++;
                }
            }
        }
        // Update the scores immediately
        setOrangeScore(newOrangeScore);
        setWhiteScore(newWhiteScore);
    }, [boardSpaces]);


    const canIGoHere = (rowIndex, colIndex) => {
        // where did i just click?
        /*
        const testBoard = boardSpaces.map(row => [...row]);
        */
        const testBoard = JSON.parse(JSON.stringify(boardSpaces));
        const testBoard2 = JSON.parse(JSON.stringify(boardSpaces));
        testBoard[rowIndex][colIndex] = 'new';

        const createClickedCol = () => {
            let clickedCol = []
            for (const row of testBoard) {
                clickedCol.push(row[colIndex]);
            }
            return clickedCol;
        }

        const createClickedDiagLeft = () => {
            let diagLeft = [];
            let x = rowIndex;
            let y = colIndex;
            //finding the start for the left diagonal
            //moving from top left to bottom right
            while (x < 8 && y < 8 && x >= 0 && y >= 0) {
                y--;
                x--;
            };
            //resetting if it goes too far
            if (x > 7 || y > 7 || x < 0 || y < 0) {
                y++;
                x++;
            }
            //creating the array of the leftdiagonal 
            //by moving from start to bottom right            
            while (x < 8 && y < 8 && x >= 0 && y >= 0) {
                diagLeft.push(testBoard[x][y]);
                x++;
                y++;
            }
            return diagLeft;
        }

        const createClickedDiagRight = () => {
            let diagRight = [];
            let i = rowIndex;
            let j = colIndex;
            //finding the start for the right diagonal
            //moving from bottom left to top right
            while (i < 8 && j < 8 && i >= 0 && j >= 0) {
                i++;
                j--;
            }
            //resetting if it goes too far
            if (i > 7 || j > 7 || i < 0 || j < 0) {
                i--;
                j++;
            }
            //creating the array of the right diagonal
            //moving from start to top right
            while (i < 8 && j < 8 && i >= 0 && j >= 0) {
                diagRight.push(testBoard[i][j]);
                i--;
                j++;
            }
            return diagRight;
        }

        //creating an array of all of the peripherals of the cell clicked
        let clickedRow = testBoard[rowIndex];
        let clickedCol = createClickedCol();
        let clickedDiagLeft = createClickedDiagLeft();
        let clickedDiagRight = createClickedDiagRight();
        const periph = [clickedRow, clickedCol, clickedDiagLeft, clickedDiagRight];

        //assuming at first that you cant play here unless proven wrong
        let yesGoHere = false;

        //checking in each peripheral to see if you can go here
        for (let row of periph) {
            //the index in the row of where you are clicking 
            let newIndex = row.indexOf('new');
            //an empty array of which indexes need to change in the particular row
            let changeIndex = [];

            //test skip right 
            // you're x -- ["x","o","new"] or ["x","o","o","new"];
            let moveLeft = newIndex - 1;
            //checking if the chip to the left is the opposite color
            while (row[moveLeft] === oppositeTurn) {
                changeIndex.push(moveLeft);
                moveLeft--;
            }
            // resetting in cases that look like this
            // ["o","o","new"]

            if (row[moveLeft] !== currentTurn && changeIndex.length > 0) {
                changeIndex = [];
            }
            if (changeIndex.length > 0) {
                for (let x of changeIndex) {
                    row[x] = currentTurn;
                }
                yesGoHere = yesGoHere || true;
            }

            //test skip left
            let moveRight = newIndex + 1;
            changeIndex = [];
            while (row[moveRight] === oppositeTurn) {
                changeIndex.push(moveRight);
                moveRight++;
            }
            if (row[moveRight] !== currentTurn && changeIndex.length > 0) {
                changeIndex = [];
            }
            if (changeIndex.length > 0) {
                for (let x of changeIndex) {
                    row[x] = currentTurn;
                }
                yesGoHere = yesGoHere || true;
            }
        }

        if (yesGoHere && testBoard2[rowIndex][colIndex] === '') {
            let newRow = periph[0].map(value => value === 'new' ? currentTurn : value);
            let newCol = periph[1].map(value => value === 'new' ? currentTurn : value);
            let newLeftDiag = periph[2].map(value => value === 'new' ? currentTurn : value);
            let newRightDiag = periph[3].map(value => value === 'new' ? currentTurn : value);

            //create a new board to update
            let newBoard = JSON.parse(JSON.stringify(boardSpaces));

            /// Update the row that changed with the new values
            newBoard[rowIndex] = newRow;

            // Update the column that changed with the new values
            for (let i = 0; i < newCol.length; i++) {
                newBoard[i][colIndex] = newCol[i];
            }

            // Update the left diagonal of the cell

            let q = rowIndex;
            let r = colIndex;

            while (q < 8 && r < 8 && q >= 0 && r >= 0) {
                q--;
                r--;
            };
            if (q > 7 || r > 7 || r < 0 || q < 0) {
                q++;
                r++;
            }
            let i = 0;
            while (i < newLeftDiag.length) {
                while (q < 8 && r < 8 && q >= 0 && r >= 0) {
                    newBoard[q][r] = newLeftDiag[i];
                    q++;
                    r++;
                    i++;
                }
            }

            // Update the right diagonal of the cell
            let m = rowIndex;
            let n = colIndex;
            while (m < 8 && n < 8 && m >= 0 && n >= 0) {
                m++;
                n--;
            }
            if (m > 7 || n > 7 || m < 0 || n < 0) {
                m--;
                n++;
            }
            i = 0;
            while (i < newRightDiag.length) {
                while (m < 8 && n < 8 && m >= 0 && n >= 0) {
                    newBoard[m][n] = newRightDiag[i];
                    m--;
                    n++;
                    i++;
                }
            }
            setBoardSpaces(newBoard);
            setCurrentTurn(currentTurn === 'W' ? 'O' : 'W');
            return true;
        }
        return false;
    }

    //checking if there are spaces to go
    const anySpacesToGo = (rowIndex, colIndex) => {
        // where did i just click?

        const testBoard = JSON.parse(JSON.stringify(boardSpaces));
        testBoard[rowIndex][colIndex] = 'new';

        const createClickedCol = () => {
            let clickedCol = []
            for (const row of testBoard) {
                clickedCol.push(row[colIndex]);
            }
            return clickedCol;
        }

        const createClickedDiagLeft = () => {
            let diagLeft = [];
            let x = rowIndex;
            let y = colIndex;
            //finding the start for the left diagonal
            //moving from top left to bottom right
            while (x < 8 && y < 8 && x >= 0 && y >= 0) {
                y--;
                x--;
            };
            //resetting if it goes too far
            if (x > 7 || y > 7 || x < 0 || y < 0) {
                y++;
                x++;
            }
            //creating the array of the leftdiagonal 
            //by moving from start to bottom right            
            while (x < 8 && y < 8 && x >= 0 && y >= 0) {
                diagLeft.push(testBoard[x][y]);
                x++;
                y++;
            }
            return diagLeft;
        }

        const createClickedDiagRight = () => {
            let diagRight = [];
            let i = rowIndex;
            let j = colIndex;
            //finding the start for the right diagonal
            //moving from bottom left to top right
            while (i < 8 && j < 8 && i >= 0 && j >= 0) {
                i++;
                j--;
            }
            //resetting if it goes too far
            if (i > 7 || j > 7 || i < 0 || j < 0) {
                i--;
                j++;
            }
            //creating the array of the right diagonal
            //moving from start to top right
            while (i < 8 && j < 8 && i >= 0 && j >= 0) {
                diagRight.push(testBoard[i][j]);
                i--;
                j++;
            }
            return diagRight;
        }

        //creating an array of all of the peripherals of the cell clicked
        let clickedRow = testBoard[rowIndex];
        let clickedCol = createClickedCol();
        let clickedDiagLeft = createClickedDiagLeft();
        let clickedDiagRight = createClickedDiagRight();
        const periph = [clickedRow, clickedCol, clickedDiagLeft, clickedDiagRight];

        //checking in each peripheral to see if you can go here
        for (let row of periph) {
            //the index in the row of where you are clicking 

            let newIndex = row.indexOf('new');
            //an empty array of which indexes need to change in the particular row
            let changeIndex = [];

            //test skip right 
            // you're x -- ["x","o","new"] or ["x","o","o","new"];
            let moveLeft = newIndex - 1;
            //checking if the chip to the left is the opposite color
            while (row[moveLeft] === oppositeTurn) {
                changeIndex.push(moveLeft);
                moveLeft--;
            }
            // resetting in cases that look like this
            // ["o","o","new"]

            if (row[moveLeft] !== currentTurn && changeIndex.length > 0) {
                changeIndex = [];
            }
            if (changeIndex.length > 0) {
                return true;
            }

            //test skip left
            let moveRight = newIndex + 1;
            changeIndex = [];
            while (row[moveRight] === oppositeTurn) {
                changeIndex.push(moveRight);
                moveRight++;
            }
            if (row[moveRight] !== currentTurn && changeIndex.length > 0) {
                changeIndex = [];
            }
            if (changeIndex.length > 0) {
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        const testBoard2 = JSON.parse(JSON.stringify(boardSpaces));
        let spacesToGo = 0;

        for (const [rowIndex, row] of testBoard2.entries()) {
            for (const [colIndex, cell] of row.entries()) {
                if (cell === "") {
                    const canGo = anySpacesToGo(rowIndex, colIndex);
                    if (canGo) {
                        spacesToGo++;
                    }
                }
            }
        }
        if (spacesToGo === 0) {
            setCurrentTurn(oppositeTurn);
        }
    }, [boardSpaces]);


    //check if someone won
    const checkWinner = () => {
        const testBoard = JSON.parse(JSON.stringify(boardSpaces));
        let blankSpaces = 0;
        for (let row of testBoard) {
            for (let cell of row) {
                if (cell === "") {
                    blankSpaces++;
                }
            }
        }

        if (blankSpaces === 0) {
            let winningMessage = '';
            if (orangeScore > whiteScore) {
                winningMessage = 'Orange Wins!';
            } else if (whiteScore > orangeScore) {
                winningMessage = 'White Wins!';
            } else {
                winningMessage = "It's a Tie!";
            }
            setWinningMessage(winningMessage);
            return true;
        }
        return false;
    };


    useEffect(() => {
        // Check for winner
        const winner = checkWinner();
        if (winner) {
            setShowPopUpWin(true);
        } else {
            setShowPopUpWin(false);
        }
    }, [boardSpaces, orangeScore, whiteScore]);

    const resetBoard = () => {
        setShowPopUpWin(false);
        setBoardSpaces(board);
    }

    return (
        <div className='gameBoard'>
            <div className='gameBoardContainer'>
                {
                    boardSpaces.map((row, rowIndex) => (
                        row.map((col, colIndex) => (
                            <div key={colIndex}
                                className='playSquare'
                                onClick={() => canIGoHere(rowIndex, colIndex)}>
                                <div className={`chip ${col}`}></div>
                                <div className={`guide 
                                ${currentTurn}
                                ${!boardSpaces[rowIndex][colIndex] && anySpacesToGo(rowIndex, colIndex) ? 'visible' : ''}
                                `}></div>
                            </div>
                        ))
                    ))}
            </div>
            <button
                className='reset'
                onClick={resetBoard}>
                Reset Board</button>
            <div className='scoreCard'>
                <div className='scores'>
                    <div className='score'>
                        <div className='O chip'>
                        </div>
                        <h3>: {orangeScore}</h3>
                    </div>
                    <div className='score'>
                        <div className='W chip'>
                        </div>
                        <h3>: {whiteScore}</h3>
                    </div>
                </div>
            </div>

            {showPopUpWin && (
  <div className="popUpWin">
    <h3>{winningMessage}</h3>
    <button onClick={resetBoard} className="playAgain">
      Play Again
    </button>
  </div>
)}

        </div>
    );
};


export default GameBoard;

