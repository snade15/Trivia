exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function () {
    const players = [];
    const places = [];
    const purses = [];
    const inPenaltyBox = [];

    const popQuestions = [];
    const scienceQuestions = [];
    const sportsQuestions = [];
    const rockQuestions = [];

    let currentPlayer = 0;
    let isGettingOutOfPenaltyBox = false;

    this.init = () => {
        for (let i = 0; i < 50; i++) {
            popQuestions.push("Pop Question " + i);
            scienceQuestions.push("Science Question " + i);
            sportsQuestions.push("Sports Question " + i);
            rockQuestions.push(this.createRockQuestion(i));
        }
    };

    // Getters
    this.howManyPlayers = () => players.length;
    this.didPlayerWin = () => purses[currentPlayer] !== 6;
    this.isPlayable = () => players.length >= 2;
    this.currentCategory = () => {
        if ([0, 4, 8].includes(places[currentPlayer])) {
            return 'Pop';
        }
        if ([1, 5, 9].includes(places[currentPlayer])) {
            return 'Science';
        }
        if ([2, 6, 10].includes(places[currentPlayer])) {
            return 'Sports';
        }
        return 'Rock'; // 3, 7, 11
    };

    // Setters
    this.createRockQuestion = (index) => "Rock Question " + index;

    this.addPlayer = (playerName) => {
        players.push(playerName);
        places[this.howManyPlayers() - 1] = 0;
        purses[this.howManyPlayers() - 1] = 0;
        inPenaltyBox[this.howManyPlayers() - 1] = false;

        console.log(playerName + " was added");
        console.log("They are player number " + players.length);
    };

    // Functionality
    this.run = () => {
        do {
            this.roll(Math.floor(Math.random() * 6) + 1);

            if (Math.floor(Math.random() * 10) === 7) {
                notAWinner = this.wrongAnswer();
            } else {
                notAWinner = this.wasCorrectlyAnswered();
            }

        } while (notAWinner);
    };

    this.askQuestion = () => {
        if (this.currentCategory() === 'Pop') {
            console.log(popQuestions.shift());
        } else if (this.currentCategory() === 'Science') {
            console.log(scienceQuestions.shift());
        } else if (this.currentCategory() === 'Sports') {
            console.log(sportsQuestions.shift());
        } else if (this.currentCategory() === 'Rock') {
            console.log(rockQuestions.shift());
        }
    };

    this.roll = (roll) => {
        console.log(players[currentPlayer] + " is the current player");
        console.log("They have rolled a " + roll);

        if (inPenaltyBox[currentPlayer]) {
            if (roll % 2 !== 0) {
                isGettingOutOfPenaltyBox = true;

                console.log(players[currentPlayer] + " is getting out of the penalty box");
                places[currentPlayer] = places[currentPlayer] + roll;
                if (places[currentPlayer] > 11) {
                    places[currentPlayer] = places[currentPlayer] - 12;
                }

                console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
                console.log("The category is " + this.currentCategory());
                this.askQuestion();
            } else {
                console.log(players[currentPlayer] + " is not getting out of the penalty box");
                isGettingOutOfPenaltyBox = false;
            }
        } else {

            places[currentPlayer] = places[currentPlayer] + roll;
            if (places[currentPlayer] > 11) {
                places[currentPlayer] = places[currentPlayer] - 12;
            }

            console.log(players[currentPlayer] + "'s new location is " + places[currentPlayer]);
            console.log("The category is " + this.currentCategory());
            this.askQuestion();
        }
    };

    this.wasCorrectlyAnswered = () => {
        const winner = this.didPlayerWin();
        if (inPenaltyBox[currentPlayer]) {
            if (isGettingOutOfPenaltyBox) {
                console.log('Answer was correct!!!!');
                purses[currentPlayer] += 1;
                console.log(players[currentPlayer] + " now has " + purses[currentPlayer] + " Gold Coins.");

                currentPlayer += 1;
                if (currentPlayer === players.length) {
                    currentPlayer = 0;
                }
                return winner;
            } else {
                currentPlayer += 1;
                if (currentPlayer === players.length) {
                    currentPlayer = 0;
                }
                return true;
            }
        } else {
            console.log("Answer was correct!!!!");

            purses[currentPlayer] += 1;
            console.log(players[currentPlayer] + " now has " + purses[currentPlayer] + " Gold Coins.");

            currentPlayer += 1;
            if (currentPlayer === players.length) {
                currentPlayer = 0;
            }

            return winner;
        }
    };

    this.wrongAnswer = () => {
        console.log('Question was incorrectly answered');
        console.log(players[currentPlayer] + " was sent to the penalty box");
        inPenaltyBox[currentPlayer] = true;

        currentPlayer += 1;
        if (currentPlayer === players.length) {
            currentPlayer = 0;
        }
        return true;
    };
};

let notAWinner = false;

const game = new Game();
game.init();

game.addPlayer('Chet');
game.addPlayer('Pat');
game.addPlayer('Sue');

if (game.isPlayable()) {
    game.run();
} else {
    console.log('Not enough players yet. Need minimal two players to start.')
}

