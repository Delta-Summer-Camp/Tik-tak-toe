let cellStatus = 0;

window.onload = function() {

	newGame();
}

function newGame() {
	const cell_00 = document.getElementById("cell-00");
	cell_00.onclick = function() {
		if (cellStatus === 0 || cellStatus === -1) {
			cell_00.style.backgroundImage = "url('./IMG/x.gif')";
			cellStatus = 1;
		} else {
			cell_00.style.backgroundImage = "url('./IMG/o.gif')";
			cellStatus = -1;			
		}
	}
}
