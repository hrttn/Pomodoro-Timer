let countdown;

const progressBar = document.querySelector( '.timer__progress ');
const startButtons = document.querySelectorAll('[data-time]');
const stopButton = document.querySelector('.js-stop-button');

const body = document.querySelector('body');
const gong = document.querySelector('.gong');
const timerDisplay = document.querySelector( '.js-timer' );

const pomodoroLog = JSON.parse(localStorage.getItem('logs')) || {};
const logList = document.querySelector('.log');


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
            notifyUser( mode );
            gong.play();
            
            if( mode === 'Pomodoro' ) {
                logPomodoro( now );
            }
               
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


function logPomodoro( startTime ) {
    const dateTime = new Date( startTime );
    const localDate = dateTime.toDateString();
    const localTime = dateTime.toLocaleTimeString();

    if( !pomodoroLog[localDate] ) {
        pomodoroLog[localDate] = [];
    }

    pomodoroLog[localDate].push( localTime );

    localStorage.setItem( 'logs', JSON.stringify(pomodoroLog) );
    populateLog( pomodoroLog, logList );
}


function populateLog( logs = {}, logList) {
    if ( Object.keys(logs).length === 0 && logs.constructor === Object
) return;

    logList.innerHTML = '<h2>Log</h2>';
    const daysAndHours = [];

    Object.keys(logs).forEach(day => {
        let currentDay = `<h3>${day} (${logs[day].length})</h3>`;
        //logList.innerHTML += `<h3>${day}</h3>`;
        let hours = logs[day].map( (hour) => {
            return `
                <li class="log__entry">${hour}</li>
                `;
         }).join('');

        let hoursList =  `<ol class="log__entries">${hours}</ol>`;
        //logList.innerHTML += `<ol>${hours}</ol>`;
        let dayAndHour = currentDay + hoursList;
        daysAndHours.unshift(dayAndHour);
    });
    logList.innerHTML += daysAndHours.join('');
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

function notifyUser( mode ) {
    if (!Notification) {
        console.error('Desktop notifications not available in your browser. Try Chrome, Firefox or Safari.');
        return;
    }
    if (Notification.permission !== "granted") 
        Notification.requestPermission();
    else {
        let notification = new Notification( mode, {
            body: "Your time is up!!",
        });

        setTimeout(notification.close.bind(notification), 6000);
        notification.onclick = function () {
            window.focus();
        };
    };
}

startButtons.forEach( button => button.addEventListener( 'click', startTimer ));
stopButton.addEventListener( 'click', stopTimer );

populateLog( pomodoroLog, logList);

//To do: localstorage
//To do: keyboard shortcuts