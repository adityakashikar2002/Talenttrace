import React, { useState } from "react";
import axios from "axios";
import "./App.css";  // Import the CSS file

function App() {
  const [files, setFiles] = useState([]);
  const [jobRequirements, setJobRequirements] = useState({
    skills: "",
    experience: "",
  });
  const [results, setResults] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobRequirements({ ...jobRequirements, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let file of files) {
      formData.append("files", file);
    }
    formData.append("job_requirements", JSON.stringify(jobRequirements));

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData);
      setResults(response.data.data);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  // Function to handle downloading the report
  const handleDownload = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/download", {
        responseType: "blob", // Ensure the file is returned as a blob
      });

      // Create a temporary link to trigger the download
      const blob = new Blob([response.data], { type: "application/vnd.ms-excel" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "resume_analysis_report.xlsx"; // Set the filename
      link.click();
    } catch (error) {
      console.error("Error downloading the report:", error);
    }
  };

  return (
    <div className="App">
      <img src="/a-logo.png" alt="Resume Analyzer Logo" className="App-logo" 
  />
      <form onSubmit={handleSubmit}>
        <label>
          Upload Resumes:
          <input type="file" multiple onChange={handleFileChange} />
        </label>
        <label>
          Required Skills (comma-separated):
          <input
            type="text"
            name="skills"
            value={jobRequirements.skills}
            onChange={handleInputChange}
          />
        </label>

        {/* Button Container */}
        <div className="button-container">
          <button type="submit">Analyze Resumes</button>
          <button type="button" onClick={handleDownload}>
            Download Report
          </button>
        </div>
      </form>



      <h2>RESULTS</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Skills</th>
            <th>LinkedIn</th>
            <th>GitHub</th>
            <th>Fit Score</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.Name}</td>
              <td>{result.Email}</td>
              <td>{result.Phone}</td>
              <td>{result.Skills}</td>
              <td>{result.LinkedIn}</td>
              <td>{result.GitHub}</td>
              <td>{result.FitScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
