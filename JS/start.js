import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, signInAnonymously} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getDatabase, ref, set, onValue, child, get } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const gameSize = 3;
let cells; // Матрица игры
let currentPlayer;
let coPlayer;
let gameOwner;
let dbRef;
let myUID;
let myTeam = 0; // Guest

window.onload = function() {
	initBase()
		.then(startGame);
}

function initBase() {
	return new Promise (function(resolve) {
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

		// Инициализируем подключение к базе
		const db = getDatabase(app);
		dbRef = ref(db);

		// Анонимная авторизация
		const auth = getAuth();
		signInAnonymously(auth)
			.then(function() {
				myUID = auth.currentUser.uid;
				resolve();
			});

	});
}

// Запись в базу Firebase	
// path - путь для сохранения данных
// data - сохраняемые данные
function storeInDatabase(path, data) {
	const gameRef = child(dbRef, path);
	set(gameRef, data);
}

function startGame() {

	// ToDo: currentPlayer = +1;

	for(let i = 0; i < gameSize; i++) {
		for(let j = 0; j < gameSize; j++) {
			setClickListener(i, j);
		}
	}

	// ToDo: определять текущий ход
	function setClickListener(i, j) {
		const cell = document.getElementById("cell-" + i + j);
		cell.onclick = function() {
			if (myTeam !== 0 && currentPlayer === myUID) {
				if (cells[i][j] === 0) {
					cells[i][j] = myTeam;
					let nextPlayer;
					if (myTeam === +1) {
						nextPlayer = coPlayer;
						document.getElementById('current').innerText = "Ход ноликов";
					} else {
						nextPlayer = gameOwner;
						document.getElementById('current').innerText = "Ход крестиков";
					}
					storeInDatabase('game/cells', cells);
					storeInDatabase('game/currentPlayer', nextPlayer);
				}
			}
		}
	}

	const button = document.getElementById("newGame");
	button.onclick = newGame;

	addDatabaseListeners();
}

function addDatabaseListeners() {
	const gameRef = child(dbRef, 'game/cells');
	onValue(gameRef, function(snapshot) {
		cells = snapshot.val();
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

	const currentPlayerRef = child(dbRef, 'game/currentPlayer');
	onValue(currentPlayerRef, function(snapshot) {
		currentPlayer = snapshot.val();
	})

	const ownerRef = child(dbRef, 'game/owner');
	onValue(ownerRef, function(snapshot) {
		gameOwner = snapshot.val();
		if (gameOwner === myUID) {
			myTeam = +1;
			document.getElementById('team').innerText = "Крестики";
		}
	})

	const coPlayerRef = child(dbRef, 'game/coPlayer');
	onValue(coPlayerRef, function(snapshot) {
		coPlayer = snapshot.val();
		if (coPlayer === myUID) {
			myTeam = -1;
			document.getElementById('team').innerText = "Нолики";
		}
		else if (coPlayer === null) {
			storeInDatabase('game/coPlayer', myUID);
		}
	})
}

function newGame() {

	const gameData = {
		owner: myUID,
		currentPlayer: myUID,
		cells: [[0,0,0],[0,0,0],[0,0,0]]
	}

	storeInDatabase('game', gameData);
}