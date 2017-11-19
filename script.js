var origBoard; //Keeping track of all the filled in cells
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
];//wining combinations necessary for wining

const cells = document.querySelectorAll('.cell');//cells variable is going to store refference to each cell
startGame();


function startGame() {
	document.querySelector(".endgame").style.display = "none";//Hides the endgame div after start
	origBoard = Array.from(Array(9).keys());//this makes every array from 0 to 9
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';//reset the text to nothing
		cells[i].style.removeProperty('background-color');//reset the highlighted cell backgroung to nothing
		cells[i].addEventListener('click', turnClick, false);//calling the turnClick function below
	}//removes all the X and O from the filled board
}

function turnClick(square) {
  if (typeof origBoard[square.target.id] == 'number'){
		turn(square.target.id, huPlayer)//calling the turn function as the human player acts
		if (!checkTie()) turn(bestSpot(), aiPlayer);//checking for a Tie
	}//A player ca n not click on palce already full
}//this function sees an cell ID when a player clicks on the cell

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)//checking if the games has been won
	if (gameWon) gameOver(gameWon)//if the game was one, let there be gameOver function called
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>//this finds all the places on board that have been already played in, the reduce methos goes through th board and give out one value (a is the accumulator, e-element of board we are going through, i - the index)
		(e === player) ? a.concat(i) : a, []);//this finds everz index a player played in
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}//for-of loop: checking if the game has been won

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}//this changes the color of a victorious played combo
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");//This declares if human or AI wins
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";//The Div of endgame is shown.
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	/* !!! Part for the nearest free space */
  return origBoard.filter(s => typeof s == 'number');
}//filtering through the board finding emptz squares

function bestSpot() {
  return minimax(origBoard, aiPlayer).index;

	/* bad AI
	return emptySquares()[0];//go through the free spaces
	*/
}//aiPlayer goes for emptz squares first

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";// every cells gors to greem
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")//declaration of a tie
		return true;
	}
	return false;
}

/*AI minimax function */

function minimax(newBoard, player) {
	var availSpots = emptySquares(newBoard);

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}
