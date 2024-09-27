import React, { useState, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  Container,
  InputAdornment,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import "./searchHeader.css";
import terms from "../../../final_cleaned_terms_only.json";
import { useNavigate, useLocation } from "react-router-dom";
import Searchbar from "../../Landing Page/Components/searchbar";
import axios from "axios";
const SearchHeader = ({ setSelectedArticles, setAnnotateData,setOpenAnnotate }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState(terms);
  const navigate = useNavigate();
  const location = useLocation();
  const [filtersToSend,setFiltersToSend]=useState([])
  useEffect(() => {
    if (location.pathname === "/search") {
      // Check if searchTerm is present in sessionStorage
      const storedSearchTerm = sessionStorage.getItem("SearchTerm");
      if (storedSearchTerm) {
        setSearchTerm(storedSearchTerm);
        handleInputChange(null, storedSearchTerm); // Populate suggestions based on the stored term
      }
    } else {
      // Clear session storage when not on the search page
      sessionStorage.removeItem("SearchTerm");
    }
  }, [location.pathname]);
  const handleInputChange = (event, value) => {
    setSearchTerm(value);

    // Filter results dynamically
    const results = terms.filter((term) =>
      term.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredResults(results);
  };
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleButtonClick();
    }
  };
  console.log(localStorage.getItem("filters"))
  const handleButtonClick = () => {
    setSelectedArticles([])
    setAnnotateData([])
    setOpenAnnotate(false)
    if (searchTerm) {
      setLoading(true);
      sessionStorage.setItem("SearchTerm", searchTerm);
      const timeoutId = setTimeout(() => {
        setLoading(false);
        navigate("/search", { state: { data: [], searchTerm } });
      }, 30000); // 30 seconds

      let filtersToSend = [];
    try {
      const storedFilters = localStorage.getItem("filters");
      
      if (storedFilters) {
        filtersToSend = JSON.parse(storedFilters); // Parse stored JSON
        console.log(filtersToSend)
      }
    } catch (error) {
      console.error("Error retrieving filters from local storage:", error);
      // Handle the error gracefully (e.g., display an error message to the user)
    }
      console.log(typeof(filtersToSend))
      const apiUrl =
        filtersToSend.articleType.length > 0
          ? "http://13.127.207.184:80/filter"
          : "http://13.127.207.184:80/query";
      console.log(apiUrl);
      const requestBody =
        filtersToSend.articleType.length > 0
          ? {
              query: searchTerm,
              filters: filtersToSend.articleType, // Send the filters if available
            }
          : {
              query: searchTerm, // Send only the query if filters are empty
            };
      console.log(requestBody);
      axios
        .post(apiUrl, requestBody)
        .then((response) => {
          console.log(response);
          //setIsChecked((prev) => !prev);
          //localStorage.setItem("checkboxState", JSON.stringify(!isChecked));
          const data = response.data; // Assuming the API response contains the necessary data
          setResults(data);
          // Navigate to SearchPage and pass data via state
          navigate("/search", { state: { data, searchTerm } });
          clearTimeout(timeoutId);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          clearTimeout(timeoutId);
          setLoading(false);
          navigate("/search", { state: { data: [], searchTerm } });
          console.error("Error fetching data from the API", error);
        });
    }
  };
  const [isSticky, setIsSticky] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    const offset = window.pageYOffset;
    if (offset > 100) { // Change 100 to whatever value fits your design
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);
const handleClear = () => {
  setSearchTerm(''); // Clear the input field
  setFilteredResults([]);
};
  return (
    <>
    
      <div className="Search-Nav">
        <div className="Search-Nav-Items">
          <a href="/">
            <img
            href="/"
              className="Search-nav-logo"
              src="https://www.infersol.com/wp-content/uploads/2020/02/logo.png"
              alt="Infer logo"
            ></img>
          </a>
          <section className="Search-nav-links">
            {/* <a className="Search-navlink" href="/">
              Home
            </a> */}
            {/* <a className="Search-navlink" href="">
              Why Infer?
            </a> */}
            {/* <a className="Search-navlink" href="">
              FAQs
            </a> */}
          </section>
          <section className="Search-nav-login">
            <button className="btn" id="search-signup-btn">
              Signup
            </button>
            <button className="btn" id="search-login-btn">
              Login
            </button>
          </section>
        </div>
      </div>
      <div className='searchbar-outer' style={{left:"0",border:"1px solid grey",margin:"0"}}>
        <Searchbar setSelectedArticles={setSelectedArticles}
        setAnnotateData={setAnnotateData}
        setOpenAnnotate={setOpenAnnotate} />
                {/* <Box id="LandinhHeader-searchbar-box" display="flex" justifyContent="center" width="100%">
                    <Autocomplete
                        freeSolo
                        options={filteredResults}
                        // open // Keeps the suggestions always visible
                        onInputChange={handleInputChange}
                        inputValue={searchTerm}
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
                                    onKeyDown={handleKeyDown}
                                    id="LandingHeader-custom-textfield"
                                    InputProps={{
                                        ...params.InputProps,
                                        className: 'custom-input',
                                        style: { padding: '8px 140px 8px 40px', borderRadius:"54px", background: "#fff",fontFamily: "Axiforma !important",
                                            fontSize: "16px !important",
                                            fontWeight: "500 !important" },
                                            endAdornment: (
                                              <InputAdornment position="end">
                                                  {searchTerm && (
                                                      <Button onClick={handleClear} >
                                                         Clear
                                                      </Button>
                                                  )}
                                                  <Button variant="contained" id="search-button" onClick={handleButtonClick} disabled={loading}>
                                                      {loading ? <CircularProgress color={"white"} size={24} /> : 'Search'}
                                                  </Button>
                                              </InputAdornment>
                                          ),
                                    }}
                                    InputLabelProps={{
                                        style: { left: '30px' },
                                    }}
                                    
                                />
                                <Button variant="contained" className="MuiButtonBase-root" id="search-button" onClick={handleButtonClick} style={{top:"11%"}} disabled={loading}>
                                {loading ? <CircularProgress color={"white"} size={24} /> : 'Search'}
                    </Button>

                                
                            </>
                        )}
                        className="autocomplete"
                    />
                                        
                </Box> */}
            </div>
      {/* <div className="searchHeader-container">
        <Box
          id="searchbar-box"
          display="flex"
          justifyContent="center"
          width="100%"
        >
          <Autocomplete
            freeSolo
            options={filteredResults}
            //open // Keeps the suggestions always visible
            onInputChange={handleInputChange}
            inputValue={searchTerm}
            renderInput={(params) => (
              <>
                <svg
                  className="fas fa-search searchHeader-searchicon"
                  width="21"
                  height="21"
                  viewBox="0 0 21 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="10.3054"
                    cy="10.3054"
                    r="7.49047"
                    stroke="#1A1A1A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.5151 15.9043L18.4518 18.8334"
                    stroke="#1A1A1A"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <TextField
                  {...params}
                  placeholder="Type to Search"
                  variant="outlined"
                  fullWidth
                  onKeyDown={handleKeyDown}
                  id="LandingHeader-custom-textfield"
                  InputProps={{
                    ...params.InputProps,
                    className: "custom-input",
                    style: {
                      padding: "8px 140px 8px 40px",
                      borderRadius: "54px",
                      background: "#fff",
                      fontFamily: "Manrope !important",
                      fontSize: "16px !important",
                      fontWeight: "500 !important",
                    },
                  }}
                  InputLabelProps={{
                    style: { left: "30px" },
                  }}
                />
                <Button
              variant="contained"
              className="MuiButtonBase-root"
              id="SearchHeader-search-button"
              onClick={handleButtonClick}
              disabled={loading}
              // style={{ marginBottom: "10px" }}
            >
              {loading ? <CircularProgress color={"white"} size={24} /> : 'Search'}
            </Button>
              </>
            )}
            className="searchHeader-autocomplete"
          />
          <div className="searchHeader-dropdown-div">
            
            
          </div>
        </Box>
      </div> */}
    </>
  );
};

export default SearchHeader;
