import React, { useState } from "react";
import axios from "axios";
import API_URL from "../config"; // Import de la configuration pour l'API_URL

const EmailPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    console.log("Tentative d'envoi de l'email :", email);
  
    try {
      const response = await axios.post(`${API_URL}/surveys/send-email`, { email });
      console.log("Réponse du backend :", response.data);
  
      setMessage(
        "Un email de vérification a été envoyé. Veuillez vérifier votre boîte de réception."
      );
      setError("");
    } catch (err) {
      console.error("Erreur lors de l'envoi de l'email :", err);
  
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message); // Afficher le message détaillé du backend
      } else {
        setError("Une erreur inattendue est survenue.");
      }
      setMessage("");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Participer au Vote</h1>
      <p style={styles.subtitle}>
        Entrez votre email pour recevoir un lien de vérification.
      </p>
      <div style={styles.formGroup}>
        <input
          type="email"
          placeholder="Votre email"
          value={email}
          onChange={(e) => {
            console.log("Changement de l'email :", e.target.value);
            setEmail(e.target.value);
          }}
          style={styles.input}
        />
        <button
          onClick={() => {
            console.log("Bouton 'Valider' cliqué.");
            handleSubmit();
          }}
          style={{
            ...styles.submitButton,
            ...(email.trim() ? {} : styles.submitButtonDisabled),
          }}
          disabled={!email.trim()}
        >
          Valider
        </button>
      </div>
      {error && <p style={styles.errorText}>{error}</p>}
      {message && <p style={styles.successText}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    fontFamily: "'Roboto', sans-serif",
    color: "#333",
  },
  header: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#444",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#666",
    marginBottom: "20px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "15px",
  },
  input: {
    width: "100%",
    padding: "12px",
    fontSize: "1rem",
    border: "1px solid #ddd",
    borderRadius: "5px",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  submitButton: {
    padding: "12px 20px",
    fontSize: "1rem",
    backgroundColor: "#FFA500",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
  },
  submitButtonDisabled: {
    backgroundColor: "#d3d3d3",
    color: "#999",
    cursor: "not-allowed",
  },
  errorText: {
    color: "red",
    fontSize: "0.9rem",
    marginTop: "10px",
  },
  successText: {
    color: "green",
    fontSize: "0.9rem",
    marginTop: "10px",
  },
};

export default EmailPage;