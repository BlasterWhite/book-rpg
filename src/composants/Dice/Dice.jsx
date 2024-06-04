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

      diceRef.current[0].style.animation = 'rolling 3s';

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
      <div ref={(el) => (diceRef.current[0] = el)} onClick={throwDice} className={'element-dice'}>
          <div className={'element-dice-face element-dice-front'}></div>
          <div className={'element-dice-face element-dice-back'}></div>
          <div className={'element-dice-face element-dice-top'}></div>
          <div className={'element-dice-face element-dice-bottom'}></div>
          <div className={'element-dice-face element-dice-right'}></div>
          <div className={'element-dice-face element-dice-left'}></div>
      </div>
  );
}

Dice.propTypes = {
  onDiceResult: PropTypes.func,
  resetDice: PropTypes.bool
};
