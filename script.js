let countdown;

const startButtons = document.querySelectorAll('[data-time]');
const stopButton = document.querySelector('.js-stop-button');

const timerDisplay = document.querySelector( '.js-timer' );

function timer( seconds, mode ) {
    clearInterval(countdown);
    const now  = Date.now();
    const then = now + ( seconds * 1000 );
    displayTimeLeft( seconds, mode );

    countdown = setInterval( () => {
        const secondsLeft = Math.round( (then - Date.now()) / 1000);
        
        if( secondsLeft < 0 ) {
            clearInterval(countdown);
            return;
        }

        displayTimeLeft( secondsLeft, mode );
    }, 1000);
}


function displayTimeLeft( seconds, mode ) {
    let minutesLeft = Math.floor( seconds / 60 );
    let secondsLeft = seconds % 60;

    minutesLeft = minutesLeft.toString().padStart(2, '0');
    secondsLeft = secondsLeft.toString().padStart(2, '0');

    const display =  `${minutesLeft}:${secondsLeft}`;

    timerDisplay.textContent = display;

    document.title = `${display} | ${mode}`;
}

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    const mode = this.dataset.mode;
    
    timer(seconds, mode);
};

function stopTimer() {
    clearInterval(countdown);
    timerDisplay.textContent = '25:00';

    document.title = 'Pomodoro Timer';
}

startButtons.forEach( button => button.addEventListener( 'click', startTimer ));
stopButton.addEventListener( 'click', stopTimer );


//To do: Desktop notifications
//To do: localstorage
//to do: background based on current mode