import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext.jsx';

export function CharacterSelection({ character }) {
  const { bookId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://193.168.146.103:3000'

  console.log(character);
  return (
    <div className="character-selection">
      <h1>Character Selection</h1>
      <p>Choose your character</p>
    </div>
  );
}