import { randomInterval } from './index.js'

import './App.css';



function App() {
  return (
    <div className="App">
	  <button id="The button" onClick={() => { randomInterval()}} size="100px">Click me for alarm </button>
    </div>
  );
}

export default App;
