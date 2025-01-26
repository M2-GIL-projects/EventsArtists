
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import EventsList from "./pages/EventsList";
import ArtistsList from "./pages/ArtistsList"; 
import ArtistDetailPage from "./pages/ArtistDetailPage";
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/events" element={<EventsList />} />
          <Route path="/artists" element={<ArtistsList />} /> 
          <Route path="/artists/:id" element={<ArtistDetailPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
