import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import RepoDetails from "./pages/RepoDetails";
import QAPage from "./pages/QAPage"; // Import the new QAPage

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/analyze" element={<Analyze />} />
        {/* Existing Repo Details route */}
        <Route path="/repo/:id" element={<RepoDetails />} /> 
        {/* New Q&A route */}
        <Route path="/repo/:id/qa" element={<QAPage />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;