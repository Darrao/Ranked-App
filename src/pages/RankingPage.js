import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config'; // Importer l'URL de l'API

const RankingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token');
  console.log('Token récupéré depuis l’URL :', token);
  const [options, setOptions] = useState([]);
  const [selectedRankings, setSelectedRankings] = useState({ Top1: null, Top2: null, Top3: null });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    if (!token) {
      alert('Lien de vote invalide.');
      navigate('/');
      return;
    }

    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${API_URL}surveys`); // Utilisation de l'API_URL
        setOptions(response.data.options);
      } catch (err) {
        setError('Erreur lors de la récupération des options.');
      }
    };

    fetchOptions();
  }, [token, navigate]);

  const handleSelection = (ranking, choiceId) => {
    setSelectedRankings((prev) => {
      const updatedRankings = { ...prev };
  
      // Vérifier si le choix est déjà assigné à un autre rang et le déplacer
      const existingRank = Object.keys(updatedRankings).find((key) => updatedRankings[key] === choiceId);
  
      if (existingRank) {
        updatedRankings[existingRank] = null; // Libérer l'ancien rang
      }
  
      // Assigner le choix au nouveau rang
      updatedRankings[ranking] = choiceId;
  
      return updatedRankings;
    });
  
    setError(''); // Réinitialiser les erreurs
  };
  
  const isSubmitDisabled = Object.values(selectedRankings).includes(null);

  const handleSubmit = async () => {
    const rankings = Object.entries(selectedRankings).map(([ranking, choiceId]) => ({
      choiceId,
      ranking: parseInt(ranking.replace('Top', ''), 10),
    }));

    try {
      await axios.post(`${API_URL}/surveys/vote`, { token, rankings }); // Utilisation de l'API_URL
      console.log('Données envoyées au backend :', { token, rankings });
      setMessage('Vote enregistré avec succès !');
      setTimeout(() => navigate('/results'), 1000);
    } catch (err) {
      setError('Une erreur est survenue lors de l\'enregistrement des votes.');
    }
  };

  const openFullscreen = (image) => {
    setFullscreenImage(image);
  };

  const closeFullscreen = () => {
    setFullscreenImage(null);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Choisissez votre top miel</h1>
      {fullscreenImage && (
        <div style={styles.fullscreenOverlay} onClick={closeFullscreen}>
          <img src={fullscreenImage} alt="Fullscreen" style={styles.fullscreenImage} />
        </div>
      )}
      {options.length > 0 ? (
        options.map((opt) => (
          <div key={opt._id} style={styles.optionContainer}>
            <h2 style={styles.optionTitle}>{opt.title}</h2>
            <p style={styles.optionAuthor}>Auteur : {opt.author}</p>
            {opt.description && <p style={styles.optionDescription}>{opt.description}</p>}
            <div style={styles.imagesContainer}>
              {opt.images?.length > 0 ? (
                opt.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1} de ${opt.title}`}
                    style={styles.image}
                    onClick={() => openFullscreen(image)}
                  />
                ))
              ) : (
                <p style={styles.noImage}>Aucune image disponible</p>
              )}
            </div>
            <div style={styles.buttonGroup}>
              {[1, 2, 3].map((rank) => (
                <button
                  key={rank}
                  style={{
                    ...styles.voteButton,
                    backgroundColor: selectedRankings[`Top${rank}`] === opt._id ? '#FFA500' : '#d3d3d3',
                    color: selectedRankings[`Top${rank}`] ? '#fff' : '#000',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleSelection(`Top${rank}`, opt._id)}
                >
                  {`Top ${rank}`}
                </button>
              ))}
            </div>
          </div>
        ))
      ) : (
        <p style={styles.loadingText}>Chargement des options...</p>
      )}
      {error && <p style={styles.errorText}>{error}</p>}
      {message && <p style={styles.successText}>{message}</p>}
      <button
        style={{
          ...styles.submitButton,
          backgroundColor: isSubmitDisabled ? '#d3d3d3' : '#FFA500',
          color: isSubmitDisabled ? '#999' : '#fff',
          cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
        }}
        onClick={handleSubmit}
        disabled={isSubmitDisabled}
      >
        Valider
      </button>
    </div>
  );
};

const styles = {
    container: {
      width: '100%',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      backgroundColor: '#f8f9fa',
      position: 'relative',
      overflow: 'hidden',
    },
    header: {
      fontSize: '2.5rem',
      color: '#444',
      textAlign: 'center',
      marginBottom: '30px',
    },
    optionContainer: {
      marginBottom: '40px',
      textAlign: 'center',
      padding: '20px',
      backgroundColor: '#fff',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
      maxWidth: '800px',
      margin: '0 auto',
    },
    imagesContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '15px',
      marginBottom: '20px',
      flexWrap: 'wrap',
    },
    image: {
      width: '30%',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '8px',
      border: '1px solid #ddd',
      cursor: 'pointer',
      transition: 'transform 0.3s ease',
    },
    fullscreenOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    fullscreenImage: {
      maxWidth: '90%',
      maxHeight: '90%',
      borderRadius: '10px',
      boxShadow: '0 4px 10px rgba(255, 255, 255, 0.5)',
    },
    optionTitle: {
      fontSize: '1.8rem',
      color: '#222',
      marginBottom: '10px',
    },
    optionAuthor: {
      fontSize: '1rem',
      color: '#666',
      marginBottom: '10px',
    },
    optionDescription: {
      fontSize: '1rem',
      color: '#444',
      marginBottom: '20px',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '10px',
    },
    voteButton: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
    },
    submitButton: {
      display: 'block',
      margin: '20px auto',
      padding: '15px 30px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    voteButtonSelected: {
      backgroundColor: '#ff8500', // Couleur légèrement plus foncée pour indiquer la sélection
      color: '#fff',
      border: 'none',
    },
    loadingText: {
      textAlign: 'center',
      color: '#888',
      fontSize: '1.5rem',
    },
    errorText: {
      color: 'red',
      textAlign: 'center',
      marginTop: '10px',
    },
    successText: {
      color: 'green',
      textAlign: 'center',
      marginTop: '10px',
    },
  };
  
  export default RankingPage;