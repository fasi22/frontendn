import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ButcherPage from './components/ButcherPage';
import Adminpage from './components/Adminpage';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
        <Routes>
          <Route path="/" element={<ButcherPage />} />
          <Route path="/admin" element={<Adminpage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
