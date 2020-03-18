var rawGuess;

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
	if (guess === null || guess.length !== 2) {
		view.displayMessage("⚠ OOPS! THAT'S NOT A VALID COORDINATE.", "error");
	} else {
		var firstChar = guess.charAt(0);
		firstChar = firstChar.toUpperCase();
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);
		if (isNaN(row) || isNaN(column) || column === " " || row === " ") {
			view.displayMessage("⚠ OOPS! THAT'S NOT A VALID COORDINATE.", "error");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			view.displayMessage("⚠ OOPS! THAT'S OFF THE BOARD!", "error");
		} else {
			return row + column;
		}
	}
	return null;
}

var view = {
	displayMessage: function (msg, type) {
		var messageArea = document.getElementById("messages");
		messageArea.innerHTML = msg;
		messageArea.setAttribute("class", type)
	},
	displayHit: function (loc) {
		var cell = document.getElementById(loc);
		cell.innerHTML = "HIT!";
		cell.setAttribute("class", "hit");
	},
	displayMiss: function (loc) {
		var cell = document.getElementById(loc);
		cell.innerHTML = "MISS";
		cell.setAttribute("class", "miss");
	}
};

var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
	ships: [
		{
			locations: [0, 0, 0],
			hits: ["", "", ""]
	},
		{
			locations: [0, 0, 0],
			hits: ["", "", ""]
	},
		{
			locations: [0, 0, 0],
			hits: ["", "", ""]
	}
],
	fire: function (guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage(("🎯 HIT AT " + rawGuess), "success");
				if (this.isSunk(ship)) {
					view.displayMessage("⚓ BATTLESHIP " + (i + 1) + " SUNK!", "success");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage(("❌ MISS AT " + rawGuess), "fail");
		return false;
	},
	isSunk: function (ship) {
		for (var i = 0; i < this.shipLength; i++) {
			if (ship.hits[i] !== "hit") {
				return false;
			}
		}
		return true;
	},
	generateShipLocations: function () {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
		view.displayMessage("READY TO FIRE! ENTER A COORDINATE BELOW.", "")
	},
	generateShip: function () {
		var direction = Math.floor(Math.random() * 2);
		var row;
		var col;
		if (direction === 1) {
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
		} else {
			row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
			col = Math.floor(Math.random() * this.boardSize);
		}
		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				newShipLocations.push(row + "" + (col + i));
			} else {
				newShipLocations.push((row + i) + "" + col);
			}
		}
		return newShipLocations;
	},
	collision: function (locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = model.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};

var controller = {
	guesses: 0,
	processGuess: function (guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("🏆 YOU SUNK ALL THE SHIPS IN " + this.guesses + " SHOTS, WITH " + 9/this.guesses + "% ACCURACY!" , "success");
				document.getElementById("guessInput").disabled = true;
				document.getElementById("fireButton").disabled = true;
			}
		}
	}
};

function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;
	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;
	model.generateShipLocations();
}

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	rawGuess = guessInput.value;
	controller.processGuess(rawGuess);
	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

window.onload = init;
