import './AdminSectionEditView.scss';
import { NavLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BaseButton } from '@/composants/Base/BaseButton/BaseButton.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function AdminSectionEditView() {
  const { bookId, sectionId } = useParams();

  const [sections, setSections] = useState([]);
  const { user } = useAuth();

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/livres/${bookId}/sections`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setSections(data.sort((a, b) => a.numero_section - b.numero_section));
        });
      } else {
        console.error('Error fetching sections');
      }
    });
  }, [bookId, apiURL, sectionId, user]);

  const [EditSection, setEditSection] = useState({});

  const [enemies, setEnemies] = useState([]);
  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/enemies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEnemies(data);
        });
      } else {
        console.error('Error fetching equipment');
      }
    });
  }, [apiURL, user]);

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/livres/${bookId}/sections/${sectionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEditSection(data);
          setEventsFromFetch(data?.events);

          if (data.type === 'enigme' || data.type === 'combat' || data.type === 'des') {
            setWin(data.resultat.gagne);
            setLose(data.resultat.perd);
          }

          if (data.type === 'enigme') {
            setSolution(data.resultat.condition);
          }

          if (data.type === 'des') {
            setWinDice(data.resultat.condition?.['1']);
            setLoseDice(data.resultat.condition?.['2']);
          }

          if (data.type === 'combat') {
            setCombatType(
              enemies?.find((enemy) => enemy.personnage.id === data.resultat.condition) ||
                enemies?.[0] ||
                ''
            );
          }
        });
      } else {
        console.error('Error fetching sections');
      }
    });
  }, [bookId, sectionId, apiURL, user, enemies]);

  // weapons
  const [weapons, setWeapons] = useState([]);
  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/armes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setWeapons(data);
        });
      } else {
        console.error('Error fetching weapons');
      }
    });
  }, [apiURL, user]);

  // equipment
  const [equipments, setEquipments] = useState([]);
  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/equipements`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEquipments(data);
        });
      } else {
        console.error('Error fetching equipment');
      }
    });
  }, [apiURL, user]);

  function editSection(e) {
    setEditSection((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function editSectionInSections(e) {
    setEditSection((prev) => ({
      ...prev,
      sections: [
        ...prev.sections.slice(0, parseInt(e.target.name.split('-')[1]) - 1),
        { id: e.target.value },
        ...prev.sections.slice(parseInt(e.target.name.split('-')[1]))
      ]
    }));
  }

  const [winDice, setWinDice] = useState([]);
  const [loseDice, setLoseDice] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  function handleDiceChange(e) {
    if (e.target.checked) {
      setWinDice([...winDice, parseInt(e.target.name)]);
      setLoseDice(loseDice.filter((dice) => dice !== parseInt(e.target.name)));
    } else {
      setWinDice(winDice.filter((dice) => dice !== parseInt(e.target.name)));
      setLoseDice([...loseDice, parseInt(e.target.name)]);
    }
  }

  const dicesInputs = () => {
    const inputs = [];
    for (let i = 1; i <= 12; i++) {
      inputs.push(
        <div key={i}>
          <label htmlFor={`dice-${i}`}>{i}: </label>
          <input
            type="checkbox"
            name={i}
            onChange={handleDiceChange}
            checked={winDice.includes(i)}
          />
        </div>
      );
    }
    return inputs;
  };

  const [solution, setSolution] = useState('');
  const [win, setWin] = useState('');
  const [lose, setLose] = useState('');
  const [combat_type, setCombatType] = useState();

  function handleSubmit(e) {
    e.preventDefault();

    let section = {};

    if (EditSection.type === 'choix') {
      EditSection.sections = EditSection.sections.filter((section) => section.id !== 'none');
      section.destinations = EditSection.sections.map((section) => {
        try {
          return parseInt(section.id);
        } catch (e) {
          return null;
        }
      });
      section.numero_section = EditSection.numero_section;
      section.texte = EditSection.texte;
      section.type = EditSection.type;
      section.id_image = EditSection.id_image;
      section.event = formatEvent();
      updateSection(section);
    }

    if (EditSection.type === 'enigme') {
      section.resultat = EditSection.resultat;
      section.destinations = [parseInt(win), parseInt(lose)];
      section.numero_section = EditSection.numero_section;
      section.texte = EditSection.texte;
      section.type = EditSection.type;
      section.id_image = EditSection.id_image;
      section.resultat = {
        condition: solution,
        type_condition: 'text',
        gagne: parseInt(win),
        perd: parseInt(lose)
      };

      section.event = formatEvent();
      updateSection(section);
    }

    if (EditSection.type === 'des') {
      section.resultat = EditSection.resultat;
      section.destinations = [parseInt(win), parseInt(lose)];
      section.numero_section = EditSection.numero_section;
      section.texte = EditSection.texte;
      section.type = EditSection.type;
      section.id_image = EditSection.id_image;
      section.resultat = {
        condition: {
          1: winDice,
          2: loseDice
        },
        type_condition: 'JSON',
        gagne: parseInt(win),
        perd: parseInt(lose)
      };

      section.event = formatEvent();
      updateSection(section);
    }

    if (EditSection.type === 'none') {
      section.numero_section = EditSection.numero_section;
      section.texte = EditSection.texte;
      section.type = EditSection.type;
      section.id_image = EditSection.id_image;
      section.event = formatEvent();
      updateSection(section);
    }

    if (EditSection.type === 'combat') {
      section.resultat = EditSection.resultat;
      section.destinations = [parseInt(win), parseInt(lose)];
      section.numero_section = EditSection.numero_section;
      section.texte = EditSection.texte;
      section.type = EditSection.type;
      section.id_image = EditSection.id_image;
      section.resultat = {
        condition: combat_type?.personnage?.id,
        type_condition: 'id',
        gagne: parseInt(win),
        perd: parseInt(lose)
      };

      section.event = formatEvent();
      updateSection(section);
    }

    if (EditSection.type === 'termine') {
      section.numero_section = EditSection.numero_section;
      section.texte = EditSection.texte;
      section.type = EditSection.type;
      section.id_image = EditSection.id_image;
      section.event = formatEvent();
      updateSection(section);
    }
  }

  function updateSection(section) {
    if (!user) return;
    fetch(`${apiURL}/livres/${bookId}/sections/${sectionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: user.token
      },
      body: JSON.stringify(section)
    }).catch((error) => {
      console.error('Error updating section', error);
    });
  }

  const [events, setEvents] = useState([
    {
      operation: 'none',
      which: 'attribute',
      type: 'force',
      value: 0
    },
    {
      operation: 'none',
      which: 'attribute',
      type: 'force',
      value: 0
    },
    {
      operation: 'none',
      which: 'attribute',
      type: 'force',
      value: 0
    },
    {
      operation: 'none',
      which: 'attribute',
      type: 'force',
      value: 0
    }
  ]);

  function handleEventChange(eventIndex, e) {
    setEvents((prev) => {
      const newEvents = [...prev];
      newEvents[eventIndex] = {
        ...newEvents[eventIndex],
        [e.target.id]: e.target.value
      };
      return newEvents;
    });
  }

  function formatEvent() {
    let result = [];

    events.forEach((event) => {
      if (event.operation !== 'none') {
        let obj = {
          operation: event.operation,
          which: event.which,
          value: event.value
        };
        if (event.which === 'attribute') {
          obj.type = event.type;
        }
        result.push(obj);
      }
    });

    return result;
  }

  function setEventsFromFetch(fetchedEvents) {
    if (!fetchedEvents) return;

    let newEvents = [];

    events.forEach((event, index) => {
      if (fetchedEvents[index]) {
        newEvents.push(fetchedEvents[index]);
      } else {
        newEvents.push(event);
      }
    });

    setEvents(newEvents);
  }

  return (
    <div className={'admin-section-edit-view'}>
      <h1 className={'title'}>Admin</h1>
      <NavLink to={`/admin/book/${bookId}/section`}>← Back to admin section</NavLink>
      <form onSubmit={handleSubmit}>
        <label htmlFor={'texte'}>Text: </label>
        <textarea name="texte" value={EditSection.texte} onChange={editSection} />
        <details>
          <summary>Events settings</summary>
          {events.map((event, index) => (
            <details className={'event'} key={index}>
              <summary>Event {index + 1}</summary>
              <label htmlFor={'operation'}>Operation: </label>
              <select
                id={'operation'}
                value={event.operation}
                onChange={(e) => handleEventChange(index, e)}>
                <option value={'none'}>None</option>
                <option value={'add'}>Add</option>
                <option value={'remove'}>Remove</option>
              </select>
              <label htmlFor={'which'}>What: </label>
              <select
                id={'which'}
                value={event.which}
                onChange={(e) => handleEventChange(index, e)}>
                <option value={'attribute'}>attribute</option>
                <option value={'equipment'}>equipment</option>
                <option value={'weapon'}>weapon</option>
              </select>
              <label
                htmlFor={'type'}
                style={{ display: event.which === 'attribute' ? 'initial' : 'none' }}>
                Type:
              </label>
              <select
                style={{ display: event.which === 'attribute' ? 'initial' : 'none' }}
                id={'type'}
                value={event.type}
                onChange={(e) => handleEventChange(index, e)}>
                <option value={'force'}>Force</option>
                <option value={'dexterite'}>Dextérité</option>
                <option value={'endurance'}>Endurance</option>
                <option value={'psychisme'}>Psychisme</option>
                <option value={'resistance'}>Resistance</option>
              </select>
              <label
                htmlFor={'value'}
                style={{ display: event.which === 'attribute' ? 'initial' : 'none' }}>
                Value:
              </label>
              <input
                type="number"
                id={'value'}
                style={{ display: event.which === 'attribute' ? 'initial' : 'none' }}
                value={event.value}
                onChange={(e) => handleEventChange(index, e)}
              />
              <label
                htmlFor={'value'}
                style={{ display: event.which === 'weapon' ? 'initial' : 'none' }}>
                Weapon:
              </label>
              <select
                id={'value'}
                value={event.value}
                onChange={(e) => handleEventChange(index, e)}
                style={{ display: event.which === 'weapon' ? 'initial' : 'none' }}>
                {weapons.map((weapon) => (
                  <option key={weapon.id} value={weapon.id}>
                    {weapon.titre}
                  </option>
                ))}
              </select>
              <label
                htmlFor={'value'}
                style={{ display: event.which === 'equipment' ? 'initial' : 'none' }}>
                Equipment:
              </label>
              <select
                id={'value'}
                value={event.value}
                onChange={(e) => handleEventChange(index, e)}
                style={{ display: event.which === 'equipment' ? 'initial' : 'none' }}>
                {equipments.map((equipment) => (
                  <option key={equipment.id} value={equipment.id}>
                    {equipment.nom}
                  </option>
                ))}
              </select>
            </details>
          ))}
        </details>
        <div className={'interactivity-section'}>
          <select name="type" value={EditSection.type} onChange={editSection}>
            <option value="none">None</option>
            <option value="enigme">Enigma</option>
            <option value="des">Dices</option>
            <option value="choix">Choice</option>
            <option value="combat">Fight</option>
            <option value="termine">End</option>
          </select>
          {EditSection.type === 'none' && (
            <div className={'none-content'}>
              <p>There is nothing to specify in a none type section</p>
            </div>
          )}
          {EditSection.type === 'enigme' && (
            <div className={'enigma-content'}>
              <div>
                <label htmlFor={'solution'}>Solution: </label>
                <input
                  type="text"
                  name="solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor={'win'}>Win destination: </label>
                <select name="win" value={win} onChange={(e) => setWin(e.target.value)}>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.numero_section + ' | '}
                      {section.texte.length > 20
                        ? section.texte.slice(0, 20) + '...'
                        : section.texte}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={'lose'}>Lose destination: </label>
                <select name="lose" value={lose} onChange={(e) => setLose(e.target.value)}>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.numero_section + ' | '}
                      {section.texte.length > 20
                        ? section.texte.slice(0, 20) + '...'
                        : section.texte}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {EditSection.type === 'des' && (
            <div className={'dice-content'}>
              <div>
                <label htmlFor={'dice'}>Win score: </label>
                <div className={'dices'}>{dicesInputs()}</div>
              </div>
              Win dices: {winDice.join(', ')} <br />
              Lose dices: {loseDice.join(', ')}
              <div>
                <label htmlFor={'destination'}>Win destination: </label>
                <select name="destination" value={win} onChange={(e) => setWin(e.target.value)}>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.numero_section + ' | '}
                      {section.texte.length > 20
                        ? section.texte.slice(0, 20) + '...'
                        : section.texte}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={'destination'}>Lose destination: </label>
                <select name="destination" value={lose} onChange={(e) => setLose(e.target.value)}>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.numero_section + ' | '}
                      {section.texte.length > 20
                        ? section.texte.slice(0, 20) + '...'
                        : section.texte}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {EditSection.type === 'choix' && (
            <div className={'choice-content'}>
              <div>
                <label htmlFor={'destination-1'}>Destination 1: </label>
                <select
                  name="destination-1"
                  value={EditSection.sections?.[0] ? EditSection.sections?.[0].id : 'none'}
                  onChange={editSectionInSections}>
                  <option value={'none'}>None</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.numero_section + ' | '}
                      {section.texte.length > 20
                        ? section.texte.slice(0, 20) + '...'
                        : section.texte}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={'destination-2'}>Destination 2: </label>
                <select
                  name="destination-2"
                  value={EditSection.sections?.[1] ? EditSection.sections?.[1].id : 'none'}
                  onChange={editSectionInSections}>
                  <option value={'none'}>None</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.numero_section + ' | '}
                      {section.texte.length > 20
                        ? section.texte.slice(0, 20) + '...'
                        : section.texte}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={'destination-3'}>Destination 3: </label>
                <select
                  name="destination-3"
                  value={EditSection.sections?.[2] ? EditSection.sections?.[2].id : 'none'}
                  onChange={editSectionInSections}>
                  <option value={'none'}>None</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.numero_section + ' | '}
                      {section.texte.length > 20
                        ? section.texte.slice(0, 20) + '...'
                        : section.texte}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={'destination-4'}>Destination 4: </label>
                <select
                  name="destination-4"
                  value={EditSection.sections?.[3] ? EditSection.sections?.[3].id : 'none'}
                  onChange={editSectionInSections}>
                  <option value={'none'}>None</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.numero_section + ' | '}
                      {section.texte.length > 20
                        ? section.texte.slice(0, 20) + '...'
                        : section.texte}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {EditSection.type === 'combat' && (
            <div className={'fight-content'}>
              <div>
                <label htmlFor={'skill'}>Enemy: </label>
                <select
                  name="skill"
                  value={combat_type}
                  onChange={(e) => setCombatType(e.target.value)}>
                  {enemies.map((enemy) => (
                    <option key={enemy?.personnage?.id} value={enemy}>
                      {enemy?.personnage?.id} | {enemy?.personnage?.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={'win'}>Win destination: </label>
                <select name="win" value={win} onChange={(e) => setWin(e.target.value)}>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.numero_section + ' | '}
                      {section.texte.length > 20
                        ? section.texte.slice(0, 20) + '...'
                        : section.texte}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={'lose'}>Lose destination: </label>
                <select name="lose" value={lose} onChange={(e) => setLose(e.target.value)}>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.numero_section + ' | '}
                      {section.texte.length > 20
                        ? section.texte.slice(0, 20) + '...'
                        : section.texte}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {EditSection.type === 'termine' && (
            <div className={'end-content'}>
              <p>End of the book</p>
            </div>
          )}
        </div>
        <div className={'actions'}>
          <NavLink to={'/admin'} className={'btn cancel'}>
            <BaseButton text={'Cancel'} outlined={true} />
          </NavLink>
          <BaseButton text={'Save'} type={'submit'} />
        </div>
      </form>
    </div>
  );
}
