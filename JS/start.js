function init() {
	let ch = document.getElementById("changeable");
	ch.onclick = function() {
		ch.innerHTML = "Меня кликнули!";
	}
}