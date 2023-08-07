const displayController = (() => {

    const gamePrompt = document.querySelector('.game-prompt');
    const container = document.querySelector('.container');
    const cells = document.querySelectorAll('.cell');

    Array.from(cells).forEach(c => {
        c.addEventListener('click', handleInput.bind(c));
    });

    function handleInput() {
        input = [this.getAttribute('row'), this.getAttribute('column')];
        console.log(input);
        game.nextTurn(input);
    }
    
    const updateDisplay = (character, row, column) => {
        container.children[row].children[column].textContent = character;
    }

    const setGamePrompt = (string) => {
        gamePrompt.textContent = string;
    }
    
    return {setGamePrompt, updateDisplay};
})();

const gameBoard = (() => {
    let boardState = [['','',''],['','',''],['','','']];

    const getBoardState = () => boardState;
    const getBoardCell = (row, column) => boardState[row][column];
    const setBoardCell = (character, row, column) => {
        boardState[row][column] = character;
        displayController.updateDisplay(character, row, column);
    };
    

    const checkForWinner = (character, row, column) => {

        let rowCheck = boardState[row];
        let colCheck = [boardState[0][column],boardState[1][column],boardState[2][column]];
        let crossCheck1 = [boardState[0][0], boardState[1][1], boardState[2][2]];
        let crossCheck2 = [boardState[0][2], boardState[1][1], boardState[2][0]];        
        
        if( rowCheck.every(c => c == character) ||
            colCheck.every(c => c == character) ||
            crossCheck1.every(c => c == character) ||
            crossCheck2.every(c => c == character))
            return true;

        return false;

    }

    return {checkForWinner, getBoardState, setBoardCell, getBoardCell};
})();


const player = (character) => {

    const getCharacter = () => character;
    const getPlayerInput = () => {
        displayController.getInput();
    }

    return {getPlayerInput, getCharacter};
}

const game = (() => {

    let players = [];
    let turn;
    let gameOver = false;

    const startGame = (player1, player2) => {
        players.push(player1);
        players.push(player2);
        turn = 0;
        displayController.setGamePrompt(`Player ${players[turn].getCharacter()} Turn`);
    }

    const nextTurn = (input) => {

        if(gameOver) return '';

        let inputValidity = (gameBoard.getBoardCell(input[0], input[1]) == '');

        if(inputValidity) {
            gameBoard.setBoardCell(players[turn].getCharacter(), input[0], input[1]);
            
            if(gameBoard.checkForWinner(players[turn].getCharacter(), input[0], input[1])) {
                displayController.setGamePrompt(`Player ${players[turn].getCharacter()} Wins`);
                gameOver = true;
            } else {
                turn = turn ? 0 : 1;
                displayController.setGamePrompt(`Player ${players[turn].getCharacter()} Turn`);
            }
            
        }

    }

    return {startGame, nextTurn};

})();

game.startGame(player('X'), player('O'));