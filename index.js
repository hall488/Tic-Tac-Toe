const displayController = (() => {

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
    
    return {updateDisplay};
})();

const gameBoard = (() => {
    let boardState = [['','',''],['','',''],['','','']];
    let gamePrompt = '';

    const getBoardState = () => boardState;
    const getBoardCell = (row, column) => boardState[row][column];
    const setBoardCell = (character, row, column) => {
        boardState[row][column] = character;
        displayController.updateDisplay(character, row, column);
    };
    const setGamePrompt = (string) => {
        gamePrompt = string;
    }

    const checkForWinner = () => {
        return false;
    }

    return {checkForWinner, getBoardState, setBoardCell, getBoardCell, setGamePrompt};
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
        gameBoard.setGamePrompt(`Player ${players[turn]} Turn`);
    }

    const nextTurn = (input) => {

        if(gameOver) return '';

        let inputValidity = (gameBoard.getBoardCell(input[0], input[1]) == '');

        if(inputValidity) {
            gameBoard.setBoardCell(players[turn].getCharacter(), input[0], input[1]);
            
            if(gameBoard.checkForWinner()) {
                gameBoard.setGamePrompt(`Player ${players[turn]} Wins`);
                gameOver = true;
            } else {
                turn = turn ? 0 : 1;
                gameBoard.setGamePrompt(`Player ${players[turn]} Turn`);
            }
            
        }

    }

    return {startGame, nextTurn};

})();

game.startGame(player('X'), player('O'));