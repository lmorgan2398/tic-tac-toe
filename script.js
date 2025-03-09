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

    const checkWinConditions = (marker) => {
        for(let i = 0; i < 8; i++){
            let winCondition = winConditions[i];
            
        }
    }
})();