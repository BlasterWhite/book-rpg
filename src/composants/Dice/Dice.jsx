import { useEffect, useRef, useState } from 'react';
import './Dice.scss';
import PropTypes from 'prop-types';

export function Dice({ onDiceResult, resetDice }) {

  const [isDiceThrown, setIsDiceThrown] = useState(false);
  
  const diceRef = useRef([]);

  useEffect(() => {
    if(resetDice) {
      setIsDiceThrown(false);
    }
  }, [resetDice]);

  async function throwDice() {
      
      if (isDiceThrown) return;
      setIsDiceThrown(true);

      const diceResult = Math.floor(Math.random() * 6) + 1;

      diceRef.current[0].style.animation = 'rolling1 3s';

      setTimeout(() => {

          switch (diceResult) {
            case 1:
              diceRef.current[0].style.transform = 'rotateX(0deg) rotateY(0deg)';
              break;
            case 6:
              diceRef.current[0].style.transform = 'rotateX(180deg) rotateY(0deg)';
              break;
            case 2:
              diceRef.current[0].style.transform = 'rotateX(-90deg) rotateY(0deg)';
              break;
            case 5:
              diceRef.current[0].style.transform = 'rotateX(90deg) rotateY(0deg)';
              break;
            case 3:
              diceRef.current[0].style.transform = 'rotateX(0deg) rotateY(90deg)';
              break;
            case 4:
              diceRef.current[0].style.transform = 'rotateX(0deg) rotateY(-90deg)';
              break;
            default:
              break;
          }
          diceRef.current[0].style.animation = 'none';

      }, 3050);
      
      await sleep(4000);
      
      onDiceResult(diceResult);
  }

  function sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
  }

  return (
      <div className={'container'}>
          <div ref={(el) => (diceRef.current[0] = el)} onClick={throwDice} className={'dice'}>
              <div className={'face front'}></div>
              <div className={'face back'}></div>
              <div className={'face top'}></div>
              <div className={'face bottom'}></div>
              <div className={'face right'}></div>
              <div className={'face left'}></div>
          </div>
      </div>
  );
}


Dice.propTypes = {
  onDiceResult: PropTypes.func,
  resetDice: PropTypes.bool
};
