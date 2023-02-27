import React from 'react';
import './App.css';
import Main from './component/Main'
import Login from './page/Login'
import Register from './page/Register'

import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="/" element={<Main/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
