const gameboard = (function() {
    let board = new Array(9).fill('');

    const getBoard = () => board;

    const resetBoard = () => {
        board.fill('');
    };

    const placeMarker = (position, marker) => {
        if(board[position] === '') {
            board[position] = marker;
        };
    };


    const checkWinConditions = (marker) => {
        const winConditions = [
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for(let i = 0; i < 8; i++){
            let [a, b, c] = winConditions[i];
            if(board[a] === marker && board[b] === marker && board[c] === marker) {
                return true;
            }
        }
        return false;
    };

    const checkForDraw = () => {
        if(!board.some(cell => cell === '')) {
            return true;
        } else {
            return false;
        }
    };

    return { getBoard, resetBoard, placeMarker, checkWinConditions, checkForDraw }
})();



const createPlayer = function(name, marker) {
    let playerName = name;
    const getName = () => playerName;
    const setName = (newName) => {
        playerName = newName;
    }

    const playerMarker = marker;
    const getMarker = () => playerMarker;

    let score = 0;
    const addPoint = () => score++;
    const getScore = () => score; 

    return { getName, setName, getMarker, addPoint, getScore }
};

const playerX = createPlayer('Player One', 'x');
const playerO = createPlayer('Player Two', 'o');



const gameController = (function(playerOne, playerTwo) {
    let matchCount = 0;
    const matchCountUp = () => matchCount++;
    const getMatchCount = () => matchCount;

    let turnCount = 0;
    const turnCountUp = () => turnCount++;
    const getTurnCount = () => turnCount;
    const resetTurnCount = () => turnCount = 0;

    let currentPlayer = playerOne;
    const getCurrentPlayer = () => currentPlayer;
    const updateCurrentPlayer = () => {
        let firstTurnPlayer;
        let secondTurnPlayer;
        if(matchCount % 2 === 0){
            firstTurnPlayer = playerOne;
            secondTurnPlayer = playerTwo;
        } else {
            firstTurnPlayer = playerTwo;
            secondTurnPlayer = playerOne;
        }

        if(turnCount % 2 === 0){
            currentPlayer = firstTurnPlayer;
        } else {
            currentPlayer = secondTurnPlayer;
        }
    }

    const playTurn = (position) => {
        let currentMarker = currentPlayer.getMarker();
        gameboard.placeMarker(position, currentMarker);

        if(gameboard.checkWinConditions(currentMarker)){
            alert(`${currentPlayer.getName()} wins!`);
            currentPlayer.addPoint();
            newMatch();
            return;
        } else if(gameboard.checkForDraw()){
            alert(`Draw!`);
            newMatch();
            return;
        } else {
            turnCountUp();
            updateCurrentPlayer();
            return;
        }
    }

    const newMatch = () => {
        gameboard.resetBoard();
        gameController.matchCountUp();
        gameController.resetTurnCount();
        gameController.updateCurrentPlayer();
    }

    return { turnCountUp, getTurnCount, resetTurnCount, matchCountUp, getMatchCount, getCurrentPlayer, updateCurrentPlayer, playTurn, newMatch }

})(playerX, playerO);