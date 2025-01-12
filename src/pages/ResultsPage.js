import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config'; // Importer l'URL de l'API

const ResultsPage = () => {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.get(`${API_URL}/surveys/results`); // Utilisation de l'API_URL
        const cleanedResults = response.data.map((result) => result._doc || result); // Nettoie les données
        setResults(cleanedResults);
      } catch (err) {
        console.error('Erreur lors de la récupération des résultats :', err);
        setError('Erreur lors de la récupération des résultats.');
      }
    };

    fetchResults();
  }, []);

  const goToEmailPage = () => {
    navigate('/email');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Résultats du vote</h1>
      {error && <p style={styles.errorText}>{error}</p>}
      {results.length > 0 ? (
        <div style={styles.resultsContainer}>
          {results.map((result, index) => (
            <div
              key={result._id}
              style={{
                ...styles.resultCard,
                borderLeft: index === 0 ? '4px solid #FFA500' : '4px solid #ccc',
              }}
            >
              <img
                src={result.imageUrl}
                alt={result.title}
                style={styles.image}
              />
              <div style={styles.resultContent}>
                <h2 style={styles.resultRank}>
                  {index === 0
                    ? 'Top 1'
                    : index === 1
                    ? 'Top 2'
                    : index === 2
                    ? 'Top 3'
                    : `Classement ${index + 1}`}
                </h2>
                <p style={styles.resultTitle}>{result.title}</p>
                <p style={styles.resultScore}>{result.score} points</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.noResultsText}>Aucun résultat disponible pour le moment.</p>
      )}
      <button style={styles.emailButton} onClick={goToEmailPage}>
        Participer au vote
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: '"Roboto", sans-serif',
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: '2.5rem',
    textAlign: 'center',
    color: '#444',
    marginBottom: '30px',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: '20px',
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  resultCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    borderRadius: '8px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
  },
  resultCardHover: {
    transform: 'translateY(-4px)',
  },
  image: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  resultContent: {
    flex: 1,
  },
  resultRank: {
    fontSize: '1.3rem',
    fontWeight: 'bold',
    marginBottom: '8px',
    color: '#222',
  },
  resultTitle: {
    fontSize: '1rem',
    marginBottom: '4px',
    color: '#555',
  },
  resultScore: {
    fontSize: '0.9rem',
    color: '#777',
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#888',
  },
  emailButton: {
    display: 'block',
    margin: '30px auto 0',
    padding: '12px 24px',
    backgroundColor: '#FFA500',
    color: '#fff',
    fontSize: '1.2rem',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    textAlign: 'center',
  },
  emailButtonHover: {
    backgroundColor: '#e69500',
  },
};

export default ResultsPage;