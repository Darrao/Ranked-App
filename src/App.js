import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import EmailPage from "./pages/EmailPage";
import RankingPage from "./pages/RankingPage";
import ResultsPage from "./pages/ResultsPage";
import CreateContestPage from './pages/CreateContestPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/email" element={<EmailPage />} />
        <Route path="/vote" element={<RankingPage />} />
        <Route path="/" element={<ResultsPage />} />
        <Route path="/CreateContestPage" element={<CreateContestPage />} />
        <Route path="*" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
}

export default App;