import React,{useState,useEffect} from 'react'
import "./LandingHeader.css"
import { Autocomplete, TextField, Container, Box, Button, CircularProgress } from '@mui/material';
import terms from '../../../final_cleaned_terms_only.json';
import { useNavigate ,useLocation} from 'react-router-dom';
import axios from 'axios';
// import LandingHeaderImage from "../../../images/image (1).svg";

const LandingHeader = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState(terms);
  const navigate = useNavigate();
  const location = useLocation();
  // useEffect(() => {
  //   if (location.pathname === "/search") {
  //     // Check if searchTerm is present in sessionStorage
  //     const storedSearchTerm = sessionStorage.getItem('SearchTerm');
  //     if (storedSearchTerm) {
  //       setSearchTerm(storedSearchTerm);
  //       handleSearch(null, storedSearchTerm); // Populate suggestions based on the stored term
  //     }
  //   } else {
  //     // Clear session storage when not on the search page
  //     sessionStorage.removeItem('SearchTerm');
  //   }
  // }, [location.pathname]);
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
          console.log(response.data.Articles)
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
    <Container maxWidth="xl" id='Header-Nav-Container'>
      {/* <img src={LandingHeaderImage} alt='logo'></img> */}
      <div className='Header-Nav'>
        <div className='Header-Nav-Items'>
            <img className="nav-logo" src='https://www.infersol.com/wp-content/uploads/2020/02/logo.png' alt="Infer logo"></img>
            <section className='nav-links'>
              <a className={`navlink ${location.pathname === '/' ? 'active' : ''}`} href="#">Home</a>
              <a className="navlink" href="#WhyInfer">Why Infer?</a>
              <a className="navlink" href="#FAQ">FAQs</a>
            </section>
            <section className='nav-login'>
              <button className='btn' id='signup-btn'>Signup</button>
              <button className='btn' id='login-btn'>Login</button>
            </section>
        </div>
      </div>
      <div className='Header-Nav-Content'>
            <div className='searchbar-divHeader'>
              <h3 className='searchbar-header'>Welcome to Infer</h3>
            </div>
            <div className='searchbar-outer'>
                <Box id="LandinhHeader-searchbar-box" display="flex" justifyContent="center" width="100%">
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
                                    }}
                                    InputLabelProps={{
                                        style: { left: '30px' },
                                    }}
                                />
                                <Button variant="contained" className="MuiButtonBase-root" id="search-button" onClick={handleButtonClick} disabled={loading}>
                                {loading ? <CircularProgress background={"white"} size={24} /> : 'Search'}
                    </Button>

                                
                            </>
                        )}
                        className="autocomplete"
                    />
                                        
                </Box>
            </div>
        </div>
    </Container>
  )
}

export default LandingHeader