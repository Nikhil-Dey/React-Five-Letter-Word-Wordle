import "./App.css";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

function Square({value, feedback}){
  return (
    <div className={`square ${feedback}`}>{value}</div>
  )
}

Square.propTypes = {
  value: PropTypes.string.isRequired,  
  feedback: PropTypes.string.isRequired 
};

function Letter({active, handleGameStatus, targetValue, handleMessage}){
  const [letter, setLetter] = useState("");
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if(!active) return;

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
      const key = e.key;
  
      if (/^[a-zA-Z]$/.test(key)){
        handleSetLetter(key);
      }
      else if (key === 'Backspace'){
        handleRemovingLetter();
      }
      else if (key === 'Enter') {
        handleValidateString();
      }
    }
    window.addEventListener('keydown', handleKeyEvent);
    return () => window.removeEventListener('keydown', handleKeyEvent);
  }, [letter, active, handleGameStatus, handleMessage, targetValue]);
  
  function getFeedback(){
    const result = Array(5).fill('');
    if(!validated){
      return result;
    }

    const targetedCount = Array(26).fill(0);
    const guessedCount = Array(26).fill(0);

    for (let i = 0; i<5; i++){
      const targetLetter = targetValue[i];
      const guessLetter = letter[i];
      const pos = targetLetter.charCodeAt(0) - 'A'.charCodeAt(0);

      targetedCount[pos]++;
      if (targetLetter === guessLetter){
        result[i] = 'matched';
        guessedCount[pos]++;
      }
    }

    for (let i = 0; i<5; i++){
      const guessLetter = letter[i];
      const pos = guessLetter.charCodeAt(0) - 'A'.charCodeAt(0);

      if (result[i] === 'matched') continue;

      if (targetValue.includes(guessLetter) && guessedCount[pos] < targetedCount[pos]){
        result[i] = 'diff-index';
        guessedCount[pos]++;
      }else{
        result[i] = 'not-matched';
      }
    }

    return result;
  }

  const feedback = getFeedback();

  return (
    <div className="row">
      {Array.from({ length: 5 }).map((_,i) => (
        <Square key={i} value={letter[i] || ''} feedback={feedback[i]} />
      ))}
    </div>
  )
}

Letter.propTypes = {
  active: PropTypes.bool.isRequired,               
  handleGameStatus: PropTypes.func.isRequired,     
  targetValue: PropTypes.string.isRequired,        
  handleMessage: PropTypes.func.isRequired         
};

async function fetchRandomWord() {
  try {
    const response = await fetch("https://random-word-api.vercel.app/api?words=1&length=5&type=uppercase");
    const data = await response.json();
    return data[0];
  } catch (error) {
    console.error("Error fetching the word:", error);
    return "";
  }
}

function Wordle(){
  const [gameStatus, setGameStatus] = useState(false);
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState('Start typing the five letters and press enter for validation');
  const [targetWord, setTargetWord] = useState('');

  useEffect(() => {
    async function getWord() {
      const word = await fetchRandomWord();
      // console.log(word);
      if (word.trim()){
        setTargetWord(word);
      }else{
        setMessage('Error while Loading!')
        setIndex(6);
      }
    }
    getWord();
  }, []);

  function handleGameStatus(status){
    if(status){
      setGameStatus(status);
      setMessage('You Won')
    }else{
      if (index === 5) {
        setMessage(`Game Over! Your Word is ${targetWord}`);
        return;
      }
      setIndex(index + 1);
      setMessage('Oops Try Again!')
    }
  }

  return (
    <div className="wordle">
      <h2>Guess the Five Letter Word</h2>
      <div className="board">
        {Array.from({ length: 6 }).map((_, i) => <Letter key={i} active={ index === i && !gameStatus} handleGameStatus={handleGameStatus} targetValue={targetWord} handleMessage={(msg) => setMessage(msg)}/>)}
      </div>
      <div className="message">{message}</div>
    </div>
  )
}

export default Wordle;