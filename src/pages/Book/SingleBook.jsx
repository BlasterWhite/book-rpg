import { useNavigate, useParams } from 'react-router-dom';
import { SectionView } from '@/pages/Section/SectionView.jsx';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/composants/AuthContext/AuthContext.jsx';

export function SingleBook() {
  const { sectionId, bookId, characterId } = useParams();
  const navigate = useNavigate();

  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  const { user } = useContext(AuthContext);

  const [section, SetSection] = useState({});

  useEffect(() => {
    if (!user) return;
    fetch(`${apiURL}/livres/${bookId}/sections/${sectionId}`, {
      headers: { Authorization: user.token }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          SetSection(data);
        });
      } else {
        console.error('Error fetching sections');
      }
    });
  }, [bookId, sectionId, apiURL, user]);

  function renderSection() {
    if (section && section.id) {
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

  return (
    <>
      {section.type}
      {renderSection()}
    </>
  );
}
