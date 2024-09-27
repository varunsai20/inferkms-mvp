import React,{useState,useEffect} from 'react'
import { Autocomplete, TextField, Container, Box, Button, CircularProgress,InputAdornment } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import terms from '../../../final_cleaned_terms_only.json';
import "./LandingHeader.css"
const Searchbar = ({setSelectedArticles, setAnnotateData,setOpenAnnotate }) => {
    const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location=useLocation();
  const [filteredResults, setFilteredResults] = useState([]);
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
      const handleClear = () => {
        setSearchTerm(''); // Clear the input field
        setFilteredResults([]);
      };
      const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          handleButtonClick();
        }
      };
    
      const handleButtonClick = () => {
        if (location.pathname === '/search') {
          setSelectedArticles([]);
          setAnnotateData([]);
          setOpenAnnotate(false);
      }
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
                        style: { padding: '8px 100px 8px 40px', borderRadius:"54px", background: "#fff",fontFamily: "Axiforma !important",
                            fontSize: "16px !important",
                            fontWeight: "500 !important" },
                            endAdornment: (
                              <InputAdornment position="end">
                                    {searchTerm && (
                                        <span onClick={handleClear} style={{fontWeight:600,cursor:"pointer"}}>
                                          <svg style={{width:"20px",height:"20px",display:"block",cursor:"pointer"}}focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                                        </span>
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
                    <Button variant="contained" className="MuiButtonBase-root" id="search-button" onClick={handleButtonClick} disabled={loading}>
                      {loading ? <CircularProgress color={"white"} size={24} /> : 'Search'}
                    </Button>
                  </>
                )}
                className="autocomplete"
              />
            </Box>
  )
}

export default Searchbar
