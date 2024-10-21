import "./App.css";
import { useState, useEffect } from "react";

function Square({value, feedback}){
  return (
    <div className={`square ${feedback}`}>{value}</div>
  )
}

function Letter({active, handleGameStatus, index, targetValue, handleMessage}){
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
        handleMessage('Enter All Five Letter Word');
        console.log('Please fill all the boxes in a row');
      }else {
        handleGameStatus(letter === targetValue)
        console.log('validated');
        setValidated(true);
      }
    }
  
    function handleKeyEvent(e){
      if(!active){
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
  }, [letter, active]);
  
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

async function fetchRandomWord() {
  const response = await fetch("https://random-word-api.vercel.app/api?words=1&length=5&type=uppercase");
  const data = await response.json();
  return data[0];
}

function Wordle(){
  const [currentRow, setCurrentRow] = useState([true, false, false, false, false, false]);
  const [gameStatus, setGameStatus] = useState(false);
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState('Guess Five Letter Word');
  const [targetWord, setTargetWord] = useState('');

  useEffect(() => {
    async function getWord() {
      const word = await fetchRandomWord(); // Fetch a random word
      setTargetWord(word);
    }
    getWord();
  }, []);

  function handleGameStatus(status){
    if(status){
      setCurrentRow(Array(6).fill(false));
      setGameStatus(status);
      setIndex(6);
      setMessage('You Won')
    }else{
      if (index === 6) {
        setMessage(`Game Over! Your Word is ${targetWord}`);
        return;
      }
      setCurrentRow(currentRow.map((row, i) => i === index + 1 ? true : false));
      setIndex(index + 1);
      setMessage('Oops Try Again!')
    }
  }

  return (
    <div className="wordle">
      <div className="board">
        {currentRow.map((status, index) => <Letter key={index} active={status && !gameStatus} handleGameStatus={handleGameStatus} index={index} targetValue={targetWord} handleMessage={(msg) => setMessage(msg)}/>)}
      </div>
      <div className="message">{message}</div>
    </div>
  )
}

export default Wordle;