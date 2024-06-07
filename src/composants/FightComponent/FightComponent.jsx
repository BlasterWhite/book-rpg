import './FightComponent.scss';
import { useEffect, useRef, useState } from 'react';
import PropTypes, { func } from 'prop-types';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Dice } from '@/composants/Dice/Dice.jsx';

export function FightComponent({ currentSection, handleNextSection, section, characterId }) {
  const [personnage, setPersonnage] = useState({});
  const [aventure, setAventure] = useState({});
  const [enemy, setEnemy] = useState({});
  const { user } = useAuth();
  const eventIsDispatched = useRef();
  const isMagicCombat = useRef(Math.random() > 0.5);

  const API_URL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    if (!user) return;

    fetch(`${API_URL}/personnages/${characterId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) =>
      response
        .json()
        .then((data) => setPersonnage(data))
        .catch((error) => console.log(error))
    );
  }, [characterId, user]);

  useEffect(() => {
    if (!user) return;

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: user.token }
    };
    fetch(`${API_URL}/personnages/${characterId}/aventure`, requestOptions).then((response) =>
      response
        .json()
        .then((data) => {
          setAventure(data);
          setEnemy(section.enemy);
        })
        .catch((error) => console.error(error))
    );
  }, [characterId, user]);

  useEffect(() => {
    if (eventIsDispatched.current) return;
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: user.token },
      body: JSON.stringify({ events: currentSection.events })
    };

    fetch(`${API_URL}/personnages/${characterId}/events`, requestOptions).then((response) =>
      response.json().catch((error) => console.error(error))
    );

    currentSection.events;
    eventIsDispatched.current = true;
  }, [API_URL, characterId, currentSection.events, user.token]);

  const [combatState, setCombatState] = useState('start');
  const [dexerityBonus, setDexerityBonus] = useState(0);
  const [playerHealth, setPlayerHealth] = useState(0);
  const [playerBaseHealth, setPlayerBaseHealth] = useState(0);
  const [enemyHealth, setEnemyHealth] = useState(0);
  const [enemyBaseHealth, setEnemyBaseHealth] = useState(0);
  function dexterityRoll() {
    return (
      <>
        <p>Roll the dice for your dexterity bonus</p>
        <Dice
          onDiceResult={(result) => handleDexterityRoll(result)}
          key={Math.random() * 9999999}
        />
      </>
    );
  }

  useEffect(() => {
    if (isMagicCombat.current) {
      setPlayerHealth(personnage.resistance);
      setPlayerBaseHealth(personnage.resistance);
      setEnemyHealth(enemy?.personnage?.resistance);
      setEnemyBaseHealth(enemy?.personnage?.resistance);
    } else {
      setPlayerHealth(personnage.endurance);
      setPlayerBaseHealth(personnage.endurance);
      setEnemyHealth(enemy?.personnage?.endurance);
      setEnemyBaseHealth(enemy?.personnage?.endurance);
    }
  }, [personnage, enemy]);

  function handleDexterityRoll(bonus) {
    setDexerityBonus(bonus);
    setCombatState('attackRoll');
    return true;
  }

  const [attackBonus, setAttackBonus] = useState(0);
  function attackRoll() {
    return (
      <>
        <p>Roll the dice for your attack bonus</p>
        <Dice onDiceResult={(result) => handleAttackRoll(result)} key={Math.random() * 9999999} />
      </>
    );
  }

  function handleAttackRoll(bonus) {
    setAttackBonus(bonus);

    const coef = dexerityBonus > 3 ? (personnage.dexterite / 100) : 0;

    if (isMagicCombat.current) {
      setAttackBonus(Math.ceil((bonus + (personnage.psychisme < 0 ? 0 : personnage.psychisme)) * (1 + coef)) - (personnage.psychisme < 0 ? 0 : personnage.psychisme));
    } else {
      setAttackBonus(Math.ceil((bonus + (personnage.force < 0 ? 0 : personnage.force)) * (1 + coef)) - (personnage.force < 0 ? 0 : personnage.force));
    }

    setCombatState('attack');
  }

  function attack(damage, target) {
    if (target === 'player') {
      setPlayerHealth(playerHealth - damage);
      if (playerHealth - damage < 0) {
        setPlayerHealth(0);
      }
    } else {
      setEnemyHealth(enemyHealth - damage);
      if (enemyHealth - damage < 0) {
        setEnemyHealth(0);
      }
    }

    if (playerHealth <= 0 || enemyHealth <= 0) {
      setCombatState('end');
    }
  }

  function enemyAttack() {
    let damage = 0;

    if (enemyHealth <= 0) {
      return setCombatState('end');
    }

    if (isMagicCombat.current) {
      damage = enemy.personnage.psychisme;
    } else {
      damage = enemy.personnage.force;
    }

    attack(damage, 'player');
    return (
      <>
        <p>
          Enemy attack is doing {damage} damage{damage > 1 ? 's' : ''}
        </p>
        <BaseButton text={'Next'} onClick={() => setCombatState('end')} />
      </>
    );
  }

  function initCombat() {
    setCombatState('dexterityRoll');
  }

  function isCombatFinished() {
    return playerHealth <= 0 || enemyHealth <= 0;
  }

  const [game, setGame] = useState(null);

  useEffect(() => {
    switch (combatState) {
      case 'start':
        setGame(
          <>
            <p>Click to start the fight {personnage.nom}.</p>
            <BaseButton text={'Start'} onClick={() => initCombat()} />
          </>
        );
        break;
      case 'dexterityRoll':
        setGame(dexterityRoll());
        break;
      case 'attackRoll':
        setGame(attackRoll());
        break;
      case 'attack':
        attack(
          (isMagicCombat.current ? personnage.force : personnage.psychisme) + attackBonus,
          'enemy'
        );
        setGame(
          <>
            <p>
              Your attack is doing{' '}
              {(isMagicCombat.current ? personnage.force : personnage.psychisme) + attackBonus}{' '}
              damage
              {(isMagicCombat.current ? personnage.force : personnage.psychisme) + attackBonus > 1
                ? 's'
                : ''}
            </p>
            <BaseButton text={'Next'} onClick={() => setCombatState('enemyAttack')} />
          </>
        );
        break;
      case 'enemyAttack':
        setGame(enemyAttack());
        break;
      case 'end':
        if (isCombatFinished()) {
          setGame(
            <>
              <p>{playerHealth <= 0 ? 'You lost' : 'You won'}</p>
              <BaseButton
                text={'Next'}
                onClick={() =>
                  handleClick(playerHealth <= 0 ? section.resultat.perd : section.resultat.gagne)
                }
              />
            </>
          );
        } else {
          setCombatState('dexterityRoll');
        }
        break;
      default:
        setGame('<p>Something went wrong</p>');
        break;
    }
  }, [combatState, attackBonus, personnage, enemy]);

  const handleClick = (id) => {
    handleNextSection(id);

    if (!user) return;
    if (!section) return;

    const statut = section.type === 'termine' ? 'termine' : 'en_cours';
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: user.token },
      body: JSON.stringify({ id_section_actuelle: id, statut: statut })
    };
    const newAventureID = Number.parseInt(aventure.id);
    fetch(`${API_URL}/aventures/${newAventureID}`, requestOptions).then((response) =>
      response.json().catch((error) => console.error(error))
    );
  };

  return (
    <div className={'fight-component-container'}>
      {isMagicCombat.current ? <h2>Magical Fight</h2> : <h2>Physical Fight</h2>}
      <div className={'fight-component-content'}>
        <div className={'fight-component-left'}>
          <div className={'fighter'}>
            <div
              className={'fighter-image'}
              style={{ backgroundImage: `url('${personnage?.image?.image}')` }}></div>
            <div className={'fighter-stats'}>
              <p>
                <strong>{personnage.nom}</strong>
              </p>
              {isMagicCombat.current ? (
                <>
                  <p>
                    🔮 Psychism: {personnage.psychisme} {attackBonus > 0 ? `+ ${attackBonus}` : ''}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    💪 Strength: {personnage.force} {attackBonus > 0 ? `+ ${attackBonus}` : ''}
                  </p>
                </>
              )}
              <p>
                ❤️ Health: {playerHealth} / {playerBaseHealth} <br />
                <progress value={playerHealth} max={playerBaseHealth}></progress>
              </p>
            </div>
          </div>
        </div>
        <div className={'fight-component-center'}>{game}</div>
        <div className={'fight-component-right'}>
          <div className={'fighter'}>
            <div
              className={'fighter-image'}
              style={{ backgroundImage: `url('${enemy?.personnage?.image?.image}')` }}></div>
            <div className={'fighter-stats'}>
              <p>
                <strong>{enemy?.personnage?.nom || 'Enemy'}</strong>
              </p>
              {isMagicCombat.current ? (
                <>
                  <p>🔮 Psychism: {enemy?.personnage?.psychisme}</p>
                </>
              ) : (
                <>
                  <p>💪 Strength: {enemy?.personnage?.force}</p>
                </>
              )}
              <p>
                ❤️ Health: {enemyHealth} / {enemyBaseHealth} <br />
                <progress value={enemyHealth} max={enemyBaseHealth}></progress>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

FightComponent.propTypes = {
  currentSection: PropTypes.object.isRequired,
  section: PropTypes.shape({
    id: PropTypes.number.isRequired,
    texte: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sections: PropTypes.array.isRequired,
    image: PropTypes.object,
    resultat: PropTypes.shape({
      condition: PropTypes.string,
      type_condition: PropTypes.string,
      gagne: PropTypes.number,
      perd: PropTypes.number
    }).isRequired
  }).isRequired,
  handleNextSection: PropTypes.func,
  characterId: PropTypes.string.isRequired
};
