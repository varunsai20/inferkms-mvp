import React,{useState,useEffect} from 'react'
import { Autocomplete, TextField, Container, Box, Button, CircularProgress } from '@mui/material';
import "./searchHeader.css"
import terms from "../../../final_cleaned_terms_only.json"
import { useNavigate ,useLocation} from 'react-router-dom';
import axios from "axios"
const SearchHeader = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState(terms);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === "/search") {
      // Check if searchTerm is present in sessionStorage
      const storedSearchTerm = sessionStorage.getItem('SearchTerm');
      if (storedSearchTerm) {
        setSearchTerm(storedSearchTerm);
        handleInputChange(null, storedSearchTerm); // Populate suggestions based on the stored term
      }
    } else {
      // Clear session storage when not on the search page
      sessionStorage.removeItem('SearchTerm');
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
    if (event.key === 'Enter') {
      handleButtonClick();
    }
  };
  const handleButtonClick = () => {
    if (searchTerm) {
      setLoading(true);
      sessionStorage.setItem("SearchTerm", searchTerm);
      const timeoutId = setTimeout(() => {
        setLoading(false);
        navigate('/search', { state: { data: [], searchTerm } });
      }, 30000); // 30 seconds      
      axios
        .post('http://13.127.207.184:80/query',{query:searchTerm})
        .then((response) => {
          console.log(response)
          console.log(response.data.articles)
          sessionStorage.setItem("SearchTerm", searchTerm);
          const data = response.data; // Assuming the API response contains a 'results' array
          setResults(data);
          // Navigate to SearchPage and pass data via state
          navigate('/search', { state: { data, searchTerm } });
          clearTimeout(timeoutId);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error)
          clearTimeout(timeoutId);
          setLoading(false);
          navigate('/search', { state: { data: [], searchTerm } });
          console.error('Error fetching data from the API', error);
        });
    }
  };
  return (

    <>
    
      <div className='Search-Nav'>
        <div className='Search-Nav-Items'>
            <a href="/" ><img className="Search-nav-logo" src='https://www.infersol.com/wp-content/uploads/2020/02/logo.png' alt="Infer logo"></img></a>
            <section className='Search-nav-links'>
              <a className="Search-navlink" href="/">Home</a>
              <a className="Search-navlink" href="">Why Infer?</a>
              <a className="Search-navlink" href="">FAQs</a>
            </section>
            <section className='Search-nav-login'>
              <button className='btn' id='search-signup-btn'>Signup</button>
              <button className='btn' id='search-login-btn'>Login</button>
            </section>
        </div>
      </div>
      <div className='searchHeader-container'>
        <Box id="searchbar-box" display="flex" justifyContent="center" width="100%">        
        <Autocomplete
                        freeSolo
                        options={filteredResults}
                        //open // Keeps the suggestions always visible
                        onInputChange={handleInputChange}
                        inputValue={searchTerm}
                        renderInput={(params) => (
                            <>
                                <svg className="fas fa-search searchHeader-searchicon" width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                        style: { padding: '8px 140px 8px 40px', borderRadius:"54px", background: "#fff",fontFamily: "Manrope !important",
                                            fontSize: "16px !important",
                                            fontWeight: "500 !important" },
                                    }}
                                    InputLabelProps={{
                                        style: { left: '30px' },
                                    }}
                                />
                                

                                
                            </>
                        )}
                        className="searchHeader-autocomplete"
                        
                    />
                    <div className='searchHeader-dropdown-div'>
                    {loading ? <>
                                  
                                  <CircularProgress className="searchLoader" color="secondary" background={"white"} size={24}/> 
                               </> : <>
                               <select id="cars" className="searchHeader-dropdown" name="cars">
                               <option value="volvo">BestSearch</option>
                              <option value="saab">Abstarct</option>
                               <option value="mercedes">Articles</option>
                              <option value="audi">Books</option>
                                  </select> 
                                      </>}        
                    </div>
                             
                      
        </Box>
      </div>
      </>

  )
}

export default SearchHeader