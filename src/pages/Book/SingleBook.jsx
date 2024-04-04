import { useNavigate, useParams } from 'react-router-dom';
import { SectionView } from '@/pages/Section/SectionView.jsx';
import { useEffect, useState } from 'react';

export function SingleBook() {
  const { sectionId, bookId } = useParams();
  const navigate = useNavigate();

  const token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsImVtYWlsIjoidGVzdC50ZXN0QGdtYWlsLmNvbSIsImlhdCI6MTcxMjIyMjA5MCwiZXhwIjoxNzEyMzA4NDkwfQ.Pde893oQq8kHp7BsGYAkD5Vfl07iDyDGUENp2u7vRyE';
  const apiURL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000';

  const [section, SetSection] = useState({});

  useEffect(() => {
    fetch(`${apiURL}/livres/${bookId}/sections/${sectionId}`, {
      headers: { Authorization: token }
    }).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          SetSection(data);
        });
      } else {
        console.error('Error fetching sections');
      }
    });
  }, [bookId, sectionId, apiURL]);

  function renderSection() {
    if (section && section.id) {
      return <SectionView section={section} handleSectionClicked={handleSectionClicked} />;
    } else {
      return <div>Loading...</div>;
    }
  }

  const handleSectionClicked = (newSectionId) => {
    navigate(`/book/${bookId}/section/${newSectionId}`);
  };

  return (
    <>
      {section.type}
      {renderSection()}
    </>
  );
}
