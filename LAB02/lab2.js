var prompt = require('prompt');
prompt.start();

//Prompt
const promptUser = () => {
    // Display the game options to the user
    console.log('Welcome to ROCK, PAPER, or SCISSORS!');
    console.log('Choose an options: ');
    console.log('1. ROCK');
    console.log('2. PAPER');
    console.log('3. SCISSORS');

    // Prompt the user for input
    prompt.get(['option'], function (err, result) {
        // Check if the selected option is valid (1, 2, or 3)
        if(result.option != '1' && result.option != '2' && result.option != '3') {
            console.log('Select between 1, 2 or 3');
            // If the option is invalid, ask again
            promptUser();
        }
        else {
            // Convert the user's selection to its corresponding value (e.g., "ROCK", "PAPER", or "SCISSORS")
            let chooseUser = convertSelection(result.option);

            // Generate a random selection for the CPU
            let chooseCPU = randomCPU();
        
            // Check and display the game result
            CheckResult(chooseUser, chooseCPU);
        }
    });
}

//Random Number
const randomCPU = () => {
    // Generate a random number between 0 and 1
    const randomNumber = Math.random();

    // Assign "PAPER" if the number is 0.34 or lower
    if (randomNumber <= 0.34) {
        return 'PAPER';
    }
    else if (randomNumber <= 0.67) {
        // Assign "SCISSORS" if the number is between 0.35 and 0.67
        return 'SCISSORS';
    }
    else {
        // Assign "ROCK" if the number is greater than 0.67
        return 'ROCK';
    }
}

//Convert User Choose
const convertSelection = (optionUser) => {
    let option;
    // Convert user input (1, 2, 3) into corresponding game choices
    switch (optionUser) {
        case '1':
            option = 'ROCK'
            break;
        case '2':
            option = 'PAPER'
            break;
        case '3':
            option = 'SCISSORS'
            break;
    }

    return option;
}

//Check Results
const CheckResult = (user, CPU) => {
    // Check if both selections are the same, resulting in a tie
    if(user === CPU) {
        console.log('It\'s a tie');
    }
    // Check if the user wins based on game rules
    else if((user === 'ROCK' && CPU === 'SCISSORS') ||
            (user === 'SCISSORS' && CPU === 'PAPER') ||
            (user === 'PAPER' && CPU === 'ROCK')) {
        console.log('User Wins');
    }
    // If it's not a tie and the user didn't win, the computer wins
    else {
        console.log('Computer Wins');
    }
}

//Execute
promptUser();