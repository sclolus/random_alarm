import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import App from './App';
import reportWebVitals from './reportWebVitals';

var randomNormal = require("random-normal")


const root = ReactDOM.createRoot(document.getElementById('root'));

const sound = new Audio("/media/ping.mp3");
var end_of_pause


const random_config = {
    mean: 120, //secs
    dev: 30, //secs
}

sound.addEventListener("loadeddata", () => {
    end_of_pause = new Audio("/media/end-of-pause.mp3");

    end_of_pause.addEventListener("loadeddata", () => {
	root.render(
	    <React.StrictMode>
		<App />
	    </React.StrictMode>
	);
//	randomInterval()
    })
});


    


function randomInterval() {
    let interval_duration = randomNormal(random_config)
    
    setTimeout(alarm,
			interval_duration * 1000, // argument is in ms
			interval_duration)
}


function alarm(interval_duration) {
    console.log(`It has been ${interval_duration} secs. Now playing alarm`);
    sound.play();

    setTimeout(() => { end_of_pause.play() }, 10 * 1000)

    randomInterval()
}




// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { sound, randomInterval };

