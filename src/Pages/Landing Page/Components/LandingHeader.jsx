import React, { useState, useEffect } from 'react';
import "./LandingHeader.css";
import { Autocomplete, TextField, Container, Box, Button, CircularProgress,InputAdornment } from '@mui/material';
import terms from '../../../final_cleaned_terms_only.json';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Left1 from "../../../images/Left1.svg";
import Left2 from "../../../images/Left2.svg";
import Right1 from "../../../images/Right1.svg";
import Right2 from "../../../images/Right2.svg";
import Searchbar from './searchbar';
const LandingHeader = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    localStorage.removeItem("filters");
    localStorage.removeItem("history");
  }, []);

  

  return (
    <>
      <Container maxWidth="xl" id="Header-Nav-Container">
        <div className="Header-Nav">
          <div className="Header-Nav-Items">
            <img
              className="nav-logo"
              href="/"
              style={{ cursor: "pointer" }}
              src="https://www.infersol.com/wp-content/uploads/2020/02/logo.png"
              alt="Infer logo"
            ></img>
            <section className="nav-login">
              <button className="btn" id="signup-btn">Signup</button>
              <button className="btn" id="login-btn">Login</button>
            </section>
          </div>
        </div>
        <div className="Header-Nav-Content">
          
          <div className="searchbar-outer">
            <Searchbar/>
          </div>
        </div>
      </Container>
      <img className="left1" src={Left1} />
      <img className="left2" src={Left2} />
      <img className="right1" src={Right1} />
      <img className="right2" src={Right2} />
    </>
  );
};

export default LandingHeader;
