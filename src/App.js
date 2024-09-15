import logo from './logo.svg';
import './App.css';
import LandingPage from './Pages/Landing Page/LandingPage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import SearchResults from './Pages/searchResult/searchResults';
import ArticlePage from './Pages/Article Page/ArticlePage';
import ArticleContent from './Pages/Article Page/Components/ArticleContent';


function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
      <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path="/search" element={<SearchResults/>} />
        <Route path="/article/:pmid" element={<ArticlePage/>} />
        </Routes>
      </header>
    </div>
    </Router>
    // <Router>
    // <div className="App">
    //   <header className="App-header">
    //   <Routes>
    //     <Route path="/" element={<ArticleContent/>} />
        
    //     </Routes>
    //   </header>
    // </div>
    // </Router>
  );
}

export default App;
