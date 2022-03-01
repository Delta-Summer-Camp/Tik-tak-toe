/*
	Учебный проект игры Tik-tak-toe онлайн кружков физико-математической школы "Дельта"
*/


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

// Запуск игры: программа при запуске не знает, в каком состоянии находится игра
function startGame() {

	// Расставляем на каждую клетку обработчики клика мыши
	for(let i = 0; i < gameSize; i++) {
		for(let j = 0; j < gameSize; j++) {
			setClickListener(i, j);
		}
	}

	// Обработчик клика мышки
	function setClickListener(i, j) {
		const cell = document.getElementById("cell-" + i + j);
		cell.onclick = function() {
			if (myTeam !== 0 && currentPlayer === myUID) {
				if (cells[i][j] === 0) {
					cells[i][j] = myTeam;
					let nextPlayer;
					if (myTeam === +1) {
						nextPlayer = coPlayer;
						// document.getElementById('current').innerText = "Ход ноликов";
					} else {
						nextPlayer = gameOwner;
						// document.getElementById('current').innerText = "Ход крестиков";
					}
					storeInDatabase('game/cells', cells);
					storeInDatabase('game/state/currentPlayer', nextPlayer);
				}
			}
		}
	}

	// Кнопка "Новая игра"
	const button = document.getElementById("newGame");
	button.onclick = newGame;

	// Добавляем обработчики событий в базе Firebase
	addDatabaseListeners();
}

// Обработка событий в базе Firebase
function addDatabaseListeners() {

	// Обработка изменений матрицы игры
	// ToDo: тут можно следить, не выиграл ли текущий ход
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

	// Обработка изменений состояния игры
	const stateRef = child(dbRef, 'game/state');
	onValue(stateRef, function(snapshot) {
		const state = snapshot.val();

		// gameOwner
		if (gameOwner !== state.gameOwner) {
			gameOwner = state.gameOwner;
			if (gameOwner === myUID) {
				myTeam = +1;
				document.getElementById('team').innerText = "крестики";
			}			
		}

		// coPlayer
		if (coPlayer !== state.coPlayer) {
			coPlayer = state.coPlayer;
			if (coPlayer === myUID) {
				myTeam = -1;
				document.getElementById('team').innerText = "нолики";
			}

			// ToDo: сейчас алгоритм такой - если ты подключился и видишь, что за ноликов никто не играет
			// - сразу начинаешь играть "ноликами". Возможно имеет смысл спрашивать, а хочешь ли ты играть?
			else if (myTeam === 0 && coPlayer === 0) {
				storeInDatabase('game/state/coPlayer', myUID);
			}			
		}

		// currentPlayer
		if (currentPlayer !== state.currentPlayer) {
			currentPlayer = state.currentPlayer;
			if (currentPlayer === gameOwner) {
				document.getElementById("current").innerText = "крестиков";
			}
			else if (currentPlayer === coPlayer) {
				document.getElementById("current").innerText = "ноликов";			
			}

		}
		
	})
}

// "Обнуление игры" - кто нажал, тот "крестики"
// ToDo: возможно имеет смысл спрашивать, не случайно ли мы нажали на сброс игры
function newGame() {

	const gameData = {
		cells: [[0,0,0],[0,0,0],[0,0,0]],
		state: {
			gameOwner: myUID,
			currentPlayer: myUID,
			coPlayer: 0
		}
	}

	storeInDatabase('game', gameData);
}