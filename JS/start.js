import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getDatabase, ref, set, onValue, child, get } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const gameSize = 3;
const cells = [[0,0,0],[0,0,0],[0,0,0]]; // Матрица игры
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

	currentPlayer = +1;

	for(let i = 0; i < gameSize; i++) {
		for(let j = 0; j < gameSize; j++) {
			setClickListener(i, j);
			cells[i][j] = 0;
		}
	}

	function setClickListener(i, j) {
		const cell = document.getElementById("cell-" + i + j);
		cell.onclick = function() {
			if (cells[i][j] === 0) {
				cells[i][j] = currentPlayer;
				currentPlayer *= -1;				
				storeInDatabase('game/cells', cells);
			}
		}
	}

	const button = document.getElementById("newGame");
	button.onclick = newGame;

	storeInDatabase('game/cells', cells);

	addDatabaseListener();
}

function addDatabaseListener() {
	const db = getDatabase();
	const dbRef = ref(db);
	const gameRef = child(dbRef, 'game/cells');
	onValue(gameRef, function(snapshot) {
		const cells = snapshot.val();
		for(let i = 0; i < gameSize; i++) {
			for(let j = 0; j < gameSize; j++) {
				const cell = document.getElementById("cell-" + i + j);
				switch (cells[i][j]) {
					case 0:
						cell.style.backgroundImage = "none";
						break;
					case +1:
						cell.style.backgroundImage = "url('./IMG/x.gif')";
						break;
					case -1:
						cell.style.backgroundImage = "url('./IMG/o.gif')";
						break;			
				}

			}
		}
	});
}
