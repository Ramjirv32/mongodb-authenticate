import React from 'react';
import Sign from "./com/sign";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './com/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Sign />} />
        <Route path="/Home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
