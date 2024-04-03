import './AdminSectionEditView.scss';
import { NavLink, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function AdminSectionEditView() {
  const { bookId, sectionId } = useParams();

  const [sections, setSections] = useState([]);

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  useEffect(() => {
    fetch(`${apiURL}/livres/${bookId}/sections`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setSections(data.filter((section) => section.id !== sectionId));
        });
      } else {
        console.error('Error fetching sections');
      }
    });
  }, [bookId, apiURL]);

  const [EditSection, setEditSection] = useState({});

  useEffect(() => {
    fetch(`${apiURL}/livres/${bookId}/sections/${sectionId}`).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          setEditSection(data);
          setSolution(data.resultat.condition);
          if (data.type === 'enigme' || data.type === 'combat') {
            setWin(data.resultat.gagne);
            setLose(data.resultat.perd);
          }
        });
      } else {
        console.error('Error fetching sections');
      }
    });
  }, [bookId, sectionId, apiURL]);

  function editSection(e) {
    setEditSection((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function editSectionInSections(e) {
    console.log(e.target.name, e.target.value);
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
  const [loseDice, setLoseDice] = useState([
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12'
  ]);

  function handleDiceChange(e) {
    if (e.target.checked) {
      setWinDice([...winDice, e.target.name]);
      setLoseDice(loseDice.filter((dice) => dice !== e.target.name));
    } else {
      setWinDice(winDice.filter((dice) => dice !== e.target.name));
      setLoseDice([...loseDice, e.target.name]);
    }
  }

  const dicesInputs = () => {
    const inputs = [];
    for (let i = 1; i <= 12; i++) {
      inputs.push(
        <div key={i}>
          <label htmlFor={`dice-${i}`}>{i}: </label>
          <input type="checkbox" name={i} onChange={handleDiceChange} />
        </div>
      );
    }
    return inputs;
  };

  const [solution, setSolution] = useState('');
  const [win, setWin] = useState('');
  const [lose, setLose] = useState('');

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
      delete section.sections;
      section.numero_section = EditSection.numero_section;
      section.texte = EditSection.texte;
      section.type = EditSection.type;
      section.id_image = EditSection.id_image;
      console.log(section);
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

      updateSection(section);
    }
  }

  function updateSection(section) {
    fetch(`${apiURL}/livres/${bookId}/sections/${sectionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(section)
    }).then((response) => {
      if (response.ok) {
        console.log('Section updated');
        // navigate('/admin');
      } else {
        console.error('Error updating section');
      }
    });
  }

  return (
    <div className={'admin-section-edit-view'}>
      <h1 className={'title'}>Admin</h1>
      <NavLink to={`/admin/${bookId}/section`}>← Back</NavLink>
      <form onSubmit={handleSubmit}>
        <label htmlFor={'texte'}>Text: </label>
        <textarea name="texte" value={EditSection.texte} onChange={editSection} />
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
                <select name="destination">
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.texte.length > 20
                        ? section.texte.slice(0, 20) + '...'
                        : section.texte}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor={'destination'}>Lose destination: </label>
                <select name="destination">
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
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
                <label htmlFor={'skill'}>Skill: </label>
                <select name="skill">
                  <option value="force">Force</option>
                  <option value="dexerite">Dexerite</option>
                  <option value="endurance">Endurance</option>
                  <option value="psychisme">Psychisme</option>
                  <option value="resistance">Resistance</option>
                </select>
              </div>
              <div>
                <label htmlFor={'difficulty'}>Level: </label>
                <input type="number" name="difficulty" />
              </div>
              <div>
                <label htmlFor={'win'}>Win destination: </label>
                <select name="win">
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
                <select name="lose">
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
            <button className={'btn cancel'}>Cancel</button>
          </NavLink>
          <button className={'btn save'} type="submit">
            Save
          </button>
        </div>
      </form>
      <pre>{JSON.stringify(EditSection, null, 2)}</pre>
    </div>
  );
}
