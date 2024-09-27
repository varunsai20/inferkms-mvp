import React, { useEffect, useRef, useState } from "react";
import "./searchContent.css";
import { Container, Button, CircularProgress } from "@mui/material";
import Logo from "../../../images/Frame 25.svg";
import Message from "../../../images/Message.svg";
import Location from "../../../images/Location.svg";
import Annotation from "../../Article Page/Annotation";
import {
  Dialog,
  Checkbox,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import FilterPopup from "./FilterPopup";
import annotate from "../../../images/task-square.svg";
import notesicon from "../../../images/note-2.svg";

import axios from "axios";
const ITEMS_PER_PAGE = 5;

const SearchContent = ({ open, onClose, applyFilters , selectedArticles, setSelectedArticles, annotateData, setAnnotateData,openAnnotate,setOpenAnnotate }) => {
  const location = useLocation(); // Access the passed state
  const { data } = location.state || { data: [] };
  const searchTerm = location.state?.searchTerm || "";
  const navigate = useNavigate();
  const contentRightRef = useRef(null); // Ref for searchContent-right
  const [result, setResults] = useState();
  const [loading, setLoading] = useState();
  // const [selectedArticles, setSelectedArticles] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);

  //const [checkBoxLoading, setCheckBoxLoading] = useState(false);
  //const [isChecked, setIsChecked] = useState(false);

  // Save checkbox state in sessionStorage for the current searchTerm
  // useEffect(() => {
  //   const savedState = sessionStorage.getItem(`checkboxState_${searchTerm}`);
  //   if (savedState !== null) {
  //     setIsChecked(JSON.parse(savedState));
  //   }
  // }, [searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(() => {
    // Get initial state from localStorage, if available
    const savedFilters = localStorage.getItem("filters");
    return savedFilters ? JSON.parse(savedFilters) : { articleType: [] };
  });

  // Save filters to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("filters", JSON.stringify(filters));
  }, [filters]);
  
  const [showFilterPopup, setShowFilterPopup] = useState(false);
  const [showTextAvailability, setShowTextAvailability] = useState(true);
  const [showArticleType, setShowArticleType] = useState(true);
  const [showPublicationDate, setShowPublicationDate] = useState(true);
  
  // const [annotateData,setAnnotateData]=useState()
  const [openNotes, setOpenNotes] = useState(false);
  const [annotateLoading,setAnnotateLoading]=useState(false)
  const handleAnnotate = () => {
    if (openAnnotate) {
      setOpenAnnotate(false);
    } else {
      setOpenAnnotate(true);
      setOpenNotes(false);
    }
  };
  // console.log(filters)
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

  // console.log(filters);
  useEffect(() => {
    if (annotateLoading) {
      // Disable scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Enable scrolling
      document.body.style.overflow = 'auto';
    }

    // Cleanup to reset the overflow when the component is unmounted or annotateLoading changes
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [annotateLoading]);

  const handleFilterChange = async (event) => {
    setLoading(true);
    setSelectedArticles([])
    setAnnotateData([])
    setOpenAnnotate(false)
    const newCheckedState = event.target.checked;
    //setIsChecked(newCheckedState);
    localStorage.setItem("checkboxState", JSON.stringify(newCheckedState)); // Save state to localStorage
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
  console.log(selectedArticles)
  console.log(annotateData)
  const handleButtonClick = (updatedFilters) => {
    
    //setCheckBoxLoading(true);
    setLoading(true);
    
    if (searchTerm) {
      setLoading(true);
      sessionStorage.setItem("SearchTerm", searchTerm);

      const timeoutId = setTimeout(() => {
        setLoading(false);
        navigate("/search", { state: { data: [], searchTerm } });
      }, 30000); // 30 seconds

      const filtersToSend = updatedFilters.articleType;
      
      const apiUrl =
        filtersToSend.length > 0
          ? "http://13.127.207.184:80/filter"
          : "http://13.127.207.184:80/query";
      // console.log(apiUrl);
      const requestBody =
        filtersToSend.length > 0
          ? {
              query: searchTerm,
              filters: filtersToSend, // Send the filters if available
            }
          : {
              query: searchTerm, // Send only the query if filters are empty
            };
      // console.log(requestBody);
      axios
        .post(apiUrl, requestBody)
        .then((response) => {
          
          // console.log(response);
          //setIsChecked((prev) => !prev);
          //localStorage.setItem("checkboxState", JSON.stringify(!isChecked));
          const data = response.data; // Assuming the API response contains the necessary data
          setResults(data);
          setAnnotateData([])
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

  const handleApplyFilters = () => {
    applyFilters(filters);
    setShowFilterPopup(false);
  };
  useEffect(() => {
    setSelectedArticles([]);
    setAnnotateData([]);
    setOpenAnnotate(false)
  }, []);
  useEffect(() => {
    // Clear session storage for chatHistory when the location changes
    sessionStorage.removeItem("chatHistory");
  }, [location]);

  // Function to italicize the search term in the text
  const italicizeTerm = (text) => {
    if (!text) return "";
  if (!searchTerm) return String(text);

  // Convert text to a string before using split
  const textString = String(text);
  const regex = new RegExp(`(${searchTerm})`, "gi");

  return textString.split(regex).map((part, index) =>
    part.toLowerCase() === searchTerm.toLowerCase() ? (
      <b
        key={index}
        className="bold"
        style={{ fontWeight: "bold", display: "inline-flex" }}
      >
        {part}
      </b>
    ) : (
      part
    )
  );
  };
  const handleResetAll = () => {
    // Clear the filters from state
    setFilters({ articleType: [] });
    setAnnotateData([])
    setSelectedArticles([])
    setOpenAnnotate(false)
    // Clear the filters from localStorage
    localStorage.removeItem("filters");
    
    // Optionally, you can also trigger the API call without any filters
    handleButtonClick({ articleType: [] });
  };
  const handleNavigate = (pmid) => {
    navigate(`/article/${pmid}`, { state: { data: data, searchTerm,annotateData: annotateData } });
  };
  // Calculate the index range for articles to display
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedArticles = data.articles && data.articles.slice(startIndex, endIndex) || [];
  // console.log(paginatedArticles);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      
        contentRightRef.current.scrollIntoView({ behavior: "smooth" });
      
    }
  };
  console.log(annotateData)
  useEffect(() => {
    // Reset currentPage to 1 whenever new search results are loaded
    setCurrentPage(1);
  }, [data.articles]);
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling
    } else {
      document.body.style.overflow = 'auto'; // Enable scrolling
    }
    
    return () => {
      document.body.style.overflow = 'auto'; // Cleanup on unmount
    };
  }, [loading]);
  // Calculate total pages
  const totalPages = data.articles ? Math.ceil(data.articles.length / ITEMS_PER_PAGE) : 0;
  // console.log(data);
  const handleCheckboxChange = (pmid) => {
    setSelectedArticles((prevSelected) =>
      prevSelected.includes(pmid)
        ? prevSelected.filter((id) => id !== pmid) // Remove unchecked article
        : [...prevSelected, pmid] // Add checked article
    );
  };

  // console.log(selectedArticles)
  const handleAnnotateClick = async () => {
    if (selectedArticles.length > 0) {
      setAnnotateData([])
      setAnnotateLoading(true);
      axios.post('http://13.127.207.184:80/annotate', {
        pmid: selectedArticles

          , // Sending the selected PMIDs in the request body
      })
        .then((response) => {
          console.log(response)
          //setIsChecked((prev) => !prev);
          //localStorage.setItem("checkboxState", JSON.stringify(!isChecked));
          const data = response.data; 
          // console.log(response)
          setAnnotateData(data)
          console.log(data)
          console.log(data.length)
          setOpenAnnotate(true)
          // console.log(data)// Assuming the API response contains the necessary data
          // setResults(data);
          // Navigate to SearchPage and pass data via state
          // navigate("/search", { state: { data, searchTerm } });
          // clearTimeout(timeoutId);
          // setLoading(false);
          setAnnotateLoading(false);
          console.log("executed")
        })
        .catch((error) => {
          console.log(error);
          // clearTimeout(timeoutId);
          // setLoading(false);
          // navigate("/search", { state: { data: [], searchTerm } });
          console.error("Error fetching data from the API", error);
        });
        }
        
        
        // Handle success response (e.g., show a success message or update the UI)
      
  };
  const [expandedPmids, setExpandedPmids] = useState({}); // Track which PMIDs are expanded
  const [expandedTexts, setExpandedTexts] = useState({});
  useEffect(() => {
    // Reset expandedTexts when openAnnotate changes
    if (openAnnotate) {
      setExpandedTexts({}); // Resets all expanded texts to the collapsed (sliced) state
    }
  }, [openAnnotate]);
  // Function to toggle the expansion for all rows associated with a given PMID
  const toggleExpandPmid = (pmid) => {
    setExpandedPmids((prevState) => {
      const isExpanding = !prevState[pmid]; // Determine if we are expanding or collapsing
      if (!isExpanding) {
        // If we are collapsing, reset the expanded texts for this PMID
        const updatedTexts = { ...expandedTexts };
        Object.keys(updatedTexts).forEach((key) => {
          if (key.startsWith(`${pmid}-`)) {
            delete updatedTexts[key]; // Remove expanded text for this PMID's rows
          }
        });
        setExpandedTexts(updatedTexts); // Update expanded texts
      }
      return {
        ...prevState,
        [pmid]: isExpanding, // Toggle expansion for the specific PMID
      };
    });
  };
  
  const toggleExpandText = (key) => {
    setExpandedTexts((prevState) => ({
      ...prevState,
      [key]: !prevState[key], // Toggle between full text and sliced text for a specific row
    }));
  };

  const renderAnnotations = () => {
    return annotateData.map((entry) =>
      Object.entries(entry).flatMap(([pmid, types]) => {
        const rows = [];
        const isExpanded = expandedPmids[pmid];
  
        // Get the first available type from the types object
        const sortedTypes = Object.entries(types)
          .sort(([_, a], [__, b]) => (b.annotation_score || 0) - (a.annotation_score || 0)); // Sort by annotation_score in descending order
  
        const [firstType, firstTypeData] = sortedTypes[0] || [];
        const annotationScore = firstTypeData ? `${firstTypeData.annotation_score.toFixed(2)}%` : '0%';
  
        const firstTypeValues = Object.entries(firstTypeData || {})
          .filter(([key]) => key !== 'annotation_score')
          .map(([key]) => key)
          .join(', ');
  
        // Check if the text for this PMCID is expanded
        const isFirstTypeExpanded = expandedTexts[`${pmid}-firstType`];
  
        // First row with expand button and either expanded or sliced data
        rows.push(
          <tr className="search-table-body" key={`${pmid}-first`}>
            <td style={{paddingLeft:0}}>
              <button onClick={() => toggleExpandPmid(pmid)} style={{paddingLeft:4}}>
              {isExpanded ? '▼' : '▶'}  
              </button>
              <a style={{color:"#1a82ff",fontWeight:600,cursor:"pointer"}} onClick={() => handleNavigate(pmid)}>{pmid}</a>
            </td>
            <td>{annotationScore}</td>
            <td>{firstType && firstType.length > 25 ? `${firstType.slice(0, 25)}` : firstType}</td>
            <td>
              {isFirstTypeExpanded
                ? firstTypeValues // Show full data if expanded
                : `${firstTypeValues.slice(0, 20)}`} {/* Show sliced data if not expanded */}
              
              {firstTypeValues.length > 30 && (
                <span
                  style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
                  onClick={() => toggleExpandText(`${pmid}-firstType`)} // Toggle text expansion
                >
                  {isFirstTypeExpanded ? '' : '...'}
                </span>
              )}
            </td>
          </tr>
        );
  
        // Collect all rows for each type, excluding the first type
        const typeRows = sortedTypes.slice(1).map(([type, values]) => {
            const valueEntries = Object.entries(values)
              .filter(([key]) => key !== 'annotation_score')
              .map(([key]) => `${key}`);
  
            const annotationScore = values.annotation_score
              ? `${values.annotation_score.toFixed(2)}%`
              : '0%';
  
            const valueText = valueEntries.join(', ');
            const typeKey = `${pmid}-${type}`;
            const isTypeTextExpanded = expandedTexts[typeKey];
            const displayText = isTypeTextExpanded
              ? valueText
              : valueText.length > 30
              ? `${valueText.slice(0, 20)}`
              : valueText;
  
            return (
              <tr className="search-table-body" key={typeKey}>
                <td style={{ paddingLeft: '30px' }}></td> {/* Indentation for expanded rows */}
                <td>{annotationScore}</td>
                <td>{type.length > 25 ? `${type.slice(0, 25)}` : type}</td>
                <td>
                  {displayText}
                  {valueText.length > 30 && !isTypeTextExpanded && (
                    <span
                      onClick={() => toggleExpandText(typeKey)}
                      style={{ color: 'blue', cursor: 'pointer', marginLeft: '5px' }}
                    >
                      ...
                    </span>
                  )}
                </td>
              </tr>
            );
          });
  
        // If expanded, show all rows except the first type
        if (isExpanded) {
          rows.push(...typeRows);
        }
  
        return rows;
      })
    );
  };


  return (
    <>
      <Container maxWidth="xl" id="Search-Content-ContainerBox">
        <div id="Search-Content-Container">
          <div className="searchContent-left">
            <div className="searchContent-left-header">
              <p className="title">Filters</p>
              <p className="Filters-ResetAll" onClick={handleResetAll}>Reset All</p>
            </div>

            <div className="searchfilter-options">
              {/* Article type section */}
              <div className="searchfilter-section">
                <h5 onClick={() => setShowArticleType(!showArticleType)}>
                  Article type{" "}
                  {showArticleType ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      transform="rotate(0)"
                    >
                      <path
                        d="M3.72603 6.64009C3.94792 6.4182 4.29514 6.39803 4.53981 6.57957L4.60991 6.64009L10.0013 12.0312L15.3927 6.64009C15.6146 6.4182 15.9618 6.39803 16.2065 6.57957L16.2766 6.64009C16.4985 6.86198 16.5186 7.2092 16.3371 7.45387L16.2766 7.52397L10.4432 13.3573C10.2214 13.5792 9.87414 13.5994 9.62946 13.4178L9.55936 13.3573L3.72603 7.52397C3.48195 7.2799 3.48195 6.88417 3.72603 6.64009Z"
                        fill="#4A4B53"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      transform="rotate(180)"
                    >
                      <path
                        d="M3.72603 6.64009C3.94792 6.4182 4.29514 6.39803 4.53981 6.57957L4.60991 6.64009L10.0013 12.0312L15.3927 6.64009C15.6146 6.4182 15.9618 6.39803 16.2065 6.57957L16.2766 6.64009C16.4985 6.86198 16.5186 7.2092 16.3371 7.45387L16.2766 7.52397L10.4432 13.3573C10.2214 13.5792 9.87414 13.5994 9.62946 13.4178L9.55936 13.3573L3.72603 7.52397C3.48195 7.2799 3.48195 6.88417 3.72603 6.64009Z"
                        fill="#4A4B53"
                      />
                    </svg>
                  )}
                </h5>
                {showArticleType && (
                  <div className="searchfilter-options-dropdown">
                    <label>
                      <input
                        type="checkbox"
                        value="Books and Documents"
                        // disabled={checkBoxLoading}
                        checked={filters.articleType.includes("Books and Documents")}
                        onChange={handleFilterChange}
                        //checked={isChecked} // Controlled checkbox state
                      />{" "}
                      Books & Documents
                      {/* {checkBoxLoading && <span>Loading...</span>} */}
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Clinical Trials"
                        checked={filters.articleType.includes("Clinical Trials")}
                        onChange={handleFilterChange}
                      />{" "}
                      Clinical Trials
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Meta Analysis"
                        checked={filters.articleType.includes("Meta Analysis")}
                        onChange={handleFilterChange}
                      />{" "}
                      Meta Analysis
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        value="Review"
                        checked={filters.articleType.includes("Review")}
                        onChange={handleFilterChange}
                      />{" "}
                      Review
                    </label>
                  </div>
                )}
              </div>

              {/* Publication date section */}
              <div className="searchfilter-section">
                <h5
                  onClick={() => setShowPublicationDate(!showPublicationDate)}
                >
                  Publication date{" "}
                  <span>
                    {showTextAvailability ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        transform="rotate(0)"
                      >
                        <path
                          d="M3.72603 6.64009C3.94792 6.4182 4.29514 6.39803 4.53981 6.57957L4.60991 6.64009L10.0013 12.0312L15.3927 6.64009C15.6146 6.4182 15.9618 6.39803 16.2065 6.57957L16.2766 6.64009C16.4985 6.86198 16.5186 7.2092 16.3371 7.45387L16.2766 7.52397L10.4432 13.3573C10.2214 13.5792 9.87414 13.5994 9.62946 13.4178L9.55936 13.3573L3.72603 7.52397C3.48195 7.2799 3.48195 6.88417 3.72603 6.64009Z"
                          fill="#4A4B53"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        transform="rotate(180)"
                      >
                        <path
                          d="M3.72603 6.64009C3.94792 6.4182 4.29514 6.39803 4.53981 6.57957L4.60991 6.64009L10.0013 12.0312L15.3927 6.64009C15.6146 6.4182 15.9618 6.39803 16.2065 6.57957L16.2766 6.64009C16.4985 6.86198 16.5186 7.2092 16.3371 7.45387L16.2766 7.52397L10.4432 13.3573C10.2214 13.5792 9.87414 13.5994 9.62946 13.4178L9.55936 13.3573L3.72603 7.52397C3.48195 7.2799 3.48195 6.88417 3.72603 6.64009Z"
                          fill="#4A4B53"
                        />
                      </svg>
                    )}
                  </span>
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
              {/* Text availability section */}
              <div className="searchfilter-section">
                <h5
                  onClick={() => setShowTextAvailability(!showTextAvailability)}
                >
                  <span>Text availability</span>
                  <span>
                    {showTextAvailability ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        transform="rotate(0)"
                      >
                        <path
                          d="M3.72603 6.64009C3.94792 6.4182 4.29514 6.39803 4.53981 6.57957L4.60991 6.64009L10.0013 12.0312L15.3927 6.64009C15.6146 6.4182 15.9618 6.39803 16.2065 6.57957L16.2766 6.64009C16.4985 6.86198 16.5186 7.2092 16.3371 7.45387L16.2766 7.52397L10.4432 13.3573C10.2214 13.5792 9.87414 13.5994 9.62946 13.4178L9.55936 13.3573L3.72603 7.52397C3.48195 7.2799 3.48195 6.88417 3.72603 6.64009Z"
                          fill="#4A4B53"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        transform="rotate(180)"
                      >
                        <path
                          d="M3.72603 6.64009C3.94792 6.4182 4.29514 6.39803 4.53981 6.57957L4.60991 6.64009L10.0013 12.0312L15.3927 6.64009C15.6146 6.4182 15.9618 6.39803 16.2065 6.57957L16.2766 6.64009C16.4985 6.86198 16.5186 7.2092 16.3371 7.45387L16.2766 7.52397L10.4432 13.3573C10.2214 13.5792 9.87414 13.5994 9.62946 13.4178L9.55936 13.3573L3.72603 7.52397C3.48195 7.2799 3.48195 6.88417 3.72603 6.64009Z"
                          fill="#4A4B53"
                        />
                      </svg>
                    )}
                  </span>
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
            </div>
          </div>
          {loading ? (
            <CircularProgress
              background={"white"}
              size={24}
              style={{
                position: "fixed",
                top: "50%",
                left: "50%",
                transform: "translate(-50%,-50%)",
                zIndex: "1",
              }}
            />
          ) : (
            <div className="searchContent-right" ref={contentRightRef}>
              {data.articles && data.articles.length > 0 ? (
                <>
                  <div className="SearchResult-Count-Filters">
                  <div className="SearchResult-Option-Left"
                   style={{
                    cursor: selectedArticles.length > 0 ? 'pointer' : 'not-allowed',
                    opacity: selectedArticles.length > 0 ? 1 : "", // Change opacity for a disabled effect
                  }}
                  >
                  {annotateLoading ? (
            <CircularProgress
              background={"white"}
              size={24}
              style={{
                border:"none",
                marginLeft: "10px"

              }}
            />
          ):(
            <button
                className={`SearchResult-Annotate ${selectedArticles.length > 0 ? "active" : "disabled"}`}
                disabled={selectedArticles.length === 0}
                onClick={selectedArticles.length > 0 ? handleAnnotateClick : null}
                style={{
                  cursor: selectedArticles.length > 0 ? 'pointer' : 'not-allowed',
                  opacity: selectedArticles.length > 0 ? 1 : "", // Change opacity for a disabled effect
                }}
              >
                Annotate
              </button>
          )}
                      </div>

                    <div style={{display:"flex",flexDirection:"row",alignItems:"baseline"}}>
                      <div className="SearchResult-count" style={{ marginRight:"15px" }}>
                        <span style={{ color: "blue"}}>
                          {/* {loading ? (
                          <CircularProgress background={"white"} size={24} />
                          ) : ( */}
                          {data.articles.length}

                          {/* )} */}
                        </span>{" "}
                        results
                      </div>
                      <div style={{display:"flex",flexDirection:"row",alignItems:"baseline",gap:"5px"}}>
                        <span style={{color:"black", fontSize:"14px"}}>Sort by:</span>
                      <select className="SearchResult-dropdown">
                      <option value="audi">Publication Date</option>
                      <option value="volvo">Best Match</option>
                        {/* <option value="mercedes">Sort by:Most Relevant</option> */}
                        
                        {/* <option value="saab">Abstarct</option> */}
                      </select>
                      </div>
                     
                    </div>
                  </div>

                  <div className="searchContent-articles">
                    <div className="searchresults-list">
                      {paginatedArticles.map((result, index) => (
                        <div key={index} className="searchresult-item ">
                          <div className="searchresult-item-header">
                            <h3 className="searchresult-title">
                            <input
                                    type="checkbox"
                                    className="result-checkbox"
                                    onChange={() => handleCheckboxChange(result.pmid)}
                                    checked={selectedArticles.includes(result.pmid)} // Sync checkbox state
                                  />
                              <span
                                className="gradient-text"
                                onClick={() => handleNavigate(result.pmid)}
                                style={{ cursor: "pointer" }}
                              >
                                {italicizeTerm(result.article_title)}
                              </span>
                            </h3>
                           
                          </div>
                          <p className="searchresult-authors">{`Published on: ${result.publication_date}`}</p>
                          <p className="searchresult-pmid">{`PMID: ${result.pmid}`}</p>
                          <p
                              className="searchresult-description"
                              style={{ textAlign: "justify" }}
                            >
                              {italicizeTerm(
                                Object.values(result.abstract_content[1]).join(" ").slice(0, 500)
                              )}
                              {Object.values(result.abstract_content[1]).join(" ").length > 500 ? "..." : ""}
                            </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="pagination">
                    <span>{`${startIndex + 1} - ${endIndex} of ${
                      data.articles.length
                    }`}</span>
                    <div className="pagination-controls">
                      <Button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        {"<<"}
                      </Button>
                      <span>{currentPage}</span>
                      <span>/ {totalPages}</span>
                      <Button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        {">>"}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="data-not-found-container">
                  <div className="data-not-found">
                    <h2>Data Not Found</h2>
                    <p>
                      We couldn't find any data matching your search. Please try
                      again with different keywords.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          {loading?(""):(
            <>
            
            <div className="search-right-aside">
              {openAnnotate && (
              <div className="search-annotate">
                
                <Annotation 
                    openAnnotate={openAnnotate} 
                    annotateData={annotateData}
                />
            
              </div>
            )}


              <div className="search-icons-group">
              <div
      className={`search-annotate-icon ${openAnnotate ? "open" : "closed"} ${annotateData && annotateData.length > 0 ? "" : "disabled"}`}
      onClick={annotateData && annotateData.length > 0 ? handleAnnotate : null}
      style={{
        cursor: annotateData && annotateData.length > 0 ? 'pointer' : 'not-allowed',
        opacity: annotateData && annotateData.length > 0 ? 1 : 1, // Adjust visibility when disabled
      }}
    >
                  <img src={annotate} alt="annotate-icon" />
                </div>
              </div>
            </div>

                    
          
          
            </>
          )}
         </div> 
        
        <div className="Landing-footer">
          <div className="footer-section contact-info">
            <div style={{ display: "flex", marginBottom: "3%" }}>
              <img src={Logo} href="/"></img>
            </div>

            <div style={{ display: "flex", marginBottom: "3%" }}>
              <img src={Location} style={{ marginRight: "10px" }}></img>
              <p>4,390 US Highway 1, Suite 302, Princeton NJ 08540</p>
            </div>
            <div style={{ display: "flex", marginBottom: "3%" }}>
              <img src={Message} style={{ marginRight: "10px" }} />
              <p>
                <a href="mailto:admin@infersol.com">admin@infersol.com</a>
              </p>
            </div>
          </div>

          <div className="footer-section resources">
            <h3 style={{ marginBottom: "3%" }}>Resources</h3>

            <a href="#" style={{ marginBottom: "3%" }}>
              Search
            </a>
            <a href="#" style={{ marginBottom: "3%" }}>
              About Us
            </a>
            <a href="#" style={{ marginBottom: "3%" }}>
              Why Infer?
            </a>
          </div>


          <div className="footer-section newsletter">
            <h3 style={{ marginBottom: "3%" }}>Subscribe to Newsletter</h3>
            <form style={{ marginBottom: "3%" }}>
              <input
                className="newsletter-input"
                type="email"
                placeholder="Enter Email"
              />
              <button className="newsletter-submit" type="submit">
                Submit
              </button>
            </form>
            <div className="social-icons" style={{ marginBottom: "3%" }}>
              <a href="#">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M0 15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15C30 23.2843 23.2843 30 15 30C6.71573 30 0 23.2843 0 15Z"
                    fill="#1A82FF"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M15.0007 7C12.8281 7 12.5554 7.0095 11.702 7.04833C10.8504 7.08733 10.269 7.22217 9.76036 7.42C9.23419 7.62434 8.78785 7.89768 8.34318 8.34251C7.89818 8.78719 7.62484 9.23352 7.41984 9.75953C7.2215 10.2684 7.0865 10.8499 7.04817 11.7012C7.01 12.5546 7 12.8274 7 15.0001C7 17.1728 7.00967 17.4446 7.04833 18.298C7.0875 19.1496 7.22234 19.731 7.42 20.2396C7.62451 20.7658 7.89784 21.2121 8.34268 21.6568C8.78719 22.1018 9.23352 22.3758 9.75936 22.5802C10.2684 22.778 10.8499 22.9128 11.7014 22.9518C12.5547 22.9907 12.8272 23.0002 14.9998 23.0002C17.1726 23.0002 17.4444 22.9907 18.2978 22.9518C19.1495 22.9128 19.7315 22.778 20.2405 22.5802C20.7665 22.3758 21.2121 22.1018 21.6567 21.6568C22.1017 21.2121 22.375 20.7658 22.58 20.2398C22.7767 19.731 22.9117 19.1495 22.9517 18.2981C22.99 17.4448 23 17.1728 23 15.0001C23 12.8274 22.99 12.5547 22.9517 11.7014C22.9117 10.8497 22.7767 10.2684 22.58 9.7597C22.375 9.23352 22.1017 8.78719 21.6567 8.34251C21.2116 7.89751 20.7666 7.62417 20.24 7.42C19.73 7.22217 19.1483 7.08733 18.2966 7.04833C17.4433 7.0095 17.1716 7 14.9982 7H15.0007ZM14.283 8.44166C14.496 8.44133 14.7337 8.44166 15.0007 8.44166C17.1367 8.44166 17.3899 8.44933 18.2334 8.48766C19.0134 8.52333 19.4368 8.65366 19.7188 8.76316C20.0921 8.90816 20.3583 9.0815 20.6381 9.3615C20.9181 9.64151 21.0914 9.90817 21.2368 10.2815C21.3463 10.5632 21.4768 10.9865 21.5123 11.7665C21.5506 12.6099 21.5589 12.8632 21.5589 14.9982C21.5589 17.1333 21.5506 17.3866 21.5123 18.2299C21.4766 19.0099 21.3463 19.4333 21.2368 19.7149C21.0918 20.0883 20.9181 20.3541 20.6381 20.634C20.3581 20.914 20.0923 21.0873 19.7188 21.2323C19.4371 21.3423 19.0134 21.4723 18.2334 21.508C17.3901 21.5463 17.1367 21.5546 15.0007 21.5546C12.8645 21.5546 12.6114 21.5463 11.768 21.508C10.988 21.472 10.5647 21.3416 10.2825 21.2321C9.90916 21.0871 9.64249 20.9138 9.36249 20.6338C9.08249 20.3538 8.90915 20.0878 8.76382 19.7143C8.65432 19.4326 8.52381 19.0093 8.48831 18.2293C8.44998 17.3859 8.44231 17.1326 8.44231 14.9962C8.44231 12.8599 8.44998 12.6079 8.48831 11.7645C8.52398 10.9845 8.65432 10.5612 8.76382 10.2792C8.90882 9.90584 9.08249 9.63917 9.36249 9.35917C9.64249 9.07917 9.90916 8.90583 10.2825 8.7605C10.5645 8.65049 10.988 8.52049 11.768 8.48466C12.506 8.45133 12.792 8.44133 14.283 8.43966V8.44166ZM19.2711 9.77001C18.7411 9.77001 18.3111 10.1995 18.3111 10.7297C18.3111 11.2597 18.7411 11.6897 19.2711 11.6897C19.8011 11.6897 20.2311 11.2597 20.2311 10.7297C20.2311 10.1997 19.8011 9.77001 19.2711 9.77001ZM15.0008 10.8917C12.7319 10.8917 10.8924 12.7312 10.8924 15.0001C10.8924 17.2689 12.7319 19.1076 15.0008 19.1076C17.2696 19.1076 19.1085 17.2689 19.1085 15.0001C19.1085 12.7312 17.2696 10.8917 15.0008 10.8917ZM15.0007 12.3334C16.4734 12.3334 17.6674 13.5272 17.6674 15.0001C17.6674 16.4727 16.4734 17.6668 15.0007 17.6668C13.5279 17.6668 12.334 16.4727 12.334 15.0001C12.334 13.5272 13.5279 12.3334 15.0007 12.3334Z"
                    fill="#1A82FF"
                  />
                </svg>
              </a>
              <a href="#">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M-0.000244141 14.9999C-0.000244141 6.71567 6.71548 -6.10352e-05 14.9998 -6.10352e-05C23.284 -6.10352e-05 29.9998 6.71567 29.9998 14.9999C29.9998 23.2842 23.284 29.9999 14.9998 29.9999C6.71548 29.9999 -0.000244141 23.2842 -0.000244141 14.9999Z"
                    fill="#1A82FF"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M14.5493 12.1921L14.5808 12.7111L14.0562 12.6475C12.1466 12.4039 10.4784 11.5777 9.06193 10.1901L8.36945 9.50156L8.19108 10.01C7.81336 11.1434 8.05468 12.3404 8.8416 13.1454C9.26128 13.5903 9.16685 13.6538 8.44289 13.389C8.19108 13.3043 7.97074 13.2407 7.94976 13.2725C7.87632 13.3467 8.12813 14.3106 8.32748 14.6919C8.60028 15.2215 9.15636 15.7406 9.76491 16.0477L10.279 16.2914L9.67048 16.302C9.08292 16.302 9.06193 16.3126 9.12489 16.535C9.33473 17.2235 10.1636 17.9544 11.0869 18.2722L11.7374 18.4946L11.1709 18.8336C10.3315 19.3208 9.34522 19.5962 8.35896 19.6174C7.88681 19.628 7.4986 19.6704 7.4986 19.7022C7.4986 19.8081 8.77864 20.4013 9.52359 20.6343C11.7584 21.3228 14.4129 21.0262 16.4065 19.8505C17.8229 19.0137 19.2394 17.3506 19.9004 15.7406C20.2571 14.8826 20.6138 13.3149 20.6138 12.5628C20.6138 12.0755 20.6453 12.012 21.2329 11.4294C21.5791 11.0904 21.9044 10.7197 21.9673 10.6138C22.0722 10.4125 22.0618 10.4125 21.5267 10.5926C20.6348 10.9104 20.5089 10.868 20.9496 10.3913C21.2748 10.0524 21.6631 9.43801 21.6631 9.25794C21.6631 9.22616 21.5057 9.27912 21.3273 9.37445C21.1384 9.48038 20.7188 9.63927 20.404 9.7346L19.8374 9.91467L19.3233 9.56512C19.04 9.37445 18.6413 9.1626 18.4315 9.09905C17.8964 8.95075 17.078 8.97194 16.5953 9.14142C15.2838 9.61808 14.4549 10.8468 14.5493 12.1921Z"
                    fill="#1A82FF"
                  />
                </svg>
              </a>
              <a href="#">
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.1"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M-0.000244141 14.9999C-0.000244141 6.71567 6.71548 -6.10352e-05 14.9998 -6.10352e-05C23.284 -6.10352e-05 29.9998 6.71567 29.9998 14.9999C29.9998 23.2842 23.284 29.9999 14.9998 29.9999C6.71548 29.9999 -0.000244141 23.2842 -0.000244141 14.9999Z"
                    fill="#1A82FF"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M21.2508 9.84327C21.9392 10.0322 22.4814 10.5888 22.6654 11.2957C22.9998 12.5768 22.9998 15.2499 22.9998 15.2499C22.9998 15.2499 22.9998 17.9229 22.6654 19.2042C22.4814 19.9111 21.9392 20.4677 21.2508 20.6567C20.0031 20.9999 14.9998 20.9999 14.9998 20.9999C14.9998 20.9999 9.99639 20.9999 8.74866 20.6567C8.06021 20.4677 7.51803 19.9111 7.33403 19.2042C6.99976 17.9229 6.99976 15.2499 6.99976 15.2499C6.99976 15.2499 6.99976 12.5768 7.33403 11.2957C7.51803 10.5888 8.06021 10.0322 8.74866 9.84327C9.99639 9.49994 14.9998 9.49994 14.9998 9.49994C14.9998 9.49994 20.0031 9.49994 21.2508 9.84327ZM13.4998 12.9999V17.9999L17.4998 15.5L13.4998 12.9999Z"
                    fill="#1A82FF"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-trademark">
          <p className="footer-trademark-content">
            Copyright © 2024, Infer Solutions, Inc. All Rights Reserved.
          </p>
        </div>
        
      </Container>
    </>
  );
};

export default SearchContent;
