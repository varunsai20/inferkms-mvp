import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ArticleContent.css";
import { Typography } from "@mui/material";
import flag from "../../../images/flash.svg";
import Arrow from "../../../images/Arrow-left.svg";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { CircularProgress } from "@mui/material";

const ArticleContent = () => {
  const { pmid } = useParams();
  const location = useLocation();
  const { data } = location.state || { data: [] };
  const searchTerm = location.state?.SEARCHTERM || "";
  const [articleData, setArticleData] = useState(null);
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("Title");
  const [query, setQuery] = useState(""); // Initialize with empty string
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const endOfMessagesRef = useRef(null); // Ref to scroll to the last message
  const [chatHistory, setChatHistory] = useState(() => {
    const storedHistory = sessionStorage.getItem("chatHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  const [showStreamingSection, setShowStreamingSection] = useState(false);
  const [combinedQuery, setCombinedQuery] = useState(() => {
    const storedCombinedQuery = sessionStorage.getItem("combinedQuery");
    return storedCombinedQuery ? storedCombinedQuery : ""; // Start with the previous combined query or an empty string
  });
  const [chatInput, setChatInput] = useState(true);
  console.log(showStreamingSection);

  useEffect(() => {
    if (data && data.articles) {
      const article = data.articles.find((item) => item.PMID === pmid);
      if (article) {
        setArticleData(article);
      } else {
        console.error("Article not found for the given PMID");
      }
    } else {
      console.error("Data or articles not available");
    }
  }, [pmid, data]);

  useEffect(() => {
    // Scroll to the bottom whenever chat history is updated
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]); // This will trigger when chatHistory changes

  const handleAskClick = () => {
    if (!query) {
      alert("Please enter a query");
      return;
    }

    // Combine the current query with the previous queries
    setCombinedQuery((prevCombinedQuery) => {
      const newCombinedQuery = prevCombinedQuery
        ? `${prevCombinedQuery} || ${query}`
        : query; // Add "||" between queries
      sessionStorage.setItem("combinedQuery", newCombinedQuery); // Persist combined query
      return newCombinedQuery;
    });

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
      
      setQuery(""); // Clear the input after submission
      const readStream = () => {
        reader.read().then(({ done, value }) => {
          if (done) {
            setLoading(false);
            sessionStorage.setItem("chatHistory", JSON.stringify(chatHistory));
            return;
          }

          const chunk = decoder.decode(value, { stream: true });

          try {
            const jsonChunk = JSON.parse(chunk);
            const answer = jsonChunk.answer;
            console.log(answer)
            setResponse(answer);
            setChatHistory((prevChatHistory) => {
              const updatedChatHistory = [...prevChatHistory];
              updatedChatHistory[updatedChatHistory.length - 1].response +=
                answer;
              return updatedChatHistory;
            });
            if (endOfMessagesRef.current) {
              endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' });
            }
          } catch (error) {
            console.error("Error parsing JSON:", error);
            console.log("Chunk content:", chunk);
          }

          readStream();
        });
      };

      readStream();
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAskClick();
    }
  };

  const handleBackClick = () => {
    navigate("/search");
  };

  const italicizeTerm = (text) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, "gi");
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

  const predefinedOrder = [
    "PMID",
    "TITLE",
    "INTRODUCTION",
    "METHODS",
    "RESULTS",
    "CONCLUSION",
    "KEYWORDS",
  ];

  const fieldMappings = {
    TITLE: "Title",
    INTRODUCTION: "Purpose/Background",
    METHODS: "Methods",
    RESULTS: "Results/Findings",
    CONCLUSION: "Conclusion",
    KEYWORDS: "Keywords",
    PMID: "PMID",
  };

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <img
            src="https://www.infersol.com/wp-content/uploads/2020/02/logo.png"
            alt="Infer Logo"
          />
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
        <div className="history-pagination">
          <h5>History</h5>
          <ul>
            <li>
              {combinedQuery ? combinedQuery.split(" || ")[0] : ""}
              ...
            </li>
            {/* Only display the first query */}
          </ul>
        </div>
        {articleData ? (
          <div className="article-content">
            <div className="title">
              <img
                src={Arrow}
                alt="Arrow-left-icon"
                onClick={handleBackClick}
              />
              <p>{articleData.TITLE}</p>
            </div>

            <div className="meta">
              {predefinedOrder.map(
                (key) =>
                  articleData[key] && (
                    <Typography
                      key={key}
                      variant="subtitle1"
                      className="typographyRow-articles"
                    >
                      <strong>{fieldMappings[key] || key}:</strong>{" "}
                      {italicizeTerm(articleData[key])}
                    </Typography>
                  )
              )}
              {Object.keys(articleData).map(
                (key) =>
                  !predefinedOrder.includes(key) && (
                    <Typography
                      key={key}
                      variant="subtitle1"
                      className="typographyRow-articles"
                    >
                      <strong>{fieldMappings[key] || key}:</strong>{" "}
                      {italicizeTerm(articleData[key])}
                    </Typography>
                  )
              )}
              {showStreamingSection && (
                <div className="streaming-section">
                  <div className="streaming-content">
                    {chatHistory.map((chat, index) => (
                      <div key={index}>
                        <div className="query-asked">
                          <span>{chat.query}</span>
                        </div>
                        
                        <div
                          className="response"
                          style={{ textAlign: "left" }}
                        >
                          <ReactMarkdown>{chat.response}</ReactMarkdown>
                          <div ref={endOfMessagesRef} />
                        </div>
                        
                      </div>
                    ))}
                    <div className="stream-input">
                      <img
                        src={flag}
                        alt="flag-logo"
                        className="stream-flag-logo"
                      />
                      <input
                        type="text"
                        placeholder="Ask anything..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <button onClick={handleAskClick}>
                        {loading ? (
                          <CircularProgress size={24} color="white" />
                        ) : (
                          "Ask"
                        )}
                      </button>
                    </div>
                    {/* This div will act as the reference for scrolling */}
                    
                  </div>
                  
                </div>
                
              )}
            </div>
          </div>
        ) : (
          <div className="data-not-found">
            <p>Data not found for the given PMID</p>
          </div>
        )}
        {chatInput && (
          <div className="stream-input">
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
    </div>
  );
};

export default ArticleContent;
