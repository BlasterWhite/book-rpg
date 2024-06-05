import { useNavigate, useParams } from 'react-router-dom';
import { SectionView } from '@/pages/Section/SectionView.jsx';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { CharacterSelection } from '@/pages/Book/CharacterSelection.jsx';

export function SingleBook() {
  const { sectionId, bookId, characterId } = useParams();
  const navigate = useNavigate();

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  const { user } = useAuth();

  const [section, SetSection] = useState({});
  const [character, SetCharacter] = useState({});
  const [characterInitialized, SetCharacterInitialized] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/livres/${bookId}/sections/${sectionId}`, {
      headers: { Authorization: user.token }
    }).then((response) => response.json()
      .then((data) => SetSection(data)))
      .catch((error) => console.error(error));
  }, [bookId, sectionId, apiURL, user]);

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/personnages/${characterId}`, {
      headers: { Authorization: user.token }
    }).then((response) => response.json()
      .then((data) => SetCharacter(data)))
      .catch((error) => console.error(error));
  }, [characterId, apiURL, user]);

  useEffect(() => {
    if (character.initialized) {
      SetCharacterInitialized(true);
    }
  }, [character.initialized]);

  function renderSection() {
    if (section && section.id && character && character.id) {
      if (!characterInitialized) {
        return (
          <CharacterSelection character={character} updateCharacterHandler={() => SetCharacterInitialized(true)}/>
        );
      }
      return (
        <SectionView
          characterId={characterId}
          section={section}
          handleNextSection={handleSectionClicked}
        />
      );
    } else {
      return <div>Loading...</div>;
    }
  }

  const handleSectionClicked = (newSectionId) => {
    navigate(`/book/${bookId}/${characterId}/${newSectionId}`);
  };
  return <>{renderSection()}</>;
}
