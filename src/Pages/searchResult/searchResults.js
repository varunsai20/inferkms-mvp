import React,{useState} from 'react'
import SearchHeader from './components/searchHeader'
import SearchContent from './components/searchContent'
import Annotation from '../Article Page/Annotation'
import { useLocation, useNavigate } from "react-router-dom";
const SearchResults = () => {
  const [selectedArticles, setSelectedArticles] = useState([]);
  const [annotateData, setAnnotateData] = useState([]);
  const [openAnnotate, setOpenAnnotate] = useState(false);
  const location=useLocation()

  return (
    <>
    <SearchHeader setSelectedArticles={setSelectedArticles}
        setAnnotateData={setAnnotateData}
        setOpenAnnotate={setOpenAnnotate}/>
    <SearchContent selectedArticles={selectedArticles}
        setSelectedArticles={setSelectedArticles}
        annotateData={annotateData}
        setAnnotateData={setAnnotateData}
        openAnnotate={openAnnotate}
        setOpenAnnotate={setOpenAnnotate}
        /> 
      
        
    </> 
  )
}

export default SearchResults