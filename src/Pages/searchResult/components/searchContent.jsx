import React, { useEffect, useRef, useState } from 'react';
import "./searchContent.css";
import { Container, Button } from '@mui/material';
import { Dialog, Checkbox, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import FilterPopup from './FilterPopup';
import annotate from "../../../images/Annotate.svg"
import notesicon from "../../../images/Notes.svg"
import axios from "axios";  
const ITEMS_PER_PAGE = 5;

const SearchContent = ({ open, onClose, applyFilters }) => {
  const location = useLocation(); // Access the passed state
  const { data } = location.state || { data: [] };
  const searchTerm = location.state?.searchTerm || '';
  const navigate = useNavigate();
  const contentRightRef = useRef(null); // Ref for searchContent-right
  const [result,setResults]=useState()
  const [loading,setLoading]=useState()
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    textAvailability: '',
    articleType: [],
    publicationDate: '',
  });
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showTextAvailability, setShowTextAvailability] = useState(true);
  const [showArticleType, setShowArticleType] = useState(true);
  const [showPublicationDate, setShowPublicationDate] = useState(true);
  const [openAnnotate, setOpenAnnotate] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const handleAnnotate = () => {
    if (openAnnotate) {
      setOpenAnnotate(false);
    } else {
      setOpenAnnotate(true);
      setOpenNotes(false);
    }
  };
  const handleNotes = () => {
    if (openNotes) {
      setOpenNotes(false);
    } else {
      setOpenAnnotate(false);
      setOpenNotes(true);
    }
  };

  const toggleFilterPopup = () => {
    setShowFilterPopup(!showFilterPopup);
  };

  console.log(filters)
  const handleFilterChange = async (event) => {
    const { value, checked } = event.target;

    const updatedFilters = {
        ...filters,
        articleType: checked
            ? [...filters.articleType, value]
            : filters.articleType.filter((type) => type !== value),
    };

    setFilters(updatedFilters);

    // Making API request with the updated filters and search term when a filter changes
    handleButtonClick(updatedFilters);
};

