import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import reportWebVitals from './reportWebVitals';
import './App.css';
import random from 'random';



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


    


function randomGaussianInterval(logs) {
    let interval_duration = randomNormal(random_config)
    
    setTimeout(alarmGaussian,
	       interval_duration * 1000, // argument is in ms
	       interval_duration,
	       logs)
}


function alarmGaussian(interval_duration, logs) {
    console.log(`It has been ${interval_duration} secs. Now playing alarm`);

    const [getLogs, setLogs] = logs;
    const new_array = [...getLogs(), interval_duration]

    setLogs(new_array);
    
    sound.play();

    setTimeout(() => { end_of_pause.play()
		       randomGaussianInterval(logs) }, 10 * 1000)
}

function distribution(random, number_of_intervals) {
    let index = 0
    let dist = []

    while (index < number_of_intervals) {
	const value = random()

	dist.push(value)
	index++
    }

    return dist
}

function compare(a, b) {
    return a - b
}


var lastTimeout = window.performance.now()

function alarm(interval_duration, logs) {
    const [getLogs, setLogs] = logs;
    const t = window.performance.now()

    const delta_t = (t - lastTimeout) / 1000
    
    console.log(`It's been ${delta_t}s. Now playing alarm`)

    lastTimeout = t
    
    const new_array = [...getLogs(), delta_t]
    
    setLogs(new_array);


    
    sound.play();
    setTimeout(() => {
	end_of_pause.play()
    }, 10 * 1000)

}

function randomUniformInterval(logs, number_of_intervals) {
    let interval_distribution = distribution(random.uniform(0.0, 3600.0), number_of_intervals).sort(compare)

    for (const interval of interval_distribution) {
	console.log(`Setting up timeout in ${interval}s`)
	setTimeout(() => alarm(interval, logs), interval * 1000)
    }

    setTimeout(() => {
	randomUniformInterval(logs, number_of_intervals)
    }, 3600 * 1000)
}

class App extends React.Component {
    state = {
	logs: [],
	started: false,
    }
    
    constructor(props) {
	super(props)

	this.getLogs = this.getLogs.bind(this)
	this.setLogs = this.setLogs.bind(this)
	this.setStarted = this.setStarted.bind(this)
    }

    setStarted() {
	this.setState({
	    started: true
	})
    }
    
    getLogs() {
	return this.state.logs
    }

    setLogs(logs) {
	this.setState({
	    logs
	})
    }

    render() {
	const started = this.state.started
	const logs = this.getLogs()
	
	return (
	    <div className="App">
		<button id="The uniform button" onClick={() => { if (!started) { randomUniformInterval([this.getLogs, this.setLogs], 30);  this.setStarted(true) }}} color={started ? "red" : "black" } size="100px">Uniform </button>
		<button id="The gaussian button" onClick={() => { if (!started) { randomGaussianInterval([this.getLogs, this.setLogs]);  this.setStarted(true) }}} color={started ? "red" : "black" } size="100px">Gaussian </button>
		{
		    logs.map((duration, index) => {
			return <p key={index}>Interval of {duration} was played</p>
		    }).reverse()
		}

		
	    </div>
	);
    }
}





// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
export { sound, randomGaussianInterval };

