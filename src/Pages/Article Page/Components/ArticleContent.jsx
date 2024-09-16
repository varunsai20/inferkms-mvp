import React, { useState, useEffect,useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ArticleContent.css"
import { Container, Typography, Paper, Box, Grid } from '@mui/material';
import flag from "../../../images/flash.svg";
import Arrow from "../../../images/Arrow-left.svg";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { CircularProgress } from "@mui/material";

const ArticleContent = () => {

  const { pmid } = useParams(); // Get the PMID from the URL
  const location = useLocation(); // Access the passed state
  const { data } = location.state || { data: [] }; // Default to an empty array if no data
  const searchTerm = location.state?.SEARCHTERM || '';
  const [articleData, setArticleData] = useState(null);
  const [activeSection, setActiveSection] = useState("Title");
  const [query, setQuery] = useState();
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null);
  const [chatHistory, setChatHistory] = useState(() => {
    const storedHistory = sessionStorage.getItem('chatHistory');
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  const [showStreamingSection, setShowStreamingSection] = useState(false);
  const [history, setHistory] = useState([]);
  const [chatInput, setChatInput] = useState(true);
  console.log(articleData)
  console.log(data.articles)
  
  useEffect(() => {
    // Check if the data and articles exist
    if (data && data.articles) {
      // Find the article that matches the PMID
      const article = data.articles.find((item) => item.PMID === pmid);

      if (article) {
        setArticleData(article); // Set the matched article data
      } else {
        console.error('Article not found for the given PMID');
      }
    } else {
      console.error('Data or articles not available');
    }
  }, [pmid, data]);;
  const handleAskClick = () => {
    if (!query) {
      alert("Please enter a query");
      return;
    }
    setHistory([...history, query]);
    setShowStreamingSection(true);
    setChatInput(false);
    setLoading(true);

    const newChatEntry = { query, response: "" };
    setChatHistory((prevChatHistory) => [...prevChatHistory, newChatEntry]);

    const bodyData = JSON.stringify({
      question: query,
      pmid: pmid,
    });

    fetch("http://13.127.207.184:80/generateanswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: bodyData,
    }).then((response) => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      setQuery()
      const readStream = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            setLoading(false);
            sessionStorage.setItem("chatHistory", JSON.stringify(chatHistory));
            return;
          }
      
          const chunk = decoder.decode(value, { stream: true });
      
          try {
            // Try parsing the chunk as JSON
            const jsonChunk = JSON.parse(chunk);
            const answer = jsonChunk.answer;
      
            setResponse(answer);
            setChatHistory((prevChatHistory) => {
              const updatedChatHistory = [...prevChatHistory];
              updatedChatHistory[updatedChatHistory.length - 1].response += answer;
              return updatedChatHistory;
            });
      
            if (endOfMessagesRef.current) {
              endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
            console.log("Chunk content:", chunk); // Log the chunk to inspect the content
          }
      
          readStream();
        });
      };
      

      readStream();
    });
  };
  console.log(chatHistory);
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAskClick();
    }
  };


  const handleNavigationClick = (section) => {
    setActiveSection(section);
  };
  const navigate = useNavigate(); // useNavigate hook for programmatic navigation

  const handleBackClick = () => {
    navigate("/search", { state: { data, searchTerm } });  };

  const italicizeTerm = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <i key={index} className="italic" color="primary" display="flex">
          {part}
        </i>
      ) : (
        part
      )
    );
  };

  // Predefined field order
  const predefinedOrder = ['PMID', 'TITLE', 'INTRODUCTION', 'METHODS', 'RESULTS', 'CONCLUSION', 'KEYWORDS'];

  // Create a mapping between data fields and user-friendly labels
  const fieldMappings = {
    TITLE: 'Title',
    INTRODUCTION: 'Purpose/Background',
    METHODS: 'Methods',
    RESULTS: 'Results/Findings',
    CONCLUSION: 'Conclusion',
    KEYWORDS: 'Keywords',
    PMID: 'PMID',
  };

  return (

    <div className="container">
      <header className="header">
        <div className="logo">
          <img src="https://www.infersol.com/wp-content/uploads/2020/02/logo.png                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       " alt="Infer Logo" />
        </div>
        <nav className="nav-menu">
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#why-infer">Why Infer?</a>
            </li>
            <li>
              <a href="#faqs">FAQs</a>
            </li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <button className="signup">Sign up</button>
          <button className="login">Login</button>
        </div>
      </header>

      <div className="content">
        <div className="article-pagination">
          <h5>Page navigation</h5>
          <ul>
            <li className={activeSection === "Title" ? "active" : ""}>
              <a
                id="pagination-a"
                href="#Title"
                rel="Title-page"
                onClick={() => handleNavigationClick("Title")}
              >
                Title & Author
              </a>
            </li>
            <li className={activeSection === "Abstract" ? "active" : ""}>
              <a
                id="pagination-a"
                href="#Abstract"
                rel="Abstract-page"
                onClick={() => handleNavigationClick("Abstract")}
              >
                Abstract
              </a>
            </li>
            <li className={activeSection === "Conflict" ? "active" : ""}>
              <a
                id="pagination-a"
                href="#Conflict"
                rel="Conflict-page"
                onClick={() => handleNavigationClick("Conflict")}
              >
                Conflict of Interest
              </a>
            </li>
            <li className={activeSection === "Similar" ? "active" : ""}>
              <a
                id="pagination-a"
                href="#Similar"
                rel="Similar-page"
                onClick={() => handleNavigationClick("Similar")}
              >
                Similar articles
              </a>
            </li>
            <li className={activeSection === "Cited" ? "active" : ""}>
              <a
                id="pagination-a"
                href="#Cited"
                rel="Cited-page"
                onClick={() => handleNavigationClick("Cited")}
              >
                Cited by
              </a>
            </li>
            <li className={activeSection === "Related" ? "active" : ""}>
              <a
                id="pagination-a"
                href="#Related"
                rel="Related-page"
                onClick={() => handleNavigationClick("Related")}
              >
                Related Information
              </a>
            </li>
          </ul>
        </div>

        <div className="content">
        {/* Check if articleData is available, if not display "Data not found" */}
        {articleData ? (
          <div className="article-content">
            <div className="title">
              <img src={Arrow} alt="Arrow-left-icon" onClick={handleBackClick} />
              <p>{articleData.TITLE}</p>
            </div>

            <div className="meta">
              {/* Loop through predefined fields */}
              {predefinedOrder.map((key) => (
                      articleData[key] && (
                        <Typography key={key} variant="subtitle1" className="typographyRow-articles">
                          <strong>{fieldMappings[key] || key}:</strong> {italicizeTerm(articleData[key])}
                        </Typography>
                      )
                    ))}

                    {/* Render any additional fields not in predefinedOrder */}
                    {Object.keys(articleData).map((key) => 
                      !predefinedOrder.includes(key) && (
                        <Typography key={key} variant="subtitle1" className="typographyRow-articles">
                          <strong>{fieldMappings[key] || key}:</strong> {italicizeTerm(articleData[key])}
                        </Typography>
                      )
                    )}
            </div>
          </div>
        ) : (
          <div className="data-not-found">
            <p>Data not found for the given PMID</p>
          </div>
        )}
        
      </div>
      
      </div>
      {showStreamingSection && (
        <div className="streaming-section">
          <div className="history-pagination">
            <h5>History</h5>
            <ul>
              {history.map((item, index) => (
                <li key={index}>{item.slice(0, 20)}...</li>
              ))}
            </ul>
          </div>
          <div className="streaming-content">
            
            {chatHistory.map((chat, index) => (
              <div key={index}>
                <div className="query-asked">
                  <span>{chat.query}</span>
                </div>
                <div className="response" style={{ textAlign: "left" }}>
                  {/* <span>{chat.response}</span> */}
                  <ReactMarkdown>{chat.response}</ReactMarkdown>
                </div>
              </div>
            ))}
            
            <div className="stream-input">
              <img src={flag} alt="flag-logo" className="stream-flag-logo" />
              <input
                type="text"
                placeholder="Ask anything..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button onClick={handleAskClick}>
                {loading ? <CircularProgress size={24} color="white" /> : "Ask"}
              </button>
            </div>
          </div>
        </div>
      )}
      {chatInput && (
        <div className="chat-input">
          <img src={flag} alt="flag-logo" className="flag-logo" />
          <input
            type="text"
            placeholder="Ask anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleAskClick}>Ask</button>
        </div>
      )}
    </div>
  );
};

export default ArticleContent;
