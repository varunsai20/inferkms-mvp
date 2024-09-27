import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from "react-router-dom";

const Annotation = ({ openAnnotate, annotateData, searchTerm }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pmid: pmidFromUrl } = useParams(); // Extract pmid from the URL
  const [expandedPmids, setExpandedPmids] = useState({}); // Track which PMIDs are expanded
  const [expandedTexts, setExpandedTexts] = useState({});
  const { data } = location.state || { data: [] };

  useEffect(() => {
    // Reset expandedTexts when openAnnotate changes
    if (openAnnotate) {
      setExpandedTexts({}); // Resets all expanded texts to the collapsed (sliced) state
    }
  }, [openAnnotate]);

  const handleNavigate = (pmid) => {
    navigate(`/article/${pmid}`, { state: { data: data, searchTerm, annotateData: annotateData } });
  };
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
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
    let filteredAnnotateData = annotateData;

    // If on article page, filter the data for the specific pmid from the URL
    if (location.pathname.startsWith('/article') && pmidFromUrl) {
      filteredAnnotateData = annotateData.filter(entry => entry[pmidFromUrl]);
    }

    return filteredAnnotateData.map((entry) =>
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
            <td style={{ paddingLeft: 0 }}>
              <button onClick={() => toggleExpandPmid(pmid)} style={{ paddingLeft: 4 }}>
                {isExpanded ? '▼' : '▶'}
              </button>
              <a style={{ color: "#1a82ff", fontWeight: 600, cursor: "pointer" }} onClick={() => handleNavigate(pmid)}>{pmid}</a>
            </td>
            <td>{annotationScore}</td>
            <td>{firstType && firstType.length > 25 ? `${capitalizeFirstLetter(firstType.slice(0, 25))}` : capitalizeFirstLetter(firstType)}</td>
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
              <td>{type.length > 25 ? `${capitalizeFirstLetter(type.slice(0, 25))}` : capitalizeFirstLetter(type)}</td>
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
    <div className="search-tables">
      <div style={{ padding: "3%", background: "#fff", borderRadius: "16px" }}>
        <p style={{ textAlign: "start" }}>Annotations</p>
      </div>
      <div className="search-Annotate-tables">
        <table>
          <thead>
            <tr className="search-table-head">
              <th style={{ width: '23%' }}>PMID</th>
              <th style={{ width: '12%' }}>Score</th>
              <th style={{ width: '20%' }}>Type</th>
              <th style={{ width: '40%' }}>Text</th>
            </tr>
          </thead>
          <tbody>
            {renderAnnotations()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Annotation;
