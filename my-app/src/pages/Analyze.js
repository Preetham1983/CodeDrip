import React, { useState } from "react";
import { addRepo } from "../services/api";
import { useNavigate } from "react-router-dom";

const Analyze = () => {
  
  const [gitUrl, setGitUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!gitUrl.trim()) {
      alert("Please enter a valid Git repository URL.");
      return;
    }

    setLoading(true);
    try {
      await addRepo({ gitUrl });
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Failed to analyze repository. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔍 Analyze a New Repository</h1>
        <p style={styles.subtitle}>
          Enter your repository details below to generate insights using the
          Code Research Agent.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Enter GitHub Repository URL"
            value={gitUrl}
            onChange={(e) => setGitUrl(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.btn} disabled={loading}>
            {loading ? (
              <span style={styles.loader}>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            ) : (
              "Analyze Repository"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// 🎨 Styling
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "start",
    justifyContent: "center",
    background:
      "linear-gradient(135deg, #000000ff 0%, #000000ff 35%, #000000ff 100%)",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: "12px",
    padding: "40px",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
    maxWidth: "480px",
    width: "100%",
    textAlign: "center",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#111827",
  },
  subtitle: {
    fontSize: "15px",
    color: "#4b5563",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    outline: "none",
    transition: "border 0.2s ease",
  },
  btn: {
    backgroundColor: "#000000ff",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.3s ease, transform 0.2s ease",
  },
  btnHover: {
    backgroundColor: "#000000ff",
  },
  loader: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "3px",
    fontSize: "18px",
    animation: "fade 1.2s infinite",
  },
};

export default Analyze;