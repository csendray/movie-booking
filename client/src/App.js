import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/home";
import Details from "./screens/details";
import BookShow from "./screens/BookShow";
import Confirmation from "./screens/confirm";

const App = () => {
  const baseUrl = "http://localhost:8085/api/";

  return (
    <Router>
      <div className="main-container">
        <Routes>
          <Route exact path="/" element={<Home baseUrl={baseUrl} />} />
          <Route path="/movie/:id" element={<Details baseUrl={baseUrl} />} />
          <Route
            path="/bookshow/:id"
            element={<BookShow baseUrl={baseUrl} />}
          />
          <Route
            path="/confirm/:id"
            element={<Confirmation baseUrl={baseUrl} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
