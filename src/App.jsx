import "./App.css";
import { useState, useEffect } from "react";

const targetValue = "REACT";

function Square({value, feedback}){
  return (
    <div className={`square ${feedback}`}>{value}</div>
  )
}

function Letter(){
  const [letter, setLetter] = useState("");
  const [index, setIndex] = useState(0);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    function handleSetLetter(key){
      if (index === 5) return;
      setLetter(letter + key.toUpperCase());
      setIndex(index + 1);
    }

    function handleRemovingLetter(){
      if (index === 0) return;
      setLetter(letter.slice(0, -1));
      setIndex(index - 1);
    }

    function handleValidateString(){
      if (index !== 5){
        console.log('Please fill all the boxes in a row');
      }else{
        console.log('validated');
        setValidated(true);
      }
    }
  
    function handleKeyEvent(e){
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
  }, [index]);
  
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
    <div className="row">
      {[0, 1, 2, 3, 4].map(i => (
        <Square key={i} value={letter[i] || ''} feedback={feedback(i)} />
      ))}
    </div>
  )
}

export default Letter;