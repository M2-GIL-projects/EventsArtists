// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EventsList from './pages/EventsList';
//import EventDetails from './pages/EventDetails';
//import ArtistsList from './pages/ArtistsList';
//import ArtistDetails from './pages/ArtistDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/events" element={<EventsList />} />
      </Routes>
    </Router>
  );
}

export default App;
