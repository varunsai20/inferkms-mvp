import React, { useState, useEffect } from 'react';
import "./LandingHeader.css";
import { Autocomplete, TextField, Container, Box, Button, CircularProgress } from '@mui/material';
import terms from '../../../final_cleaned_terms_only.json';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Left1 from "../../../images/Left1.svg";
import Left2 from "../../../images/Left2.svg";
import Right1 from "../../../images/Right1.svg";
import Right2 from "../../../images/Right2.svg";

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

  const handleInputChange = (event, value) => {
    // Only show suggestions when input has 3 or more characters
    if (value.length >= 3) {
      const results = terms.filter((term) =>
        term.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredResults(results);
    } else {
      setFilteredResults([]); // Clear suggestions if less than 3 characters
    }
    // Keep updating the searchTerm as the user types
    setSearchTerm(value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleButtonClick();
    }
  };

  const handleButtonClick = () => {
    if (searchTerm) {
      setLoading(true);
      // sessionStorage.setItem("SearchTerm", searchTerm); // Save search term to sessionStorage
      const timeoutId = setTimeout(() => {
        setLoading(false);
        navigate('/search', { state: { data: [], searchTerm } });
      }, 30000); // 30 seconds

      axios
        .post('http://13.127.207.184:80/query', { query: searchTerm })
        .then((response) => {
          console.log(response);
          // sessionStorage.setItem("SearchTerm", searchTerm); // Update sessionStorage after the response
          const data = response.data; // Assuming the API response contains a 'results' array
          setResults(data);
          navigate('/search', { state: { data, searchTerm } });
          clearTimeout(timeoutId);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          clearTimeout(timeoutId);
          setLoading(false);
          navigate('/search', { state: { data: [], searchTerm } });
          console.error('Error fetching data from the API', error);
        });
    }
  };

  const handleOptionSelect = (event, value) => {
    if (value) {
      setSearchTerm(value); // Set selected option as the search term
      sessionStorage.setItem("SearchTerm", value); // Save selected term in sessionStorage
      handleButtonClick(); // Trigger the search after selection
    }
  };

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
            <Box id="LandinhHeader-searchbar-box" display="flex" justifyContent="center" width="100%">
              <Autocomplete
                freeSolo
                options={filteredResults} // Show filtered suggestions
                onInputChange={handleInputChange} // Update input value dynamically as the user types
                onChange={handleOptionSelect} // Handle option select (set selected option as search term)
                inputValue={searchTerm} // Reflect the search term (typed or selected)
                renderInput={(params) => (
                  <>
                    <svg className="fas fa-search icon" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="10.3054" cy="10.3054" r="7.49047" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15.5151 15.9043L18.4518 18.8334" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <TextField
                      {...params}
                      placeholder="Type to Search"
                      variant="outlined"
                      fullWidth
                      onKeyDown={handleKeyDown} // Handle Enter key press inside the text field
                      id="LandingHeader-custom-textfield"
                      InputProps={{
                        ...params.InputProps,
                        className: 'custom-input',
                        style: {
                          padding: '8px 140px 8px 40px',
                          borderRadius: "54px",
                          background: "#fff",
                          fontFamily: "Axiforma !important",
                          fontSize: "16px !important",
                          fontWeight: "500 !important"
                        },
                      }}
                      InputLabelProps={{
                        style: { left: '30px' },
                      }}
                    />
                    <Button variant="contained" className="MuiButtonBase-root" id="search-button" onClick={handleButtonClick} disabled={loading}>
                      {loading ? <CircularProgress color={"white"} size={24} /> : 'Search'}
                    </Button>
                  </>
                )}
                className="autocomplete"
              />
            </Box>
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
