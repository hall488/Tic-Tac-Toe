const displayController = (() => {

    const gamePrompt = document.querySelector('.game-prompt');
    const container = document.querySelector('.container');
    const cells = [...document.querySelectorAll('.cell')];
    const root = document.querySelector(':root');
    const restart = document.querySelector('.restart');

    let handleInput = e => {
        input = [e.target.getAttribute('row'), e.target.getAttribute('column')];
        let cell = gameBoard.getBoardCell(...input);
        e.target.style.animation = cell == '' ? 'MoveDown .5s linear 1' : 'none'; 
        game.nextTurn(input);
    }

    const handleHover = e => {
        let cell = gameBoard.getBoardCell(e.target.getAttribute('row'), e.target.getAttribute('column'));
        e.target.style.animation = cell == '' ? 'MoveUpDown 2s linear infinite' : 'none';
    }

    const handleUnhover = e => {
        input = [e.target.getAttribute('row'), e.target.getAttribute('column')];
        let cell = gameBoard.getBoardCell(...input);
        if(cell == '') {
            e.target.style.animation = 'none';
        }        
    }

    const cellListeners = () => {
        cells.forEach(c => {
            c.addEventListener('click', handleInput, true);
            c.addEventListener('mouseover', handleHover, true);
            c.addEventListener('mouseout', handleUnhover, true);        
        });    
    }

    restart.addEventListener('click', () => {
        location.reload();
    });

    const raiseWinner = (line) => {
        cells.forEach(c => {
            c.removeEventListener('click', handleInput, true);
            c.removeEventListener('mouseover', handleHover, true);
            c.removeEventListener('mouseout', handleUnhover, true);   
        })        

        line.forEach(c => {
            el = container.querySelector(`[row="${c[0]}"][column="${c[1]}"]`);
            el.style.animation = 'none';
            el.offsetHeight;
            el.style.animation = 'MoveUpDown 2s linear infinite';
        });
    }

    const raiseDraw = () => {
        root.style.setProperty('--backlight', 'green');
        container.style.animation = 'MoveUpDown 2s linear infinite';
    }

    const changeBacklight = () => {
        let color = getComputedStyle(root).getPropertyValue('--backlight') == 'blue' ? 'red' : 'blue';
        root.style.setProperty('--backlight', color);
    }

    const toggleRestart = () => {
        restart.style.visibility = restart.style.visibility == 'visible' ? 'hidden' : 'visible';
    }
    
    const updateDisplay = (character, row, column) => {
        container.querySelector(`[row="${row}"][column="${column}"]`).textContent = character;
    }

    const setGamePrompt = (string) => {
        gamePrompt.textContent = string;
    }
    
    return {setGamePrompt, updateDisplay, cellListeners, changeBacklight, raiseWinner, raiseDraw, toggleRestart};
})();

const gameBoard = (() => {
    let boardState;

    const getBoardState = () => boardState;
    const setBoardState = (state) => boardState = state; 

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
        
        if(rowCheck.every(c => c == character)) {
            displayController.raiseWinner([[row, 0], [row, 1], [row, 2]]);
            return true;
        }
        if(colCheck.every(c => c == character)) {
            displayController.raiseWinner([[0, column], [1, column], [2, column]]);
            return true;
        }
        if(crossCheck1.every(c => c == character)) {
            displayController.raiseWinner([[0, 0],[1, 1],[2, 2]]);
            return true;
        }
        if(crossCheck2.every(c => c == character)) {
            displayController.raiseWinner([[0, 2], [1, 1], [2, 0]]);
            return true;
        }

        return false;

    }

    return {checkForWinner, setBoardState, getBoardState, setBoardCell, getBoardCell};
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
    let gameOver;

    const menu = () => {

    }

    const startGame = (player1, player2) => {
        gameBoard.setBoardState([['','',''],['','',''],['','','']]);
        
        displayController.cellListeners();
        players.push(player1);
        players.push(player2);
        turn = 0;
        gameOver = false;
        displayController.setGamePrompt(`Player ${players[turn].getCharacter()} Turn`);
    }

    const nextTurn = (input) => {

        if(gameOver) return '';

        let inputValidity = (gameBoard.getBoardCell(input[0], input[1]) == '');

        if(inputValidity) {
            gameBoard.setBoardCell(players[turn].getCharacter(), input[0], input[1]);
            
            if(gameBoard.checkForWinner(players[turn].getCharacter(), input[0], input[1])) {
                displayController.setGamePrompt(`Player ${players[turn].getCharacter()} Wins`);
                displayController.toggleRestart();
                gameOver = true;
            } else if(gameBoard.getBoardState().every(row => row.every(cell => cell != ''))) {
                displayController.setGamePrompt(`The game is a draw`);
                displayController.raiseDraw();
                displayController.toggleRestart();
                gameOver = true;
            }else {
                turn = turn ? 0 : 1;
                displayController.setGamePrompt(`Player ${players[turn].getCharacter()} Turn`);

                displayController.changeBacklight();
            }
            
        }

    }

    return {startGame, nextTurn};

})();

game.startGame(player('X'), player('O'));