import './App.css';
import { randomInterval } from './index.js'



function App() {
  return (
    <div className="App">
	  <button id="The button" onClick={() => { randomInterval()}} size="100px">Click me for alarm </button>
    </div>
  );
}

export default App;
