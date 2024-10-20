import "./App.css";
import { useState, useEffect } from "react";

const targetValue = "REACT";

function Square({value, feedback}){
  return (
    <div className={`square ${feedback}`}>{value}</div>
  )
}

function Letter({active, gameStatus, handleGameStatus, index}){
  const [letter, setLetter] = useState("");
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    function handleSetLetter(key){
      if (letter.length === 5) return;
      setLetter(letter + key.toUpperCase());
    }

    function handleRemovingLetter(){
      if (letter.length === 0) return;
      setLetter(letter.slice(0, -1));
    }

    function handleValidateString(){
      if (letter.length !== 5){
        console.log('Please fill all the boxes in a row');
      }else {
        handleGameStatus(letter === targetValue)
        console.log('validated');
        setValidated(true);
      }
    }
  
    function handleKeyEvent(e){
      console.log(e.key, active, gameStatus, index);
      if(!active || gameStatus){
        return;
      }
      const key = e.key;
  
      if (/^[a-zA-Z]$/.test(key)){
        handleSetLetter(key);
      }
      else if (key == 'Backspace'){
        handleRemovingLetter();
      }
      else if (key == 'Enter') {
        handleValidateString();
      }
    }
    window.addEventListener('keydown', handleKeyEvent);
    return () => window.removeEventListener('keydown', handleKeyEvent);
  }, [letter, active, gameStatus]);
  
  function feedback(i){
    if(!validated){
      return '';
    }
    else if (targetValue[i] === letter[i]){
      return 'matched';
    } else if (targetValue.includes(letter[i])){
      return 'diff-index';
    }else{
      return 'not-matched';
    }
  }

  return (
    <div className="row" disabled={!active}>
      {[0, 1, 2, 3, 4].map(i => (
        <Square key={i} value={letter[i] || ''} feedback={feedback(i)} />
      ))}
    </div>
  )
}

function Wordle(){
  const [currentRow, setCurrentRow] = useState([true, false, false, false, false, false]);
  const [gameStatus, setGameStatus] = useState(false);
  const [index, setIndex] = useState(0);

  function handleGameStatus(status){
    if(status){
      setCurrentRow(Array(9).fill(false));
      setGameStatus(status);
      setIndex(6);
    }else{
      if (index === 6) return;
      setCurrentRow(currentRow.map((row, i) => i === index + 1 ? true : false));
      setIndex(index + 1);
    }
  }

  return (
    <div>
    <Letter key={0} active={currentRow[0]} gameStatus={gameStatus} handleGameStatus={handleGameStatus} index={0}/>
    <Letter key={1} active={currentRow[1]} gameStatus={gameStatus} handleGameStatus={handleGameStatus} index={1}/>
    <Letter key={2} active={currentRow[2]} gameStatus={gameStatus} handleGameStatus={handleGameStatus} index={2}/>
    <Letter key={3} active={currentRow[3]} gameStatus={gameStatus} handleGameStatus={handleGameStatus} index={3}/>
    <Letter key={4} active={currentRow[4]} gameStatus={gameStatus} handleGameStatus={handleGameStatus} index={4}/>
    <Letter key={5} active={currentRow[5]} gameStatus={gameStatus} handleGameStatus={handleGameStatus} index={5}/>
    </div>
  )
}

export default Wordle;