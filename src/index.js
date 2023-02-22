import {React, useState} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import reportWebVitals from './reportWebVitals';
import './App.css';



var randomNormal = require("random-normal")


const root = ReactDOM.createRoot(document.getElementById('root'));

const sound = new Audio("/media/ping.mp3");
var end_of_pause


const random_config = {
    mean: 120, //secs
    dev: 90, //secs
}

sound.addEventListener("loadeddata", () => {
    end_of_pause = new Audio("/media/end-of-pause.mp3");

    end_of_pause.addEventListener("loadeddata", () => {
	root.render(
	    // <React.StrictMode>
		 <App />
	    // </React.StrictMode>
	);
//	randomInterval()
    })
});


    


function randomInterval(logs) {
    let interval_duration = randomNormal(random_config)
    
    setTimeout(alarm,
	       interval_duration * 1000, // argument is in ms
	       interval_duration,
	       logs)
}


function alarm(interval_duration, logs) {
    console.log(`It has been ${interval_duration} secs. Now playing alarm`);

    console.log(logs)
    const [old_array, setLogs] = logs;
    const new_array = [...old_array, interval_duration]

    setLogs(new_array);
    
    sound.play();

    setTimeout(() => { end_of_pause.play()
		       randomInterval([new_array, setLogs]) }, 10 * 1000)
}


function App() {
    const [started, setStarted] = useState(false)
    const [logs, setLogs] = useState([]);

    return (
    <div className="App">
	<button id="The button" onClick={() => { if (!started) { randomInterval([logs, setLogs]);  setStarted(true) }}} size="100px">Click me for alarm </button>
	{
	    logs.map((duration, index) => {
		return <p key={index}>Interval of {duration} was played</p>
	    }).reverse()
	}
    </div>
  );
}





// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { sound, randomInterval };

