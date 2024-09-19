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
  const [query, setQuery] = useState(""); // Initialize with empty string
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const endOfMessagesRef = useRef(null); // Ref to scroll to the last message
  const [chatHistory, setChatHistory] = useState(() => {
    const storedHistory = sessionStorage.getItem("chatHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  const [showStreamingSection, setShowStreamingSection] = useState(false);
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

  const handleAskClick = async () => {
    if (!query) {
      alert("Please enter a query");
      return;
    }

    setShowStreamingSection(true);
    setChatInput(false);
    setLoading(true);

    const newChatEntry = { query, response: "" };
    setChatHistory((prevChatHistory) => [...prevChatHistory, newChatEntry]);

    const bodyData = JSON.stringify({
      question: query,
      pmid: pmid,
    });

    try {
      const response = await fetch("http://13.127.207.184:80/generateanswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: bodyData,
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = ""; // Buffer to store incoming chunks of data

      setQuery(""); // Clear the input after submission

      const readStream = async () => {
        let done = false;

        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;

          if (value) {
            // Append the decoded chunk to the buffer
            buffer += decoder.decode(value, { stream: true });
            console.log(buffer);
            // While there is a complete JSON object in the buffer
            while (buffer.indexOf('{') !== -1 && buffer.indexOf('}') !== -1) {
              let start = buffer.indexOf('{');
              let end = buffer.indexOf('}', start); // Ensure this is after the start
              if (start !== -1 && end !== -1) {
                // Extract the complete JSON object from the buffer
                const jsonChunk = buffer.slice(start, end + 1);
                buffer = buffer.slice(end + 1); // Keep the remaining buffer for the next chunk

                try {
                  const parsedData = JSON.parse(jsonChunk); // Try parsing the extracted JSON
                  const answer = parsedData.answer;

                  // Update the chat history with the new response
                  setChatHistory((chatHistory) => {
                    const updatedChatHistory = [...chatHistory];
                    const lastEntryIndex = updatedChatHistory.length - 1;

                    if (lastEntryIndex >= 0) {
                      updatedChatHistory[lastEntryIndex] = {
                        ...updatedChatHistory[lastEntryIndex],
                        response:
                          updatedChatHistory[lastEntryIndex].response + answer,
                      };
                    }

                    return updatedChatHistory;
                  });

                  setResponse((prev) => prev + answer);

                  // Scroll to the bottom of the chat history
                  if (endOfMessagesRef.current) {
                    endOfMessagesRef.current.scrollIntoView({
                      behavior: "smooth",
                    });
                  }
                } catch (error) {
                  console.error("Error parsing JSON chunk:", error);
                  console.log("Chunk content:", jsonChunk);
                  // Continue reading the stream
                }
              } else {
                // No more complete JSON objects in the buffer; break out of the loop
                break;
              }
            }
          }
        }

        setLoading(false);
        sessionStorage.setItem("chatHistory", JSON.stringify(chatHistory));
      };

      readStream();
    } catch (error) {
      console.error("Error fetching or reading stream:", error);
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleAskClick();
    }
  };

  const handleBackClick = () => {
    navigate("/search", { state: { data, searchTerm } });
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
          <a href="/"><img
            src="https://www.infersol.com/wp-content/uploads/2020/02/logo.png"
            alt="Infer Logo"
          />
          </a>
        </div>
        <nav className="nav-menu">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a href="">Why Infer?</a>
            </li>
            <li>
              <a href="">FAQs</a>
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
              {response ? articleData.TITLE.slice(0,40)+"...." : ""}
            </li>
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
                  !predefinedOrder.includes(key) &&
                  !key.toLowerCase().includes("display") && (
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
