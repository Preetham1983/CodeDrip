import React, { useEffect, useState } from "react";
import { fetchRepos } from "../services/api";
import RepoCard from "../components/RepoCard";
import { Link } from "react-router-dom";

const Home = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchRepos()
      .then((res) => {
        setRepos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>🧩 Repository Explorer Dashboard</h1>
          <p style={styles.subtitle}>AI-powered codebase analysis and insights</p>
        </div>
        <Link to="/analyze">
          <button style={styles.btn}>+ Analyze New Repo</button>
        </Link>
      </div>

      {loading ? (
        <div style={styles.loading}>
          <p>Loading repositories...</p>
        </div>
      ) : repos.length === 0 ? (
        <div style={styles.emptyState}>
          <h2>📂 No repositories analyzed yet</h2>
          <p>Start by analyzing your first GitHub repository</p>
          <Link to="/analyze">
            <button style={styles.btn}>Analyze Your First Repo</button>
          </Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {repos.map((repo) => (
            <RepoCard key={repo._id} repo={repo} />
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    margin: "0 0 5px 0",
  },
  subtitle: {
    color: "#666",
    margin: 0,
  },
  btn: {
    backgroundColor: "#000000ff",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "bold",
    transition: "transform 0.2s",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    color: "#666",
  },
  emptyState: {
    textAlign: "center",
    padding: "80px 20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    marginTop: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
};

export default Home;