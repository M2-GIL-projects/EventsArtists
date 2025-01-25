
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import EventsList from "./pages/EventsList";
//import EventDetails from "./pages/EventDetails";
//import ArtistsList from "./pages/ArtistsList";
//import ArtistDetails from "./pages/ArtistDetails";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/events" element={<EventsList />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

