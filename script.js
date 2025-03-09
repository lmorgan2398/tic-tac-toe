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
    const playerName = name;
    const getName = () => name;

    const playerMarker = marker;
    const getMarker = () => marker;

    return { getName, getMarker }
};