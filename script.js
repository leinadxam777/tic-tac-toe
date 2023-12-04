
const state = {
    gameElement: document.querySelector('.game'),
    // cells: [null, null, null, null, null, null, null, null, null]
    cells: Array(9).fill(null), // Same as the above
    symbols: ['x', 'o'], // single player only
    winningCombinations: [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // nottom row

        [0, 3, 6], // left column
        [1, 4, 7], // middle column
        [2, 5, 8], // right column

        [0, 4, 8], // left diagonal
        [2, 4, 6]  // right diagonal
    ],
    gameFinsihed: false
}


function drawBoard() {
    state.gameElement.innerHTML = ''; // This doesn't append another 9 boxes with the value.

    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');

        if (state.cells[i]) { // Does the cell have an x or an o? this code runs
            const cellSymbol = document.createElement('p');
            cellSymbol.classList.add('symbol');
            cellSymbol.innerText = state.cells[i];
            cell.append(cellSymbol)

        }
        else { // Otherwise, it must be empty, so run this code
            cell.addEventListener('click', function () {


                if (state.gameFinsihed) {  // If game is over, nothing can be clicked
                    return;
                }

                // state.symbols.reverse();
                state.cells[i] = state.symbols[0];

                drawBoard()


                if (checkForWinner()) {
                    state.gameFinsihed = true;
                    drawMessage('You won!');
                }

                // if (checkForDraw()) {
                //     state.gameFinsihed = true;
                //     drawMessage("Nice One!");
                // }

                robotMove(); // option for single player only
            })
        }


        state.gameElement.append(cell);
    }
}

function checkForDraw() {
    return state.cells.every(function (cell) {
        return cell !== null;
    })
}


function drawMessage(message) {
    const banner = document.createElement('div');
    banner.classList.add('banner');

    // const banner = document.querySelector('.banner');
    // const h1 = banner.querySelector('h1');

    const tryAgain = document.createElement('button');
    tryAgain.classList.add('tryAgain');
    tryAgain.innerText = 'Try Again';

    const h1 = document.createElement('h1');
    h1.textContent = message;

    banner.append(h1);
    h1.append(tryAgain);

    // const tryAgain = document.getElementById('tryAgain');

    tryAgain.addEventListener('click', function () {
        resetGame(); // Call the function to reset the game state
    });



    function resetGame() {
        state.gameFinsihed = false;
        state.symbols.reverse();
        state.cells = Array(9).fill(null);
        drawBoard();
        banner.remove();


        for (let i = 0; i < state.cells.length; i++) {
            state.cells[i] = null;
        }
        document.querySelectorAll('.cellSymbol').forEach(cellSymbol => {
            cellSymbol.remove();
        });

        if (state.symbols[0] === 'o') { // option for single player only
            robotMove();
        }

    }

    state.gameElement.append(banner);

}


function checkForWinner() {
    return state.winningCombinations.some(function (combo) {
        const cells = combo.map(function (index) {
            return state.cells[index]
        })

        return !(cells.includes(null)) && new Set(cells).size === 1; // It should be 1 to get only either x or y sets. Otherwise, x, x, o will be a winning combination because it has x and o.
        // This excludes the null and sets the array into x o y values only. Takes out the duplicate
        // values. If it is x, x, o then it will be just x and o.
    })
}

function robotMove() { // option for single player only
    if (state.gameFinsihed) {
        return; // If the game is already finished, the robot won't make a move.
    }


    setTimeout(function () {
        const emptyCells = state.cells.reduce((accumulate, cell, index) => {
            if (cell === null) {
                accumulate.push(index);
            }
            return accumulate;
        }, []);


        if (emptyCells.length > 0) {
            // Randomly select an empty cell
            const robotSymbol = state.symbols[1];
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            // const robotSymbol = state.symbols[0];
            state.cells[emptyCells[randomIndex]] = robotSymbol;
            drawBoard();

            if (checkForWinner()) {
                state.gameFinsihed = true;
                drawMessage('You lose');
            }

            if (checkForDraw()) {
                state.gameFinsihed = true;
                drawMessage("It's a tie!");
            }
        }
    }, 500);


}

drawBoard();

