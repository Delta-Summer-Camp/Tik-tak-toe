window.onload = function() {

	newGame();
}

function newGame() {
	const cell_11 = document.getElementById("cell-11");
	cell_11.onclick = function() {
		cell_11.style.backgroundImage = "url('./IMG/x.gif')";
	}
}