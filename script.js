const gameboard = (function() {
    let board = new Array(9).fill('');

    const getBoard = () => board;

    const resetBoard = () => {
        board.fill('');
    };

    const placeMarker = (position, marker) => {
        if(board[position] === '') {
            board[position] = marker;
            return true;
        } else {
            return false;
        }
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




const createPlayer = function(name, marker, status) {
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

    let cpuStatus = status;
    let getCpuStatus = () => cpuStatus;
    return { getName, setName, getMarker, addPoint, getScore, getCpuStatus }
};

const playerX = createPlayer('Player One', 'x', 'player');
const playerO = createPlayer('Player Two', 'o', 'cpu');




const gameController = (function(playerOne, playerTwo) {
    let matchCount = 0;
    const matchCountUp = () => matchCount++;
    const getMatchCount = () => matchCount;
    const resetMatchCount = () => matchCount = 0;

    let turnCount = 0;
    const turnCountUp = () => turnCount++;
    const getTurnCount = () => turnCount;
    const resetTurnCount = () => turnCount = 0;

    let currentPlayer = playerOne;
    let firstTurnPlayer;
    let secondTurnPlayer;
    const getCurrentPlayer = () => currentPlayer;
    const updateCurrentPlayer = () => {

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
        playCpuTurn();

    }


    const advanceTurn = () => {
        displayController.renderBoard();
        let currentMarker = currentPlayer.getMarker();
        if(gameboard.checkWinConditions(currentMarker)){
            setTimeout(() => {
                alert(`${currentPlayer.getName()} wins!`);
                currentPlayer.addPoint();
                newMatch();
                displayController.renderBoard();
            }, 100)
            return;
        } else if(gameboard.checkForDraw()){
            setTimeout(() => {
                alert(`Draw!`);
                newMatch();
                displayController.renderBoard();
            }, 100)
            return;
        } else {
            turnCountUp();
            updateCurrentPlayer();
            console.log(cpuCurrentCorner);
            console.log(currentCornerIndex);
            return;
        }
    }

    const playTurn = (position) => {
        let currentMarker = currentPlayer.getMarker();
        if(!gameboard.placeMarker(position, currentMarker)){
            return;
        } else {
            gameboard.placeMarker(position, currentMarker);
        }
        advanceTurn();
    }

    let cpuCurrentCorner;
    let cpuCornerDirection;
    let currentCornerIndex;
    const playCpuTurn = () => {
        let currentMarker = currentPlayer.getMarker();
        let enemyMarker;
        let board = gameboard.getBoard();

        if(currentMarker === 'x') {
            enemyMarker = 'o';
        } else {
            enemyMarker = 'x';
        }
        if(currentPlayer.getCpuStatus() === 'cpu') {
            let winConditions = [          
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 4, 8],
            [2, 4, 6]
            ]

            // If there is an available win condition on the board, play to win
                for(let i = 0; i < 8; i++){
                    let [a, b, c] = winConditions[i];
                    if(board[a] === currentMarker && board[c] === currentMarker && board[b] === ''){
                        console.log('should win');
                        gameboard.placeMarker(b, currentMarker);
                        advanceTurn();
                        return;
                    }
                };

                // If there is not an immediate win condition, make sure the enemy
                // doesn't win on the next move
                for(let i = 0; i < 8; i++) {
                    let [a, b, c] = winConditions[i];
                    if(board[a] === enemyMarker && board[b] === enemyMarker || board[a] === enemyMarker && board[c] === enemyMarker || board[b] === enemyMarker && board[c] === enemyMarker) {
                        for(let j = 0; j < 3; j++){
                            let winCondition = winConditions[i];
                            if(board[winCondition[j]] === ''){
                                console.log('loss prevented');
                                gameboard.placeMarker(winCondition[j], currentMarker);
                                advanceTurn();
                                return;
                            }
                        }
                    }
                };

                // If there is no win condition available and the enemy is not about to 
                // win, then that means the next best move is to play corners to open up 
                // a win condition -- if corners are all blocked off, that means there is
                // already a win condition for one player on the board, so not fallback is 
                // necessary
                let fourCorners = [0, 2, 8, 6];
                let fourCornersArray = [board[0], board[2], board[8], board[6]];
                if(firstTurnPlayer === currentPlayer){
                    console.log(cpuCurrentCorner);
                    if(!fourCornersArray.includes(currentMarker)){
                        console.log('playing first corner');
                        currentCornerIndex = Math.floor(Math.random() * 4);
                        cpuCurrentCorner =  fourCorners[currentCornerIndex];
                        while(board[cpuCurrentCorner] !== ''){
                            currentCornerIndex = Math.floor(Math.random() * 4);
                            cpuCurrentCorner =  fourCorners[currentCornerIndex];
                        }
                        gameboard.placeMarker(cpuCurrentCorner, currentMarker);
                        advanceTurn();
                        return;
                    } else {
                        console.log('after first turn played')
                        console.log(cpuCurrentCorner);
                        console.log(board[cpuCurrentCorner]);
                        if(cpuCurrentCorner === 0){
                            if(board[1] === enemyMarker || board[5] === enemyMarker){
                                cpuCornerDirection = 'counter';
                            } else if(board[3] === enemyMarker || board[7] === enemyMarker){
                                cpuCornerDirection = 'clock';
                            } else if(board[4] === enemyMarker){
                                cpuCornerDirection = 'opposite';
                            }

                        } else if(cpuCurrentCorner === 2){
                            if(board[7] === enemyMarker || board[5] === enemyMarker){
                                cpuCornerDirection = 'counter';
                            } else if(board[1] === enemyMarker || board[3] === enemyMarker){
                                cpuCornerDirection = 'clock';
                            } else if(board[4] === enemyMarker){
                                cpuCornerDirection = 'opposite';
                            }

                        } else if(cpuCurrentCorner === 8){
                            if(board[7] === enemyMarker || board[3] === enemyMarker){
                                cpuCornerDirection = 'counter';
                            } else if(board[1] === enemyMarker || board[5] === enemyMarker){
                                cpuCornerDirection = 'clock';
                            } else if(board[4] === enemyMarker){
                                cpuCornerDirection = 'opposite';
                            }

                        } else if(cpuCurrentCorner === 6){
                            if(board[1] === enemyMarker || board[3] === enemyMarker){
                                cpuCornerDirection = 'counter';
                            } else if(board[5] === enemyMarker || board[7] === enemyMarker){
                                cpuCornerDirection = 'clock';
                            } else if(board[4] === enemyMarker){
                                cpuCornerDirection = 'opposite';
                            } 
                        }

                        if(cpuCornerDirection === 'counter'){
                            console.log('counter');
                            if(currentCornerIndex === 0){
                                currentCornerIndex = 3;
                            } else {
                                currentCornerIndex--;
                            }
                            cpuCurrentCorner = fourCorners[currentCornerIndex];
                            console.log(cpuCurrentCorner);
                            while(board[cpuCurrentCorner] !== ''){
                                if(currentCornerIndex === 0){
                                    currentCornerIndex = 3;
                                } else {
                                    currentCornerIndex--;
                                }
                                cpuCurrentCorner = fourCorners[currentCornerIndex];
                            }
                            gameboard.placeMarker(cpuCurrentCorner, currentMarker);
                            advanceTurn();
                            return;
                        } else if(cpuCornerDirection === 'clock'){
                            console.log('clock');
                            if(currentCornerIndex === 3){
                                currentCornerIndex = 0;
                            } else {
                                currentCornerIndex++;
                            }
                            cpuCurrentCorner = fourCorners[currentCornerIndex];
                            console.log(cpuCurrentCorner);
                            while(board[cpuCurrentCorner] !== ''){
                                if(currentCornerIndex === 3){
                                    currentCornerIndex = 0;
                                } else {
                                    currentCornerIndex++;
                                }
                                cpuCurrentCorner = fourCorners[currentCornerIndex];
                            }
                            gameboard.placeMarker(cpuCurrentCorner, currentMarker);
                            advanceTurn();
                            return;
                        } else if(cpuCornerDirection === 'opposite'){
                            console.log('opposite');
                            if(currentCornerIndex === 0 || currentCornerIndex === 1){
                                currentCornerIndex++;
                                currentCornerIndex++;
                            } else if(currentCornerIndex === 2 || currentCornerIndex === 3){
                                currentCornerIndex--;
                                currentCornerIndex--;
                            }
                            cpuCurrentCorner = fourCorners[currentCornerIndex];
                            console.log(cpuCurrentCorner);
                            while(board[cpuCurrentCorner] !== ''){
                                if(currentCornerIndex === 0 || currentCornerIndex === 1){
                                    currentCornerIndex++;
                                    currentCornerIndex++;
                                } else if(currentCornerIndex === 2 || currentCornerIndex === 3){
                                    currentCornerIndex--;
                                    currentCornerIndex--;
                                }
                                cpuCurrentCorner = fourCorners[currentCornerIndex];
                            }
                            gameboard.placeMarker(cpuCurrentCorner, currentMarker);     
                            advanceTurn();
                            return;
                        } else {
                            console.log('random');
                            currentCornerIndex = Math.floor(Math.random() * 4);
                            cpuCurrentCorner = fourCorners[currentCornerIndex];
                            while(board[cpuCurrentCorner] !== '') {
                                currentCornerIndex = Math.floor(Math.random() * 4);
                                cpuCurrentCorner = fourCorners[currentCornerIndex];
                            }
                            gameboard.placeMarker(cpuCurrentCorner, currentMarker);
                            advanceTurn();
                            return;
                        }   
                    }
                } else {
                    if(board[4] === ''){
                        console.log('center');
                        gameboard.placeMarker(4, currentMarker);
                        advanceTurn();
                        return;
                    } else if(board[4] === enemyMarker) {
                        console.log('random corner')
                        currentCornerIndex = Math.floor(Math.random() * 4);
                        cpuCurrentCorner = fourCorners[currentCornerIndex];
                        while(board[cpuCurrentCorner] !== '') {
                            currentCornerIndex = Math.floor(Math.random() * 4);
                            cpuCurrentCorner = fourCorners[currentCornerIndex];
                        }
                        gameboard.placeMarker(cpuCurrentCorner, currentMarker);
                        advanceTurn();
                        return;
                    } else {
                        console.log('random side');
                        if(board[0] === enemyMarker && board[8] === enemyMarker || board[2] === enemyMarker && board[6] === enemyMarker){
                            let randomSide = [1, 3, 5, 7];
                            let randomSideIndex = Math.floor(Math.random() * 4);
                            let cpuPosition = randomSide[randomSideIndex];
                            while(board[cpuPosition] !== ''){
                                randomSideIndex = Math.floor(Math.random() * 4);
                                cpuPosition = randomSide[randomSideIndex];
                            }
                            gameboard.placeMarker(cpuPosition, currentMarker);
                            advanceTurn();
                            return;
                        } else {
                            console.log('random');
                            let cpuPosition = Math.floor(Math.random() * 9);
                            while(board[cpuPosition] !== '') {
                                cpuPosition = Math.floor(Math.random() * 9);
                            }
                            gameboard.placeMarker(cpuPosition, currentMarker);
                            advanceTurn();
                            return;
                        }
                    };
                }             
        }
    }

    const newMatch = () => {
        gameboard.resetBoard();
        matchCountUp();
        resetTurnCount();
        updateCurrentPlayer();
        cpuCornerDirection = '';
    }

    const newGame = () => {
        gameboard.resetBoard();
        resetMatchCount();
        resetTurnCount();
        updateCurrentPlayer();
    }

    return { turnCountUp, 
             getTurnCount, 
             resetTurnCount, 
             matchCountUp, 
             getMatchCount, 
             resetMatchCount,
             getCurrentPlayer, 
             updateCurrentPlayer, 
             playTurn,
             playCpuTurn, 
             newMatch,
             newGame }
})(playerX, playerO);




const displayController = (function() {

    let board = gameboard.getBoard();

    let displayCells = document.querySelectorAll('.cell');

    const initBoard = () => {
        for(let cell of displayCells) {
            cell.addEventListener('click', () => {
                let indexNumber = cell.dataset.index;
                gameController.playTurn(indexNumber);
            })
        }
    }
    const renderBoard = () => {
        for(let cell of displayCells){
            let indexNumber = cell.dataset.index;
            cell.textContent = board[indexNumber];
        }
    }
    return { initBoard, renderBoard }
})()




document.addEventListener('DOMContentLoaded', () => {
    displayController.initBoard();
    gameController.updateCurrentPlayer();
})