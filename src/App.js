import './App.css';
import GameBoard from './GameBoard';


function App() {
  return (
    <div className="App">
      <h1 className='title'>othello</h1>
      <div className='playArea'>
        <GameBoard />
      </div>
    </div>
  );
}

export default App;
