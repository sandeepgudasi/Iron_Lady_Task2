import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProgramDashboard from './pages/ProgramDashboard';

import ApplicationReview from './pages/ApplicationReview';
import Simulator from './pages/Simulator';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="min-h-screen text-gray-100 font-sans selection:bg-yellow-500/30">
        <Header />
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<ProgramDashboard />} />
            <Route path="/program/:programId" element={<ApplicationReview />} />
            <Route path="/program/:programId/simulator" element={<Simulator />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
