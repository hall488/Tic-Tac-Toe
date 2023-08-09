const displayController = (() => {

    const gamePrompt = document.querySelector('.game-prompt');
    const container = document.querySelector('.container');
    const cells = [...document.querySelectorAll('.cell')];
    const root = document.querySelector(':root');
    const restart = document.querySelector('.restart');
    const menu = [...document.querySelectorAll(`[row="${1}"]`)];

    const handleInput = e => {
        input = [e.target.getAttribute('row'), e.target.getAttribute('column')];
        selectCell(...input);
        
    }

    const selectCell = (row, col) => {
        let cell = gameBoard.getBoardCell(row, col);
        let target = container.querySelector(`[row="${row}"][column="${col}"]`);
        if(cell == '')
            target.style.animation = 'MoveDown .5s linear 1';
        cellRemoveListeners();
        game.nextTurn([row,col]);        
    }

    const handleHover = e => {
        let cell = gameBoard.getBoardCell(e.target.getAttribute('row'), e.target.getAttribute('column'));
        hoverAnimation(cell == '', e.target.getAttribute('row'), e.target.getAttribute('column'));
    }

    const handleUnhover = e => {
        input = [e.target.getAttribute('row'), e.target.getAttribute('column')];
        let cell = gameBoard.getBoardCell(...input);
        if(cell == '') {
            e.target.style.animation = 'none';
        }        
    }

    const handleMenu = e => {
        menuRemoveListeners();
        //let cell = gameBoard.getBoardCell(e.target.getAttribute('row'), e.target.getAttribute('column'));
        //e.target.style.animation = cell != '' ? 'ToMoon 3s linear 1' : 'none';
        //setTimeout(() => {
        e.target.style.animation = 'MoveDown .5s linear 1';
        setTimeout(() => {
            console.log(game.getMenuType());
            if(game.getMenuType() == 'Main') {
                console.log('d');
                game.selectMain(e.target.getAttribute('column'));
            }
                
            else if(game.getMenuType() == 'AI') {
                game.selectAI(e.target.getAttribute('column'));
                if(game.getMenuType != 'AI' && game.players[0].getType() != 'Human') handleUnhover(e);
            }
                
            
        }, 500);
            
        //}, 3000);
    }

    const menuHover = e => {
        let cell = gameBoard.getBoardCell(e.target.getAttribute('row'), e.target.getAttribute('column'));
        e.target.style.animation = cell != '' ? 'MoveUpDown 1.5s linear infinite' : 'none';
    }

    const menuUnhover = e => {
        e.target.style.animation = 'none';
    }

    const menuListeners = () => {
        menu.forEach(c => {
            c.addEventListener('click', handleMenu, true);
            c.addEventListener('mouseover', menuHover, true);
            c.addEventListener('mouseout', menuUnhover, true);        
        }); 
    }

    const menuRemoveListeners = () => {
        menu.forEach(c => {
            c.removeEventListener('click', handleMenu, true);
            c.removeEventListener('mouseover', menuHover, true);
            c.removeEventListener('mouseout', menuUnhover, true);        
        }); 
    }

    const cellListeners = () => {
        cells.forEach(c => {
            c.addEventListener('click', handleInput, true);
            c.addEventListener('mouseover', handleHover, true);
            c.addEventListener('mouseout', handleUnhover, true);        
        });    
    }

    const cellRemoveListeners = () => {
        cells.forEach(c => {
            c.removeEventListener('click', handleInput, true);
            c.removeEventListener('mouseover', handleHover, true);
            c.removeEventListener('mouseout', handleUnhover, true);   
        })   
    }

    restart.addEventListener('click', () => {
        location.reload();
    });

    const raiseWinner = (line) => {
        cellRemoveListeners();

        line.forEach(c => {
            el = container.querySelector(`[row="${c[0]}"][column="${c[1]}"]`);
            el.style.animation = 'none';
            el.offsetHeight;
            hoverAnimation(true, c[0], c[1]);
        });
    }

    const raiseDraw = () => {
        root.style.setProperty('--backlight', 'green');
        container.style.animation = 'MoveUpDown 2s linear infinite';
    }

    const changeBacklight = (color = getComputedStyle(root).getPropertyValue('--backlight') == 'blue' ? 'red' : 'blue') => {
        root.style.setProperty('--backlight', color);
    }

    const hoverAnimation = (toggle, row, col) => {
        let cell = container.querySelector(`[row="${row}"][column="${col}"]`);
        
        if(toggle) {
            cell.style.animation = 'MoveUpDown 2s linear infinite';
        } else {
            cell.style.animation = 'none'; 
        }
            
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
    
    return {selectCell, setGamePrompt, updateDisplay, menuListeners, menuRemoveListeners, hoverAnimation, cellListeners, cellRemoveListeners, changeBacklight, raiseWinner, raiseDraw, toggleRestart};
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


const player = (character, type) => {

    const getCharacter = () => character;

    const getType = () => type;

    const randomMove = () => {
        for(;;) {
            let i = Math.floor(Math.random()*3);
            let j = Math.floor(Math.random()*3);
            if(gameBoard.getBoardCell(i, j) == '') {    
                setTimeout(() => {
                    displayController.hoverAnimation(true, i, j);
                    setTimeout(() => {
                        displayController.selectCell(i, j, true);
                        return;
                    }, 1000);
                }, 1000);
                break;  
                    
            }           
            
        }       
        
    }

    const perfectMove = (state, character) => {

        const winner = (state, character, row, col) => {
            let rowCheck = state[row];
            let colCheck = [state[0][col], state[1][col], state[2][col]];
            let crossCheck1 = [state[0][0], state[1][1], state[2][2]];
            let crossCheck2 = [state[0][2], state[1][1], state[2][0]];        
            
            if(rowCheck.every(c => c == character)) {
                return true;
            }
            if(colCheck.every(c => c == character)) {
                return true;
            }
            if(crossCheck1.every(c => c == character)) {
                return true;
            }
            if(crossCheck2.every(c => c == character)) {
                return true;
            }

            return false;    
        }
        
       const iterate = (state, character) => {

            let plays = [];

            for(let i = 0; i < 3; i ++) {
                for(let j = 0; j < 3; j++) {
                    state[i][j] == '' ? plays.push({pos:[i,j], score:0}) : '';
                }
            }

            let whosTurn = plays.length % 2 == 1 ? 'X' : 'O'; 

            if(plays.length == 0) return {score: 0};

            plays.forEach(p => {
                let sendState = [[...state[0]],[...state[1]],[...state[2]]];
                sendState[p.pos[0]][p.pos[1]] = whosTurn;
                if(winner(sendState, whosTurn, p.pos[0], p.pos[1])) {
                    p.score += whosTurn == character ? 1 : -1;
                    return;
                }
                p.score += iterate(sendState, character).score;
            });

            if(whosTurn == character)
                plays.sort( (p1, p2) => p1.score < p2.score ? 1 : -1);
            else
                plays.sort( (p1, p2) => p1.score > p2.score ? 1 : -1);
            // console.log(whosTurn);
            // console.log(state);
            // console.log(plays);
            
            return plays[0];

       }

       let b = iterate(state, character);
       let [i,j] = b.pos;

        setTimeout(() => {
            displayController.hoverAnimation(true, i, j);
            setTimeout(() => {
                displayController.selectCell(i, j, true);                
                return;
            }, 1000);
        }, 1000);
    }

    return {getType, getCharacter, randomMove, perfectMove};
}

const game = (() => {

    let players = [];
    let turn;
    let gameOver;
    let menuType;
    let aiType;

    const getMenuType = () => menuType;

    const menu = () => {
        menuType = 'Main';
        gameBoard.setBoardState([['','',''],['','',''],['','','']]);
        displayController.setGamePrompt('Choose a game type!');
        gameBoard.setBoardCell('1v1', 1, 0);
        gameBoard.setBoardCell('Random AI', 1, 1);
        gameBoard.setBoardCell('Perfect AI', 1, 2);
        displayController.changeBacklight('green');
        displayController.menuListeners();
    }

    const aiMenu = () => {
        gameBoard.setBoardState([['','',''],['','',''],['','','']]);
        displayController.setGamePrompt('Choose Your Letter!');
        gameBoard.setBoardCell('X', 1, 0);
        gameBoard.setBoardCell('O', 1, 1);
        gameBoard.setBoardCell('Battle Bots!', 1, 2);
        displayController.changeBacklight('green');
        displayController.menuListeners();
    }

    const selectMain = (val) => {
        
        switch(val) {
            case '0': startGame(player('X', 'Human'), player('O', 'Human')); break;
            case '1': aiMenu(); aiType = 'Random'; menuType = 'AI'; break;
            //startGame(player('X', 'Random'), player('O', 'Human')); break;
            case '2': aiMenu(); aiType = 'Perfect'; menuType = 'AI'; break;
            //startGame(player('X', 'Perfect'), player('O', 'Perfect')); break;
        }
    }

    const selectAI = (val) => {
        switch(val) {
            case '0': startGame(player('X', 'Human'), player('O', aiType)); break;
            case '1': startGame(player('X', aiType), player('O', 'Human')); break;
            //startGame(player('X', 'Random'), player('O', 'Human')); break;
            case '2': startGame(player('X', aiType), player('O', aiType)); break;
            //startGame(player('X', 'Perfect'), player('O', 'Perfect')); break;
        }
    }

    const startGame = (player1, player2) => {
        console.log('Start game');
        gameBoard.setBoardState([['','',''],['','',''],['','','']]);
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                displayController.updateDisplay('', i, j);
            }
        }
        displayController.changeBacklight('red');
        
        players.push(player1);
        players.push(player2);
        turn = 0;
        gameOver = false;
        displayController.setGamePrompt(`Player ${players[turn].getCharacter()} Turn`);

        if(player1.getType() == 'Random') players[turn].randomMove();
        else if(player1.getType() =='Perfect') players[turn].perfectMove(gameBoard.getBoardState(), players[turn].getCharacter());
        else {
            displayController.cellListeners();
        }
    }

    const nextTurn = (input) => {

        if(gameOver) return '';

        console.log(input);
        let inputValidity = (gameBoard.getBoardCell(parseInt(input[0]), parseInt(input[1])) == '');

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

                if(players[turn].getType() == 'Random') {
                    players[turn].randomMove();
                } else if(players[turn].getType() == 'Perfect') {
                    players[turn].perfectMove(gameBoard.getBoardState(), players[turn].getCharacter());
                } else {
                    displayController.cellListeners();
                }
            }
            
        }

    }

    return {menu, selectMain, getMenuType, selectAI, nextTurn, players};

})();

game.menu();
//game.startGame(player('X'), player('O'));