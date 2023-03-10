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


    


function randomGaussianInterval(logs, intervalNumber) {

    const random_config = {
	mean: 3600 / intervalNumber, //secs
	dev: 90, //secs
    }
    let interval_duration = randomNormal(random_config)
    
    setTimeout(alarmGaussian,
	       interval_duration * 1000, // argument is in ms
	       interval_duration,
	       logs,
	      intervalNumber)
}


function alarmGaussian(interval_duration, logs, intervalNumber) {
    console.log(`It has been ${interval_duration} secs. Now playing alarm`);

    const [getLogs, setLogs] = logs;
    const new_array = [...getLogs(), interval_duration]

    setLogs(new_array);
    
    sound.play();

    setTimeout(() => { end_of_pause.play()
		       randomGaussianInterval(logs) }, 10 * 1000, intervalNumber)
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

var canvas 
var context

function updateProgress(startTime) {
    const in_secs = startTime / 1000
    const now = window.performance.now() / 1000
    const delta_t = now - in_secs
    
    if (delta_t >= 3600)
	return ;


    const x = delta_t / 3600 * 1000
    
    context.fillStyle = "green"
    context.fillRect(x, 0, 2, 10);

    setTimeout(() => { updateProgress(startTime) }, 1000)
}

function randomUniformInterval(logs, number_of_intervals) {
    canvas = document.getElementById("canvas");    
    context = canvas.getContext("2d")
    context.reset()
    
    let interval_distribution = distribution(random.uniform(0.0, 3600.0), number_of_intervals).sort(compare)

    context.fillRect(0, 0, 1000, 2);

    
    
    
    // canvas.clear()
    context.fillStyle = "red"

    for (const interval of interval_distribution) {
	console.log(`Setting up timeout in ${interval}s`)

	const x = interval / 3600 * 1000
	context.fillRect(x, 0, 2, 10);
	
	setTimeout(() => alarm(interval, logs), interval * 1000)
    }

    const t0 = window.performance.now()

    setTimeout(() => { updateProgress(t0) }, 0)


    setTimeout(() => {
	randomUniformInterval(logs, number_of_intervals)
    }, 3600 * 1000)
}

class App extends React.Component {
    state = {
	logs: [],
	started: false,
	canvas: true,
	intervalNumber: 30,
    }
    
    constructor(props) {
	super(props)

	this.getLogs = this.getLogs.bind(this)
	this.setLogs = this.setLogs.bind(this)
	this.setStarted = this.setStarted.bind(this)
	this.toggleCanvas = this.toggleCanvas.bind(this)
	this.handleChange = this.handleChange.bind(this)
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

    toggleCanvas() {
	this.setState({
	    canvas: !this.state.canvas
	})
	canvas.hidden = this.state.canvas
    }

    handleChange(event) {
	let value = parseInt(event.target.value)

	if (isNaN(value))
	    value = 0


	this.setState({
	    intervalNumber: value
	})
    }

    render() {
	const started = this.state.started
	const logs = this.getLogs()

	const intervalNumber = this.state.intervalNumber

	return (
	    <div>
		<button onClick={this.toggleCanvas}> Toggle canvas</button>
		
		<button id="The uniform button" onClick={() => { if (!started) { randomUniformInterval([this.getLogs, this.setLogs], intervalNumber);  this.setStarted(true) }}} color={started ? "red" : "black" } size="100px">Uniform </button>
		<button id="The gaussian button" onClick={() => { if (!started) { randomGaussianInterval([this.getLogs, this.setLogs], intervalNumber);  this.setStarted(true) }}} color={started ? "red" : "black" } size="100px">Gaussian </button>
		<input id="intervalNumber" value={intervalNumber !== 0 ? intervalNumber : ''} onChange={this.handleChange} type='number' placeholder='Enter a number of interval per hour'/>
		<canvas id="canvas" height="30px" width="1000vw"> </canvas>
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

