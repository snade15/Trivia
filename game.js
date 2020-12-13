class Game {
    constructor() {
        this.players = [];
        this.places = [];
        this.purses = [];
        this.inPenaltyBox = [];

        this.popQuestions = [];
        this.scienceQuestions = [];
        this.sportsQuestions = [];
        this.rockQuestions = [];

        this.currentPlayer = 0;
        this.isGettingOutOfPenaltyBox = false;

        for (let i = 0; i < 50; i++) {
            this.popQuestions.push("Pop Question " + i);
            this.scienceQuestions.push("Science Question " + i);
            this.sportsQuestions.push("Sports Question " + i);
            this.rockQuestions.push("Rock Question " + i);
        }
    }

    // Getters
    get howManyPlayers(){
        return this.players.length;
    }
    get didPlayerWin() {
        return this.purses[this.currentPlayer] !== 6;
    }
    get isPlayable() {
        return this.howManyPlayers >= 2;
    }
    get currentCategory(){
        if ([0, 4, 8].includes(this.places[this.currentPlayer])) {
            return 'Pop';
        }
        if ([1, 5, 9].includes(this.places[this.currentPlayer])) {
            return 'Science';
        }
        if ([2, 6, 10].includes(this.places[this.currentPlayer])) {
            return 'Sports';
        }
        return 'Rock'; // 3, 7, 11
    }

    addPlayer(playerName) {
        this.players.push(playerName);
        this.places[this.howManyPlayers - 1] = 0;
        this.purses[this.howManyPlayers - 1] = 0;
        this.inPenaltyBox[this.howManyPlayers - 1] = false;

        console.log(playerName + " was added");
        console.log("They are player number " + this.howManyPlayers);
    }

    // Functionality
    run() {
        do {
            this.roll(Math.floor(Math.random() * 6) + 1);
            let notAWinner = false;

            if (Math.floor(Math.random() * 10) === 7) {
                notAWinner = this.wrongAnswer();
            } else {
                notAWinner = this.wasCorrectlyAnswered();
            }

        } while (notAWinner);
    }

    askQuestion() {
        if (this.currentCategory === 'Pop') {
            console.log(this.popQuestions.shift());
        } else if (this.currentCategory === 'Science') {
            console.log(this.scienceQuestions.shift());
        } else if (this.currentCategory === 'Sports') {
            console.log(this.sportsQuestions.shift());
        } else if (this.currentCategory === 'Rock') {
            console.log(this.rockQuestions.shift());
        }
    };

    roll(roll) {
        console.log(this.players[this.currentPlayer] + " is the current player");
        console.log("They have rolled a " + roll);

        if (this.inPenaltyBox[this.currentPlayer]) {
            if (roll % 2 !== 0) {
                this.isGettingOutOfPenaltyBox = true;

                console.log(this.players[this.currentPlayer] + " is getting out of the penalty box");
                this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
                if (this.places[this.currentPlayer] > 11) {
                    this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
                }

                console.log(this.players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
                console.log("The category is " + this.currentCategory);
                this.askQuestion();
            } else {
                console.log(this.players[this.currentPlayer] + " is not getting out of the penalty box");
                this.isGettingOutOfPenaltyBox = false;
            }
        } else {
            this.places[this.currentPlayer] = this.places[this.currentPlayer] + roll;
            if (this.places[this.currentPlayer] > 11) {
                this.places[this.currentPlayer] = this.places[this.currentPlayer] - 12;
            }

            console.log(this.players[this.currentPlayer] + "'s new location is " + this.places[this.currentPlayer]);
            console.log("The category is " + this.currentCategory);
            this.askQuestion();
        }
    };

    wasCorrectlyAnswered() {
        const winner = this.didPlayerWin;
        if (this.inPenaltyBox[this.currentPlayer]) {
            if (this.isGettingOutOfPenaltyBox) {
                console.log('Answer was correct!!!!');
                this.purses[this.currentPlayer] += 1;
                console.log(this.players[this.currentPlayer] + " now has " + this.purses[this.currentPlayer] + " Gold Coins.");

                this.currentPlayer += 1;
                if (this.currentPlayer === this.howManyPlayers) {
                    this.currentPlayer = 0;
                }
                return winner;
            } else {
                this.currentPlayer += 1;
                if (this.currentPlayer === this.howManyPlayers) {
                    this.currentPlayer = 0;
                }
                return true;
            }
        } else {
            console.log("Answer was correct!!!!");

            this.purses[this.currentPlayer] += 1;
            console.log(this.players[this.currentPlayer] + " now has " + this.purses[this.currentPlayer] + " Gold Coins.");

            this.currentPlayer += 1;
            if (this.currentPlayer === this.howManyPlayers) {
                this.currentPlayer = 0;
            }

            return winner;
        }
    };

    wrongAnswer() {
        console.log('Question was incorrectly answered');
        console.log(this.players[this.currentPlayer] + " was sent to the penalty box");
        this.inPenaltyBox[this.currentPlayer] = true;

        this.currentPlayer += 1;
        if (this.currentPlayer === this.howManyPlayers) {
            this.currentPlayer = 0;
        }
        return true;
    };
}

let notAWinner = false;

const game = new Game();

game.addPlayer('Chet');
game.addPlayer('Pat');
game.addPlayer('Sue');

if (game.isPlayable) {
    game.run();
} else {
    console.log('Not enough players yet. Need minimal two players to start.')
}

