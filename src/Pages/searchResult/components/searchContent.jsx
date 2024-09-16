import React, { useEffect, useRef, useState } from 'react';
import "./searchContent.css";
import { Container, Button } from '@mui/material';
import { Dialog, Checkbox, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

const ITEMS_PER_PAGE = 5;

const SearchContent = ({ open, onClose, applyFilters }) => {
  const location = useLocation(); // Access the passed state
  const { data } = location.state || { data: [] };
  const searchTerm = location.state?.searchTerm || '';
  const navigate = useNavigate();
  const contentRightRef = useRef(null); // Ref for searchContent-right

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    textAvailability: '',
    articleType: [],
    publicationDate: '',
  });

  const handleFilterChange = (event) => {
    const { name, value, checked } = event.target;
    if (name === 'articleType') {
      setFilters((prevFilters) => ({
        ...prevFilters,
        articleType: checked
          ? [...prevFilters.articleType, value]
          : prevFilters.articleType.filter((type) => type !== value),
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  const handleApplyFilters = () => {
    applyFilters(filters);
    onClose();
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
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) =>
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

  return (
    <>
    <Container maxWidth="xl" id='Search-Content-ContainerBox'>
        <div id='Search-Content-Container'>
        <div className='searchContent-left'>
            <h3 className="title">Similar results</h3>
            <div className="results-list-left">
            {data.articles && data.articles.length > 0 ? (
                data.articles.map((result, index) => (
                <div key={index} className="result-item-left">
                    {result.KEYWORDS ? result.KEYWORDS.split(';').map((keyword, i) => (
                        //   <Button
                    //     key={i}
                    //     className="keyword-button"
                    //     variant="contained"
                    //     color="primary"
                    //     onClick={() => console.log(`Clicked on keyword: ${keyword.trim()}`)}
                    //   >
                    //     {italicizeTerm(keyword.trim())}
                    //   </Button>
                <></>
                )) : <button style={{"display":"none"}}></button>}
              </div>
            ))
          ) : (
            <div className="SimilarResults-data-not-found-container">
              <div className="SimilarResults-data-not-found">
                <h2>Data Not Found</h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='searchContent-right' ref={contentRightRef}>
        {data.articles && data.articles.length > 0 ? (
          <>
            <div className='SearchResult-Count-Filters'>
              <button className='SearchResult-count'>{data.articles.length}</button>
              <button className='SearchResult-Filter'>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.04345 2C2.46738 2 2 2.47524 2 3.06027V3.6843C2 4.11765 2.16479 4.53439 2.45957 4.84785L5.69007 8.28288L5.69149 8.28072C6.31514 8.91919 6.66604 9.78228 6.66604 10.6822V13.7301C6.66604 13.9338 6.87913 14.0638 7.056 13.9677L8.8957 12.9653C9.17343 12.8136 9.34675 12.5189 9.34675 12.1989V10.6743C9.34675 9.77939 9.69267 8.91991 10.3106 8.28288L13.5411 4.84785C13.8352 4.53439 14 4.11765 14 3.6843V3.06027C14 2.47524 13.5333 2 12.9573 2H3.04345Z" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Filter
                </button>
              <button className='SearchResult-Options'>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 15C10.46 15 10.8333 15.3733 10.8333 15.8333C10.8333 16.2933 10.46 16.6667 9.99996 16.6667C9.53996 16.6667 9.16663 16.2933 9.16663 15.8333C9.16663 15.3733 9.53996 15 9.99996 15Z" stroke="#3A3A40" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 3.3335C10.46 3.3335 10.8333 3.70683 10.8333 4.16683C10.8333 4.62683 10.46 5.00016 9.99996 5.00016C9.53996 5.00016 9.16663 4.62683 9.16663 4.16683C9.16663 3.70683 9.53996 3.3335 9.99996 3.3335Z" stroke="#3A3A40" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.99996 9.1665C10.46 9.1665 10.8333 9.53984 10.8333 9.99984C10.8333 10.4598 10.46 10.8332 9.99996 10.8332C9.53996 10.8332 9.16663 10.4598 9.16663 9.99984C9.16663 9.53984 9.53996 9.1665 9.99996 9.1665Z" stroke="#3A3A40" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className='searchContent-articles'>

              <div className="searchresults-list">
                {paginatedArticles.map((result, index) => (
                  
                  <div key={index} className="searchresult-item">
                    
                    <h3 className="searchresult-title"onClick={() => handleNavigate(result.PMID)}>
                      <input type="checkbox" className="result-checkbox" />
                      {italicizeTerm(result.TITLE)}
                    </h3>
                    <p className="searchresult-authors">{result.authors}</p>
                    <p className="searchresult-pmid">{`PMID: ${result.PMID}`}</p>

                    
  { 
    result.display && result[result.display] ? (
      result.display === 'TITLE' ? (
        <p className="searchresult-description"></p>  // or any fallback you want
      ) : (
        <p className="searchresult-description" style={{ textAlign: "justify" }}>
          {italicizeTerm(result[result.display].slice(0, 1000))}
        </p>
      )
    ) : (
      <p className="searchresult-description">No relevant content available</p>
    )
  }
                  </div>
                ))}
              </div>
            </div>
            <div className="pagination">
              <span>{`${startIndex + 1} - ${Math.min(endIndex, data.articles.length)} of ${data.articles.length}`}</span>
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
      </div>
      <div className='Search-footer'>
                <div className="Searchfooter-content">
                    <p className="Searchfooter-trademark">Copyright © 2024, Infer Solutions, Inc. All Rights Reserved.</p>
                    <div className="Searchsocial-icons">
                        <a href="#"><i className="fab fa-facebook"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.3333 10.85V14.2333H19.3667C19.6 14.2333 19.7167 14.4667 19.7167 14.7L19.25 16.9167C19.25 17.0333 19.0167 17.15 18.9 17.15H16.3333V25.6667H12.8333V17.2667H10.85C10.6167 17.2667 10.5 17.15 10.5 16.9167V14.7C10.5 14.4667 10.6167 14.35 10.85 14.35H12.8333V10.5C12.8333 8.51667 14.35 7 16.3333 7H19.4833C19.7167 7 19.8333 7.11667 19.8333 7.35V10.15C19.8333 10.3833 19.7167 10.5 19.4833 10.5H16.6833C16.45 10.5 16.3333 10.6167 16.3333 10.85Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"/>
                            <path d="M17.5003 25.6668H10.5003C4.66695 25.6668 2.33362 23.3335 2.33362 17.5002V10.5002C2.33362 4.66683 4.66695 2.3335 10.5003 2.3335H17.5003C23.3336 2.3335 25.667 4.66683 25.667 10.5002V17.5002C25.667 23.3335 23.3336 25.6668 17.5003 25.6668Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg></i></a>
                        <a href="#"><i className="fab fa-youtube"><svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.3336 23.3332H8.66695C5.16695 23.3332 2.83362 20.9998 2.83362 17.4998V10.4998C2.83362 6.99984 5.16695 4.6665 8.66695 4.6665H20.3336C23.8336 4.6665 26.167 6.99984 26.167 10.4998V17.4998C26.167 20.9998 23.8336 23.3332 20.3336 23.3332Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M13.8 11.0834L16.7166 12.8334C17.7666 13.5334 17.7666 14.5834 16.7166 15.2834L13.8 17.0334C12.6333 17.7334 11.7 17.15 11.7 15.8667V12.3667C11.7 10.85 12.6333 10.3834 13.8 11.0834Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg></i></a>
                        <a href="#"><i className="fab fa-google"><svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25.2002 11.9002H14.2336V16.2168H20.6502C20.5336 17.2668 19.8336 18.9002 18.3169 19.9502C17.3836 20.6502 15.9836 21.1168 14.2336 21.1168C11.2002 21.1168 8.51689 19.1335 7.58356 16.2168C7.35023 15.5168 7.23356 14.7002 7.23356 13.8835C7.23356 13.0668 7.35023 12.2502 7.58356 11.5502C7.70023 11.3168 7.70023 11.0835 7.81689 10.9668C8.86689 8.51683 11.3169 6.76683 14.2336 6.76683C16.4502 6.76683 17.8502 7.70016 18.7836 8.51683L22.0502 5.25016C20.0669 3.50016 17.3836 2.3335 14.2336 2.3335C9.68356 2.3335 5.71689 4.90016 3.85023 8.75016C3.03356 10.3835 2.56689 12.1335 2.56689 14.0002C2.56689 15.8668 3.03356 17.6168 3.85023 19.2502C5.71689 23.1002 9.68356 25.6668 14.2336 25.6668C17.3836 25.6668 20.0669 24.6168 21.9336 22.8668C24.1502 20.8835 25.4336 17.8502 25.4336 14.2335C25.4336 13.3002 25.3169 12.6002 25.2002 11.9002Z" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg></i></a>
                    </div>
                </div>
        </div>
    </Container>
    </>
  );
};

export default SearchContent;