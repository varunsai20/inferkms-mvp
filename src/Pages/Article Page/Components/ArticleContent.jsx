import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./ArticleContent.css";
import { Typography } from "@mui/material";
import flag from "../../../images/flash.svg";
import Arrow from "../../../images/Arrow-left.svg";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { CircularProgress } from "@mui/material";
import edit from "../../../images/16px.svg";
import annotate from "../../../images/task-square.svg";
import notesicon from "../../../images/note-2.svg";

const ArticleContent = () => {
  const { pmid } = useParams();
  const location = useLocation();
  const { data } = location.state || { data: [] };
  const searchTerm = location.state?.SEARCHTERM || "";
  const [articleData, setArticleData] = useState(null);
  const navigate = useNavigate();
  const [query, setQuery] = useState(""); // Initialize with empty string
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const endOfMessagesRef = useRef(null); // Ref to scroll to the last message
  const [chatHistory, setChatHistory] = useState(() => {
    const storedHistory = sessionStorage.getItem("chatHistory");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });
  const [showStreamingSection, setShowStreamingSection] = useState(false);
  // const [chatInput, setChatInput] = useState(true);
  const [openAnnotate, setOpenAnnotate] = useState(false);
  const [openNotes, setOpenNotes] = useState(false);
  const [activeSection, setActiveSection] = useState("Title");
  const contentRef = useRef(null); // Ref to target the content div
  const [contentWidth, setContentWidth] = useState(); // State for content width

  // const handleResize = (event) => {
  //   const newWidth = event.target.value; // Get the new width from user interaction
  //   setWidth1(newWidth);
  //   setWidth2(100 - newWidth); // Second div takes up the remaining width
  // };
  useEffect(() => {
    // Access the computed width of the content div
    if (contentRef.current) {
      const width = contentRef.current.offsetWidth; // Get the width of the content div in pixels
      setContentWidth(`${width}px`); // Update the contentWidth state with the computed width
    }
  }, [openAnnotate]);
  useEffect(() => {
    // Access the computed width of the content div
    if (contentRef.current) {
      const width = contentRef.current.offsetWidth; // Get the width of the content div in pixels
      setContentWidth(`${width}px`); // Update the contentWidth state with the computed width
    }
  }, [openNotes]);
  console.log(showStreamingSection);

  useEffect(() => {
    if (data && data.articles) {
      console.log("PMID from state data:", typeof(data.articles.map(article => article.pmid)));
      console.log(typeof(pmid))
      // console.log(pmid)
      const article = data.articles.find((article) => {
        // Example: If pmid is stored as `article.pmid.value`, modify accordingly
        const articlePmid = article.pmid.value || article.pmid; // Update this line based on the actual structure of pmid
        return String(articlePmid) === String(pmid);
      });
      console.log(article)
      if (article) {
        setArticleData(article);
      } else {
        console.error("Article not found for the given PMID");
      }
    } else {
      console.error("Data or articles not available");
    }
  }, [pmid, data]);
  console.log(articleData)
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
    // setChatInput(false);
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
            while (buffer.indexOf("{") !== -1 && buffer.indexOf("}") !== -1) {
              let start = buffer.indexOf("{");
              let end = buffer.indexOf("}", start); // Ensure this is after the start
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
  const handleNavigationClick = (section) => {
    setActiveSection(section);
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
  // const contentWidth = "43.61%";
  // const searchBarwidth = "62%";
  // const handleWidth = (newWidth) => {
  //   //const newWidth = parseInt(event.target.value);
  //   setSearchWidth(newWidth);
  // };
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
  // Dynamically render the nested content in order, removing numbers, and using keys as side headings
  // Dynamically render the nested content in order, removing numbers, and using keys as side headings
  const renderContentInOrder = (content, isAbstract = false) => {
    // Sort keys by their numeric value and ignore the numbers when rendering
    const sortedKeys = Object.keys(content).sort((a, b) => parseInt(a) - parseInt(b));
  
    return sortedKeys.map((sectionKey) => {
      const sectionData = content[sectionKey];
  
      // Remove numbers from the section key (e.g., "1: Background" -> "Background")
      const cleanedSectionKey = sectionKey.replace(/^\d+[:.]?\s*/, '');  // This will remove any numeric prefixes and trailing punctuation
  
      if (typeof sectionData === "object") {
        // If nested object, display the key as a heading and recursively render content
        return (
          <div key={sectionKey} style={{ marginBottom: '20px' }}>
            <Typography variant="h6" gutterBottom>{cleanedSectionKey}</Typography>
            {renderContentInOrder(sectionData)} {/* Recursively render nested objects as subheadings */}
          </div>
        );
      } else {
        // Render the content using ReactMarkdown for abstract or normal content
        return (
          <div key={sectionKey} style={{ marginBottom: '10px' }}>
            <Typography variant="h6">{cleanedSectionKey}</Typography>
            <ReactMarkdown>{sectionData}</ReactMarkdown> {/* Render content as markdown */}
          </div>
        );
      }
    });
  };

    // const predefinedOrder = [
    //   "pmid",
    //   "body_content",
    //   "abstract_content",
    //   "pmc",
    //   "publication_type",
    //   "publication_date",
    // ];

    // const fieldMappings = {
    //   TITLE: "Title",
    //   INTRODUCTION: "Purpose/Background",
    //   METHODS: "Methods",
    //   RESULTS: "Results/Findings",
    //   CONCLUSION: "Conclusion",
    //   KEYWORDS: "Keywords",
    //   PMID: "PMID",
    // };

  return (
    <>
      <div className="container">
        <header className="header">
          <div className="logo">
            <a href="/">
              <img
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
                <a href="#why-infer">Why Infer?</a>
              </li>
              <li>
                <a href="#FAQ's">FAQs</a>
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
                <a
                  href="#History"
                  onClick={() => handleNavigationClick("History")}
                >
                  {response ? articleData.article_title.slice(0, 40) + "...." : ""}

                  <img src={edit} alt="Edit-logo" />
                </a>
              </li>
              {/* <li>
                Tell me More...
                <img src={edit} alt="Edit-logo" />
              </li>
              <li>
                Summarized Articles <img src={edit} alt="Edit-logo" />
              </li> */}
              <li className={activeSection === "Similar" ? "active" : ""}>
                <a
                  href="#Similar"
                  onClick={() => handleNavigationClick("Similar")}
                >
                  Similar Articles
                  <img src={edit} alt="Edit-logo" />
                </a>
              </li>

              <li className={activeSection === "Related" ? "active" : ""}>
                <a
                  href="#Related"
                  onClick={() => handleNavigationClick("Related")}
                >
                  Related Information
                  <img src={edit} alt="Edit-logo" />
                </a>
              </li>
            </ul>
          </div>

          {articleData ? (
            <div
              className="article-content"
              ref={contentRef}
              // style={{ width: `43.61%` }}
              // value={searchWidth}
              // onChange={handleWidth}
            >
              <div className="title">
                <img
                  src={Arrow}
                  alt="Arrow-left-icon"
                  onClick={handleBackClick}
                />
                <p>{articleData.article_title}</p>
              </div>
              <div className="meta">
                <div style={{display:"flex",flexDirection:"column",fontSize:"14px",color:"grey",marginBottom:"5px"}}>
                <span>PMID : <strong style={{color:"black"}}>{articleData.pmid}</strong></span>
                <span>PMC : <strong style={{color:"black"}}>{articleData.pmc}</strong></span>
                <span>Publication Date : <strong style={{color:"black"}}>{articleData.publication_date}</strong></span>
                <span>Publication Type : <strong style={{color:"black"}}>{articleData.publication_type}</strong></span>
                  </div>
                
              {articleData.abstract_content && (
                  <>
                    <Typography variant="h4" gutterBottom>Abstract</Typography>
                    {renderContentInOrder(articleData.abstract_content, true)}
                  </>
                )}
                {articleData.body_content && renderContentInOrder(articleData.body_content)}

                
              
                
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

          <div className="right-aside">
            {openAnnotate && (
              <div className="annotate">
                <div className="tables">
                  <p style={{ textAlign: "start" }}>Annotations</p>
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
                onClick={() => {
                  handleAnnotate();
                  // handleResize();
                }}
              >
                <img src={annotate} alt="annotate-icon" />
              </div>
              <div
                className={`notes-icon ${openNotes ? "open" : "closed"}`}
                onClick={() => {
                  handleNotes();
                  // handleResize();
                }}
              >
                <img src={notesicon} alt="notes-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="stream-input" style={{ width: contentWidth }}>
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

    </>

  );
};

export default ArticleContent;
