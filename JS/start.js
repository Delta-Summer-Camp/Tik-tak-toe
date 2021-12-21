import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getDatabase, ref, set, onValue, child, get } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const gameSize = 3;
const cells = [[0,0,0],[0,0,0],[0,0,0]];
let currentPlayer = +1;

window.onload = function() {
	initBase();
	newGame();
}

function initBase() {
	// Блок конфигурации - его надо скопировать из Firebase Console
	const firebaseConfig = {
	  apiKey: "AIzaSyC8jRygOfKyK10a3OXh7SLfnVMBPIqlRTM",
	  authDomain: "tik-tak-toe-delta.firebaseapp.com",
	  databaseURL: "https://tik-tak-toe-delta-default-rtdb.europe-west1.firebasedatabase.app",
	  projectId: "tik-tak-toe-delta",
	  storageBucket: "tik-tak-toe-delta.appspot.com",
	  messagingSenderId: "58154313666",
	  appId: "1:58154313666:web:254f10231facbaa541d85b"
	};
	// Инициализируем подключение к Firebase
	const app = initializeApp(firebaseConfig);

	// Сохраняем массив 'cells'
	storeInDatabase('game/cells', cells);
}	
	
// Запись в базу Firebase	
// path - путь для сохранения данных
// data - сохраняемые данные
function storeInDatabase(path, data) {
	const db = getDatabase();
	const dbRef = ref(db);
	const gameRef = child(dbRef, path);
	set(gameRef, data);
}

function newGame() {
	for(let i = 0; i < gameSize; i++) {
		for(let j = 0; j < gameSize; j++) {
			const cell = document.getElementById("cell-" + i + j);
			cell.onclick = function() {
				if (cells[i][j] === 0) {
					if (currentPlayer === +1) {
						cell.style.backgroundImage = "url('./IMG/x.gif')";
						cells[i][j] = 1;
						currentPlayer = -1;
					} else {
						cell.style.backgroundImage = "url('./IMG/o.gif')";
						cells[i][j] = -1;
						currentPlayer = +1;						
					}
				}
			}
		}
	}
	const button = document.getElementById("newGame");
	button.onclick = function() {
		for(let i = 0; i < gameSize; i++) {
			for(let j = 0; j < gameSize; j++) {
				const cell = document.getElementById("cell-" + i + j);
				cell.style.backgroundImage = "none";
				cells[i][j] = 0;
			}
		}
		currentPlayer = +1;
	}
}
