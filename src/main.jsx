import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { HashRouter as Router, Routes, Route } from "react-router-dom";
// import "@sweetalert2/theme-dark/dark.css";

// Pages
import Home from "./pages/Home";
import Auth from './pages/Auth';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="register" element={<Auth register />} />
          <Route path="login" element={<Auth />} />
        </Route>
      </Routes>
    </Router>
  </React.StrictMode>,
)
