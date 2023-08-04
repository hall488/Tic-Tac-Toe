
const gameBoard = (() => {
    let boardState = [['','',''],['','',''],['','','']];
    let gamePrompt = '';

    const getBoardState = () => boardState;
    const getBoardCell = (row, column) => boardState[row][column];
    const setBoardCell = (character, row, column) => {
        boardState[row][column] = character;
    };
    const setGamePrompt = (string) => {
        gamePrompt = string;
    }

    return {getBoardState, setBoardCell, getBoardCell, setGamePrompt};
})();


const player = (character) => {

    const getCharacter = () => character;
    const getPlayerInput = () => {
        //call from display
    }

    return {getCharacter};
}

const game = (() => {

    let players = [];
    let board;
    let turn;

    const startGame = (player1, player2) => {
        players.push(player1);
        players.push(player2);
        board = gameBoard();
        turn = 0;
        loop();
    }

    const nextTurn = () => {
        let input;
        for(let inputValid = false; !inputValid;) {
            input = players[turn].getPlayerInput();
            inputValid = (board.getBoardCell(input[0], input[1]) == '');
        }
        board.setBoardCell(player[turn].getCharacter(), input[0], input[1]);
        turn = !turn;
    }

    const loop = () => {
        for(;board.checkForWinner();) {
            board.setGamePrompt(`Player ${players[turn]} Turn`);
            nextTurn();
        }
        board.setGamePrompt(`Player ${players[!turn]} Wins`);
    }

})();

const displayController = (() => {

    

})();