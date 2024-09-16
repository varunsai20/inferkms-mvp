import React,{useState,useRef,useEffect   } from 'react'
import ReactMarkdown from "react-markdown";
import flash from "../../../images/flash.svg"
import { CircularProgress } from "@mui/material";
import "./ArticleContent.css"
const ArticleQurey = () => {
    const [activeSection, setActiveSection] = useState("Title");
    const [showStreamingSection, setShowStreamingSection] = useState(false);
    const [history, setHistory] = useState([]);
    const endOfMessagesRef = useRef(null);
    const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [chatInput, setChatInput] = useState(true);
  const [loading, setLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState(() => {
      const storedHistory = sessionStorage.getItem("chatHistory");
      return storedHistory ? JSON.parse(storedHistory) : [];
    });
  
    const handleNavigationClick = (section) => {
      setActiveSection(section);
    };

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
          pmid: 29493979,
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
    
          const readStream = () => {
            reader.read().then(({ done, value }) => {
              if (done) {
                setLoading(false);
                sessionStorage.setItem("chatHistory", JSON.stringify(chatHistory));
                return;
              }
    
              const chunk = decoder.decode(value, { stream: true });
              const jsonChunk = JSON.parse(chunk);
              const answer = jsonChunk.answer;
    
              setResponse(answer);
              setChatHistory((prevChatHistory) => {
                const updatedChatHistory = [...prevChatHistory];
                updatedChatHistory[updatedChatHistory.length - 1].response +=
                  answer;
                return updatedChatHistory;
              });
    
              if (endOfMessagesRef.current) {
                endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
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
    
      useEffect(() => {
        const handleBeforeUnload = () => {
          sessionStorage.removeItem("chatHistory");
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      }, []);
    
      useEffect(() => {
        if (endOfMessagesRef.current) {
          endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [chatHistory, history, response]);
      const messagesEndRef = React.useRef(null);
    
  return (
    <>
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
            <div ref={messagesEndRef}></div>
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
            <div ref={messagesEndRef}></div>
            <div className="stream-input">
              <img src={flash} alt="flag-logo" className="stream-flag-logo" />
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
      </>
  )
}

export default ArticleQurey