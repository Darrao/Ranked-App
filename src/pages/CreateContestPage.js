import React, { useState } from 'react';
import axios from 'axios';
import API_URL from '../config';

const CreateContestPage = () => {
  const [choices, setChoices] = useState([
    { title: '', author: '', description: '', images: [''] },
  ]);
  const [message, setMessage] = useState('');

  const baseUrl = `${API_URL}/uploads/`;

  const handleInputChange = (index, field, value) => {
    const updatedChoices = [...choices];
    updatedChoices[index][field] = value;
    setChoices(updatedChoices);
  };

  const handleImageChange = (choiceIndex, imageIndex, value) => {
    const updatedChoices = [...choices];
    const isFileName = !value.startsWith('http://') && !value.startsWith('https://');
    updatedChoices[choiceIndex].images[imageIndex] = isFileName ? `${baseUrl}${value}` : value;
    setChoices(updatedChoices);
  };

  const addImage = (choiceIndex) => {
    const updatedChoices = [...choices];
    updatedChoices[choiceIndex].images.push('');
    setChoices(updatedChoices);
  };

  const addChoice = () => {
    setChoices([...choices, { title: '', author: '', description: '', images: [''] }]);
  };

  const handleSubmit = async () => {
    const missingImages = choices.some(
      (choice) =>
        choice.images.length === 0 ||
        choice.images.some((img) => img.trim() === '')
    );
  
    if (missingImages) {
      setMessage('Tous les choix doivent avoir au moins une URL d\'image valide.');
      return;
    }
  
    console.log('Données envoyées au backend :', { choices });
  
    try {
      setMessage('');
      await axios.post(`${API_URL}/surveys/create`, { choices });
      setMessage('Concours créé avec succès !');
    } catch (err) {
      console.error('Erreur lors de la création du concours :', err);
      setMessage('Erreur lors de la création du concours.');
    }
  };

  return (
    <div>
      <h2>Créer un concours</h2>
      {choices.map((choice, choiceIndex) => (
        <div key={choiceIndex} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Choix {choiceIndex + 1}</h3>
          <input
            type="text"
            placeholder="Titre"
            value={choice.title}
            onChange={(e) => handleInputChange(choiceIndex, 'title', e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          />
          <input
            type="text"
            placeholder="Auteur"
            value={choice.author}
            onChange={(e) => handleInputChange(choiceIndex, 'author', e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          />
          <textarea
            placeholder="Description"
            value={choice.description}
            onChange={(e) => handleInputChange(choiceIndex, 'description', e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          ></textarea>
          <h4>Images (entrez un nom de fichier ou une URL complète)</h4>
          {choice.images.map((image, imageIndex) => (
            <div key={imageIndex} style={{ marginBottom: '10px' }}>
              <input
                type="text"
                placeholder={`Nom de fichier ou URL de l'image ${imageIndex + 1}`}
                value={image}
                onChange={(e) => handleImageChange(choiceIndex, imageIndex, e.target.value)}
                style={{ width: '90%', marginRight: '10px' }}
              />
              <button onClick={() => addImage(choiceIndex)} style={{ padding: '5px 10px' }}>
                Ajouter une image
              </button>
            </div>
          ))}
        </div>
      ))}
      <button onClick={addChoice} style={{ marginRight: '10px', padding: '10px 20px' }}>
        Ajouter un choix
      </button>
      <button onClick={handleSubmit} style={{ padding: '10px 20px' }}>
        Créer le concours
      </button>
      {message && <p style={{ marginTop: '20px', color: 'green' }}>{message}</p>}
    </div>
  );
};

export default CreateContestPage;