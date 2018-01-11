let countdown;

const progressBar = document.querySelector( '.timer__progress ');
const startButtons = document.querySelectorAll('[data-time]');
const stopButton = document.querySelector('.js-stop-button');
const body = document.querySelector('body');

const timerDisplay = document.querySelector( '.js-timer' );

function timer( seconds, mode ) {
    clearInterval(countdown);
    const now  = Date.now();
    const then = now + ( seconds * 1000 );
    displayTimeLeft( seconds, mode );
    displayProgressBar( seconds, seconds );

    countdown = setInterval( () => {
        const secondsLeft = Math.round( (then - Date.now()) / 1000);
        
        if( secondsLeft < 0 ) {
            clearInterval(countdown);
            return;
        }

        displayTimeLeft( secondsLeft, mode );
        displayProgressBar( seconds, secondsLeft );
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

function displayProgressBar ( totalSeconds, secondsLeft ) {

    const barWidth = Math.round(  ( 1 -( secondsLeft / totalSeconds ) ) * 100, 2);

    progressBar.style.width = `${barWidth}%`;

    if( barWidth > 98) {
        progressBar.style.borderBottomRightRadius = '0.5rem';
    } else {
        progressBar.style.borderBottomRightRadius = '0';
    }
}

function changeColor( modifier = 'pomodoro' ) {
    
    let backgroundColor;

    switch( modifier ) {
        case 'pomodoro':
            backgroundColor = '#F44335';
        break;
        
        case 'short break':
            backgroundColor = '#2196F3';
        break;
        
        case 'long break':
            backgroundColor = '#4CAF50';
        break;
        
        default:
            backgroundColor = '#F44335';
    }

    body.style.borderColor = backgroundColor;
    progressBar.style.backgroundColor = backgroundColor;
}

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    const mode = this.dataset.mode;
    
    timer(seconds, mode);
    changeColor( mode.toLowerCase() );
};

function stopTimer() {
    clearInterval(countdown);
    timerDisplay.textContent = '25:00';

    document.title = 'Pomodoro Timer';

    displayProgressBar(900, 900);
    changeColor();
}

startButtons.forEach( button => button.addEventListener( 'click', startTimer ));
stopButton.addEventListener( 'click', stopTimer );


//To do: Desktop notifications
//To do: localstorage
//to do: add sound