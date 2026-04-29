import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Deploy from './pages/Deploy';
import Dashboard from './pages/Dashboard';
import Claim from './pages/Claim';

function App() {
  const [account, setAccount] = useState('');

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar setAccount={setAccount} />
        <main>
          <Routes>
            <Route path="/" element={<Home account={account} />} />
            <Route path="/deploy" element={<Deploy account={account} />} />
            <Route path="/dashboard" element={<Dashboard account={account} />} />
            <Route path="/claim" element={<Claim account={account} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