const handleButtonClick = (updatedFilters) => {
  if (searchTerm) {
      setLoading(true);
      sessionStorage.setItem("SearchTerm", searchTerm);

      const timeoutId = setTimeout(() => {
          setLoading(false);
          navigate('/search', { state: { data: [], searchTerm } });
      }, 30000); // 30 seconds

      const filtersToSend = updatedFilters.articleType;

      // Check the length of filtersToSend
      const apiUrl = filtersToSend.length > 0 
          ? 'http://13.127.207.184:80/filter' 
          : 'http://13.127.207.184:80/query';
      console.log(apiUrl)
      const requestBody = filtersToSend.length > 0
          ? {
              query: searchTerm,
              filters: filtersToSend, // Send the filters if available
            }
          : {
              query: searchTerm // Send only the query if filters are empty
            };
      console.log(requestBody)
      axios
          .post(apiUrl, requestBody)
          .then((response) => {
              console.log(response);
              const data = response.data; // Assuming the API response contains the necessary data
              setResults(data);
              // Navigate to SearchPage and pass data via state
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


    
  const handleApplyFilters = () => {
    applyFilters(filters);
    setShowFilterPopup(false);
  };

  useEffect(() => {
    // Clear session storage for chatHistory when the location changes
    sessionStorage.removeItem('chatHistory');
  }, [location]);

  useEffect(() => {
    // Scroll to the top of the searchContent-right container when the page changes
    if (contentRightRef.current) {
      contentRightRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentPage]);

  // Function to italicize the search term in the text
  const italicizeTerm = (text) => {
    if (!text) return '';
    if (!searchTerm) return String(text);
  
    // Convert text to a string before using split
    const textString = String(text);
    const regex = new RegExp(`(${searchTerm})`, 'gi');
  
    return textString.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <i key={index} className="italic" style={{ color: 'primary', display: 'inline-flex' }}>
          {part}
        </i>
      ) : (
        part
      )
    );
  };
  

  const handleNavigate = (pmid) => {
    navigate(`/article/${pmid}`, { state: { data: data, searchTerm } });
  };
  // Calculate the index range for articles to display
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedArticles = data.articles.slice(startIndex, endIndex);
  console.log(paginatedArticles )
  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };
  useEffect(() => {
    // Reset currentPage to 1 whenever new search results are loaded
    setCurrentPage(1);
  }, [data.articles]);

  // Calculate total pages
  const totalPages = Math.ceil(data.articles.length / ITEMS_PER_PAGE);
  console.log(data)
  return (
    <>
    <Container maxWidth="xl" id='Search-Content-ContainerBox'>
        <div id='Search-Content-Container'>
        <div className='searchContent-left'>
          <div className='searchContent-left-header'>
              <h3 className="title">Filters</h3>
              <a className='Filters-ResetAll'>Reset All</a>
          </div>
            
          <div className="searchfilter-options">
        {/* Text availability section */}
        <div className="searchfilter-section">
          <h5 onClick={() => setShowTextAvailability(!showTextAvailability)}>
            <span>Text availability</span> <span>{showTextAvailability ? "▲" : "▼"}</span>
          </h5>
          {showTextAvailability && (
            <div className="searchfilter-options-dropdown">
              <label>
                <input type="checkbox" /> Abstract
              </label>
              <label>
                <input type="checkbox" /> Free full text
              </label>
              <label>
                <input type="checkbox" /> Full text
              </label>
            </div>
          )}
        </div>

        {/* Article type section */}
        <div className="searchfilter-section">
          <h5 onClick={() => setShowArticleType(!showArticleType)}>
            Article type {showArticleType ? "▲" : "▼"}
          </h5>
          {showArticleType && (
            <div className="searchfilter-options-dropdown">
              <label>
                <input type="checkbox" value="Books and Documents" onChange={handleFilterChange}/> Books & Documents
              </label>
              <label>
                <input type="checkbox" value="Clinical Trials" onChange={handleFilterChange}/> Clinical Trials
              </label>
              <label>
                <input type="checkbox" value="Meta Analysis" onChange={handleFilterChange}/> Meta Analysis
              </label>
              <label>
                <input type="checkbox" value="Review" onChange={handleFilterChange}/> Review
              </label>
            </div>
          )}
        </div>

        {/* Publication date section */}
        <div className="searchfilter-section">
          <h5 onClick={() => setShowPublicationDate(!showPublicationDate)}>
            Publication date {showPublicationDate ? "▲" : "▼"}
          </h5>
          {showPublicationDate && (
            <div className="searchfilter-options-dropdown">
              <label>
                <input type="radio" name="date" /> 1 year
              </label>
              <label>
                <input type="radio" name="date" /> 5 years
              </label>
              <label>
                <input type="radio" name="date" /> Custom range
              </label>
            </div>
          )}
        </div>
      </div>
      </div>
      <div className='searchContent-right' ref={contentRightRef}>
        {data.articles && data.articles.length > 0 ? (
          <>
            <div className="SearchResult-Count-Filters">
              <div className='SearchResult-Option-Left'>
                <button className='SearchResult-Save'>Save</button>
                <button className='SearchResult-Email'>Email</button>
              </div>
              <div>
                  <button className="SearchResult-count"><span style={{color:'blue'}}>{data.articles.length}</span> results</button>
                  <select className='SearchResult-dropdown'>
                        <option value="volvo">BestSearch</option>
                        <option value="mercedes">Articles</option>
                        <option value="audi">Books</option>
                        <option value="saab">Abstarct</option>
                  </select>
              </div>
            </div>
                
                
            <div className='searchContent-articles'>

              <div className="searchresults-list">
                {paginatedArticles.map((result, index) => (
                  
                  <div key={index} className="searchresult-item ">
                    <div className="searchresult-item-header">
                    <h3 className="searchresult-title">
                        <input type="checkbox" className="result-checkbox" />
                        <span className="gradient-text" onClick={() => handleNavigate(result.pmid)} style={{ cursor: 'pointer', }}>
                          {italicizeTerm(result.article_title)}
                        </span>
                    </h3>
                    <button className='SearchResult-Options'>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 15C10.46 15 10.8333 15.3733 10.8333 15.8333C10.8333 16.2933 10.46 16.6667 9.99996 16.6667C9.53996 16.6667 9.16663 16.2933 9.16663 15.8333C9.16663 15.3733 9.53996 15 9.99996 15Z" stroke="#3A3A40" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 3.3335C10.46 3.3335 10.8333 3.70683 10.8333 4.16683C10.8333 4.62683 10.46 5.00016 9.99996 5.00016C9.53996 5.00016 9.16663 4.62683 9.16663 4.16683C9.16663 3.70683 9.53996 3.3335 9.99996 3.3335Z" stroke="#3A3A40" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 9.1665C10.46 9.1665 10.8333 9.53984 10.8333 9.99984C10.8333 10.4598 10.46 10.8332 9.99996 10.8332C9.53996 10.8332 9.16663 10.4598 9.16663 9.99984C9.16663 9.53984 9.53996 9.1665 9.99996 9.1665Z" stroke="#3A3A40" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              </div>
                    <p className="searchresult-authors">{`Published on: ${result.publication_date}`}</p>
                    <p className="searchresult-pmid">{`PMID: ${result.pmid}`}</p>
                      <p className="searchresult-description" style={{ textAlign: "justify" }}>
                      {italicizeTerm(Object.values(result.abstract_content[1]).join(' ').slice(0, 1000))}...
                      </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="pagination">
              <span>{`${startIndex + 1} - ${endIndex} of ${data.articles.length}`}</span>
              <div className="pagination-controls">
                <Button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {"<"}
                </Button>
                <span>{currentPage}</span>
                <span>/ {totalPages}</span>
                <Button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {">"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="data-not-found-container">
            <div className="data-not-found">
              <h2>Data Not Found</h2>
              <p>We couldn't find any data matching your search. Please try again with different keywords.</p>
            </div>
          </div>
        )}
      </div>
      <div className="right-aside">
            {openAnnotate && (
              <div className="annotate">
                <div className="tables">
                  <p style={{ textAlign: "start" }}>Annotations</p>
                  <div className='Annotate-tables'>
                  
                  <table>

                    <tr className="table-head">
                      <th>Type</th>
                      <th>Concept Id</th>
                      <th>Text</th>
                    </tr>
                    <tr className="table-row">
                      <td>GENE</td>
                      <td>GENE:7164</td>
                      <td>Acetylationv</td>
                    </tr>
                    <tr className="table-row">
                      <td>GENE</td>
                      <td>GENE:7164</td>
                      <td>Acetylation</td>
                    </tr>
                    <tr className="table-row">
                      <td>Desease</td>
                      <td>GENE:7164</td>
                      <td>Cancer</td>
                    </tr>
                    <tr className="table-row">
                      <td>GENE</td>
                      <td>GENE:7164</td>
                      <td>Acetylation</td>
                    </tr>
                    <tr className="table-row">
                      <td>Mutation</td>
                      <td>GENE:7164</td>
                      <td>Blood Cancer</td>
                    </tr>
                    <tr className="table-row">
                      <td>Desease</td>
                      <td>GENE:7164</td>
                      <td>Cancer</td>
                    </tr>
                    <tr className="table-row">
                      <td>Mutation</td>
                      <td>GENE:7164</td>
                      <td>Acetylation</td>
                    </tr>
                  </table>
                  </div> 
                </div>
              </div>
            )}
            {openNotes && (
              <div className="notes">
                <div
                  className="notes-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <p>Notes</p>
                  <button className="save-button"> save</button>
                </div>
                <textarea
                  className="note-taking"
                  name=""
                  id=""
                  placeholder="Type something..."
                ></textarea>
              </div>
            )}
            <div className="icons-group">
              <div
                className={`annotate-icon ${openAnnotate ? "open" : "closed"}`}
                onClick={handleAnnotate}
              >
                <img src={annotate} alt="annotate-icon" />
              </div>
              <div
                className={`notes-icon ${openNotes ? "open" : "closed"}`}
                onClick={handleNotes}
              >
                <img src={notesicon} alt="notes-icon" />
              </div>
            </div>
          </div>
      </div>
      <div className='Landing-footer'>
            
                <div className="footer-section contact-info">
                    <h3>Infer.</h3>
                    <p>4,390 US Highway 1, Suite 302, Princeton NJ 08540</p>
                    <p><a href="mailto:admin@infersol.com">admin@infersol.com</a></p>
                </div>

                <div className="footer-section resources">
                    <h4 style={{"margin-bottom":"0"}}>Resources</h4>
    
                        <a href="#">Search</a>
                        <a href="#">About Us</a>
                        <a href="#">Why Infer?</a>
    
                </div>

                <div className="footer-section faqs">
                    <h4 style={{"margin-bottom":"0"}}>FAQs</h4>
                    
                        <a href="#">Lorem Ipsum</a>
                        <a href="#">Lorem Ipsum</a>
                        <a href="#">Lorem Ipsum</a>
                    
                </div>

                <div className="footer-section newsletter">
                    <h4 style={{"margin-bottom":"5px"}}>Subscribe to Newsletter</h4>
                    <form>
                        <input className="newsletter-input" type="email" placeholder="Enter Email" />
                        <button className="newsletter-submit" type="submit">Submit</button>
                    </form>
                    <div className="social-icons">
                        <a href="#"><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.1" fill-rule="evenodd" clip-rule="evenodd" d="M0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15Z" fill="#1A82FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.0007 7C12.8281 7 12.5554 7.0095 11.702 7.04833C10.8504 7.08733 10.269 7.22217 9.76036 7.42C9.23419 7.62434 8.78785 7.89768 8.34318 8.34251C7.89818 8.78719 7.62484 9.23352 7.41984 9.75953C7.2215 10.2684 7.0865 10.8499 7.04817 11.7012C7.01 12.5546 7 12.8274 7 15.0001C7 17.1728 7.00967 17.4446 7.04833 18.298C7.0875 19.1496 7.22234 19.731 7.42 20.2396C7.62451 20.7658 7.89784 21.2121 8.34268 21.6568C8.78719 22.1018 9.23352 22.3758 9.75936 22.5802C10.2684 22.778 10.8499 22.9128 11.7014 22.9518C12.5547 22.9907 12.8272 23.0002 14.9998 23.0002C17.1726 23.0002 17.4444 22.9907 18.2978 22.9518C19.1495 22.9128 19.7315 22.778 20.2405 22.5802C20.7665 22.3758 21.2121 22.1018 21.6567 21.6568C22.1017 21.2121 22.375 20.7658 22.58 20.2398C22.7767 19.731 22.9117 19.1495 22.9517 18.2981C22.99 17.4448 23 17.1728 23 15.0001C23 12.8274 22.99 12.5547 22.9517 11.7014C22.9117 10.8497 22.7767 10.2684 22.58 9.7597C22.375 9.23352 22.1017 8.78719 21.6567 8.34251C21.2116 7.89751 20.7666 7.62417 20.24 7.42C19.73 7.22217 19.1483 7.08733 18.2966 7.04833C17.4433 7.0095 17.1716 7 14.9982 7H15.0007ZM14.283 8.44166C14.496 8.44133 14.7337 8.44166 15.0007 8.44166C17.1367 8.44166 17.3899 8.44933 18.2334 8.48766C19.0134 8.52333 19.4368 8.65366 19.7188 8.76316C20.0921 8.90816 20.3583 9.0815 20.6381 9.3615C20.9181 9.64151 21.0914 9.90817 21.2368 10.2815C21.3463 10.5632 21.4768 10.9865 21.5123 11.7665C21.5506 12.6099 21.5589 12.8632 21.5589 14.9982C21.5589 17.1333 21.5506 17.3866 21.5123 18.2299C21.4766 19.0099 21.3463 19.4333 21.2368 19.7149C21.0918 20.0883 20.9181 20.3541 20.6381 20.634C20.3581 20.914 20.0923 21.0873 19.7188 21.2323C19.4371 21.3423 19.0134 21.4723 18.2334 21.508C17.3901 21.5463 17.1367 21.5546 15.0007 21.5546C12.8645 21.5546 12.6114 21.5463 11.768 21.508C10.988 21.472 10.5647 21.3416 10.2825 21.2321C9.90916 21.0871 9.64249 20.9138 9.36249 20.6338C9.08249 20.3538 8.90915 20.0878 8.76382 19.7143C8.65432 19.4326 8.52381 19.0093 8.48831 18.2293C8.44998 17.3859 8.44231 17.1326 8.44231 14.9962C8.44231 12.8599 8.44998 12.6079 8.48831 11.7645C8.52398 10.9845 8.65432 10.5612 8.76382 10.2792C8.90882 9.90584 9.08249 9.63917 9.36249 9.35917C9.64249 9.07917 9.90916 8.90583 10.2825 8.7605C10.5645 8.65049 10.988 8.52049 11.768 8.48466C12.506 8.45133 12.792 8.44133 14.283 8.43966V8.44166ZM19.2711 9.77001C18.7411 9.77001 18.3111 10.1995 18.3111 10.7297C18.3111 11.2597 18.7411 11.6897 19.2711 11.6897C19.8011 11.6897 20.2311 11.2597 20.2311 10.7297C20.2311 10.1997 19.8011 9.77001 19.2711 9.77001ZM15.0008 10.8917C12.7319 10.8917 10.8924 12.7312 10.8924 15.0001C10.8924 17.2689 12.7319 19.1076 15.0008 19.1076C17.2696 19.1076 19.1085 17.2689 19.1085 15.0001C19.1085 12.7312 17.2696 10.8917 15.0008 10.8917ZM15.0007 12.3334C16.4734 12.3334 17.6674 13.5272 17.6674 15.0001C17.6674 16.4727 16.4734 17.6668 15.0007 17.6668C13.5279 17.6668 12.334 16.4727 12.334 15.0001C12.334 13.5272 13.5279 12.3334 15.0007 12.3334Z" fill="#1A82FF"/>
</svg>
</a>
                        <a href="#"><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.1" fill-rule="evenodd" clip-rule="evenodd" d="M-0.000244141 14.9999C-0.000244141 6.71567 6.71548 -6.10352e-05 14.9998 -6.10352e-05C23.284 -6.10352e-05 29.9998 6.71567 29.9998 14.9999C29.9998 23.2842 23.284 29.9999 14.9998 29.9999C6.71548 29.9999 -0.000244141 23.2842 -0.000244141 14.9999Z" fill="#1A82FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.5493 12.1921L14.5808 12.7111L14.0562 12.6475C12.1466 12.4039 10.4784 11.5777 9.06193 10.1901L8.36945 9.50156L8.19108 10.01C7.81336 11.1434 8.05468 12.3404 8.8416 13.1454C9.26128 13.5903 9.16685 13.6538 8.44289 13.389C8.19108 13.3043 7.97074 13.2407 7.94976 13.2725C7.87632 13.3467 8.12813 14.3106 8.32748 14.6919C8.60028 15.2215 9.15636 15.7406 9.76491 16.0477L10.279 16.2914L9.67048 16.302C9.08292 16.302 9.06193 16.3126 9.12489 16.535C9.33473 17.2235 10.1636 17.9544 11.0869 18.2722L11.7374 18.4946L11.1709 18.8336C10.3315 19.3208 9.34522 19.5962 8.35896 19.6174C7.88681 19.628 7.4986 19.6704 7.4986 19.7022C7.4986 19.8081 8.77864 20.4013 9.52359 20.6343C11.7584 21.3228 14.4129 21.0262 16.4065 19.8505C17.8229 19.0137 19.2394 17.3506 19.9004 15.7406C20.2571 14.8826 20.6138 13.3149 20.6138 12.5628C20.6138 12.0755 20.6453 12.012 21.2329 11.4294C21.5791 11.0904 21.9044 10.7197 21.9673 10.6138C22.0722 10.4125 22.0618 10.4125 21.5267 10.5926C20.6348 10.9104 20.5089 10.868 20.9496 10.3913C21.2748 10.0524 21.6631 9.43801 21.6631 9.25794C21.6631 9.22616 21.5057 9.27912 21.3273 9.37445C21.1384 9.48038 20.7188 9.63927 20.404 9.7346L19.8374 9.91467L19.3233 9.56512C19.04 9.37445 18.6413 9.1626 18.4315 9.09905C17.8964 8.95075 17.078 8.97194 16.5953 9.14142C15.2838 9.61808 14.4549 10.8468 14.5493 12.1921Z" fill="#1A82FF"/>
</svg></a>
                        <a href="#"><svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path opacity="0.1" fill-rule="evenodd" clip-rule="evenodd" d="M-0.000244141 14.9999C-0.000244141 6.71567 6.71548 -6.10352e-05 14.9998 -6.10352e-05C23.284 -6.10352e-05 29.9998 6.71567 29.9998 14.9999C29.9998 23.2842 23.284 29.9999 14.9998 29.9999C6.71548 29.9999 -0.000244141 23.2842 -0.000244141 14.9999Z" fill="#1A82FF"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.2508 9.84327C21.9392 10.0322 22.4814 10.5888 22.6654 11.2957C22.9998 12.5768 22.9998 15.2499 22.9998 15.2499C22.9998 15.2499 22.9998 17.9229 22.6654 19.2042C22.4814 19.9111 21.9392 20.4677 21.2508 20.6567C20.0031 20.9999 14.9998 20.9999 14.9998 20.9999C14.9998 20.9999 9.99639 20.9999 8.74866 20.6567C8.06021 20.4677 7.51803 19.9111 7.33403 19.2042C6.99976 17.9229 6.99976 15.2499 6.99976 15.2499C6.99976 15.2499 6.99976 12.5768 7.33403 11.2957C7.51803 10.5888 8.06021 10.0322 8.74866 9.84327C9.99639 9.49994 14.9998 9.49994 14.9998 9.49994C14.9998 9.49994 20.0031 9.49994 21.2508 9.84327ZM13.4998 12.9999V17.9999L17.4998 15.5L13.4998 12.9999Z" fill="#1A82FF"/>
</svg>
    </a>
                    </div>
                </div>
        </div>
        <div className="footer-trademark">
                <p className='footer-trademark-content'>Copyright © 2024, Infer Solutions, Inc. All Rights Reserved.</p>
            </div>
    </Container>
    </>
  );
};

export default SearchContent;