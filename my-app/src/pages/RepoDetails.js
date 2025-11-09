import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const RepoDetails = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    axios
      .get(`YOUR-BACKEND-DEPLOY-URL/api/repos/${id}`)
      .then((res) => {
        setRepo(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div style={styles.loading}>Loading repository details...</div>;
  }

  if (!repo) {
    return (
      <div style={styles.error}>
        <h2>Repository not found</h2>
        <Link to="/">← Back to Home</Link>
      </div>
    );
  }

  const getHealthColor = (score) => {
    if (score >= 80) return "#4caf50";
    if (score >= 60) return "#ff9800";
    return "#f44336";
  };

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backButton}>
        ← Back to Dashboard
      </Link>

      {/* Repository Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>{repo.basic?.fullName || repo.name}</h1>
          <p style={styles.description}>
            {repo.basic?.description || "No description"}
          </p>
        </div>
        
        {/* Button Group for GitHub and Q&A */}
        <div style={styles.buttonGroup}>
          <a
            href={repo.gitUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.githubButton}
          >
            View on GitHub →
          </a>
          <button
            style={styles.qaButton}
            onClick={() => navigate(`/repo/${id}/qa`)}
          >
            ❓ Ask Questions
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>⭐ {repo.basic?.stars || 0}</div>
          <div style={styles.statLabel}>Stars</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>🍴 {repo.basic?.forks || 0}</div>
          <div style={styles.statLabel}>Forks</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>👁️ {repo.basic?.watchers || 0}</div>
          <div style={styles.statLabel}>Watchers</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>🐛 {repo.basic?.openIssues || 0}</div>
          <div style={styles.statLabel}>Open Issues</div>
        </div>
      </div>

      {/* Health Score Section */}
      {repo.health && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📊 Repository Health</h2>
          <div style={styles.healthContainer}>
            <div style={styles.healthScore}>
              <div
                style={{
                  ...styles.scoreCircle,
                  borderColor: getHealthColor(repo.health.score),
                }}
              >
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: "bold",
                    color: getHealthColor(repo.health.score),
                  }}
                >
                  {repo.health.score}
                </div>
                <div style={{ fontSize: "1rem", color: "#666" }}>/ 100</div>
              </div>
            </div>

            <div style={styles.healthMetrics}>
              <div style={styles.metricCard}>
                <h4>Commit Activity</h4>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      repo.health.metrics.commitActivity.status === "Healthy"
                        ? "#e8f5e9"
                        : repo.health.metrics.commitActivity.status === "Warning"
                        ? "#fff3e0"
                        : "#ffebee",
                    color:
                      repo.health.metrics.commitActivity.status === "Healthy"
                        ? "#4caf50"
                        : repo.health.metrics.commitActivity.status === "Warning"
                        ? "#ff9800"
                        : "#f44336",
                  }}
                >
                  {repo.health.metrics.commitActivity.status}
                </span>
                <p>{repo.health.metrics.commitActivity.message}</p>
              </div>

              <div style={styles.metricCard}>
                <h4>Issue Health</h4>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      repo.health.metrics.issueHealth.status === "Healthy"
                        ? "#e8f5e9"
                        : "#fff3e0",
                    color:
                      repo.health.metrics.issueHealth.status === "Healthy"
                        ? "#4caf50"
                        : "#ff9800",
                  }}
                >
                  {repo.health.metrics.issueHealth.status}
                </span>
                <p>{repo.health.metrics.issueHealth.message}</p>
                <div style={styles.metricStats}>
                  <span>Open: {repo.health.metrics.issueHealth.open}</span>
                  <span>Closed: {repo.health.metrics.issueHealth.closed}</span>
                </div>
              </div>

              <div style={styles.metricCard}>
                <h4>Pull Requests</h4>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      repo.health.metrics.prStatus.status === "Healthy"
                        ? "#e8f5e9"
                        : "#fff3e0",
                    color:
                      repo.health.metrics.prStatus.status === "Healthy"
                        ? "#4caf50"
                        : "#ff9800",
                  }}
                >
                  {repo.health.metrics.prStatus.status}
                </span>
                <p>{repo.health.metrics.prStatus.message}</p>
              </div>

              <div style={styles.metricCard}>
                <h4>Contributors</h4>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor:
                      repo.health.metrics.contributorHealth.status === "Healthy"
                        ? "#e8f5e9"
                        : "#fff3e0",
                    color:
                      repo.health.metrics.contributorHealth.status === "Healthy"
                        ? "#4caf50"
                        : "#ff9800",
                  }}
                >
                  {repo.health.metrics.contributorHealth.count}
                </span>
                <p>{repo.health.metrics.contributorHealth.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trends Section */}
      {repo.trends && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📈 Trends & Activity</h2>
          <div style={styles.trendsGrid}>
            <div style={styles.trendCard}>
              <h4>Commit Trend (30 days)</h4>
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color:
                    repo.trends.commitTrend.change > 0 ? "#4caf50" : "#f44336",
                }}
              >
                {repo.trends.commitTrend.change > 0 ? "↗" : "↘"}{" "}
                {repo.trends.commitTrend.change}%
              </div>
              <p>{repo.trends.commitTrend.message}</p>
              <div style={styles.trendStats}>
                <span>Current: {repo.trends.commitTrend.current}</span>
                <span>Previous: {repo.trends.commitTrend.previous}</span>
              </div>
            </div>

            <div style={styles.trendCard}>
              <h4>Issue Trend (30 days)</h4>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color:
                    repo.trends.issueTrend.status === "Improving"
                      ? "#4caf50"
                      : "#ff9800",
                }}
              >
                {repo.trends.issueTrend.status}
              </div>
              <p>{repo.trends.issueTrend.message}</p>
            </div>

            <div style={styles.trendCard}>
              <h4>Active Contributors</h4>
              <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#2563eb" }}>
                👥 {repo.trends.contributorTrend.recentContributors}
              </div>
              <p>{repo.trends.contributorTrend.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {repo.aiInsights && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🤖 AI-Powered Insights</h2>
          <div style={styles.insightsBox}>
            <p style={styles.insightsText}>{repo.aiInsights}</p>
          </div>
        </div>
      )}

      {/* Languages */}
      {repo.languages && repo.languages.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>💻 Languages Used</h2>
          <div style={styles.languagesGrid}>
            {repo.languages.map((lang, idx) => (
              <div key={idx} style={styles.languageCard}>
                <div style={styles.languageName}>{lang.language}</div>
                <div style={styles.languagePercent}>{lang.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contributors */}
      {repo.contributors && repo.contributors.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>👥 Top Contributors</h2>
          <div style={styles.contributorsGrid}>
            {repo.contributors.map((contributor, idx) => (
              <div key={idx} style={styles.contributorCard}>
                <img
                  src={contributor.avatarUrl}
                  alt={contributor.login}
                  style={styles.avatar}
                />
                <div>
                  <a
                    href={contributor.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.contributorName}
                  >
                    {contributor.login}
                  </a>
                  <div style={styles.contributions}>
                    {contributor.contributions} contributions
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "1.2rem",
    color: "#666",
  },
  error: {
    textAlign: "center",
    padding: "50px",
    color: "#f44336",
  },
  backButton: {
    display: "inline-block",
    marginBottom: "20px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "30px",
    gap: "20px",
    flexWrap: "wrap", // Added for responsive layout
  },
  title: {
    fontSize: "2.5rem",
    margin: "0 0 10px 0",
    color: "#333",
  },
  description: {
    color: "#666",
    fontSize: "1.1rem",
    margin: 0,
  },
  // --- New/Updated Styles ---
  buttonGroup: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  githubButton: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    textDecoration: "none",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    transition: "background-color 0.2s ease",
  },
  qaButton: {
    backgroundColor: "#7c3aed", // Purple for Q&A
    color: "white",
    padding: "12px 24px",
    borderRadius: "8px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "background-color 0.2s ease",
  },
  // --- Existing Styles (omitting for brevity, but they are included below) ---
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    backgroundColor: "white",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  statValue: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px",
  },
  statLabel: {
    color: "#666",
    fontSize: "14px",
  },
  section: {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    marginBottom: "20px",
    color: "#333",
  },
  healthContainer: {
    display: "grid",
    gridTemplateColumns: "250px 1fr",
    gap: "30px",
    alignItems: "center",
    '@media (max-width: 800px)': { // Simplified media query note
        gridTemplateColumns: "1fr",
    }
  },
  healthScore: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  scoreCircle: {
    width: "200px",
    height: "200px",
    borderRadius: "50%",
    border: "15px solid",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  healthMetrics: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "15px",
  },
  metricCard: {
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "bold",
    marginLeft: "10px",
  },
  metricStats: {
    display: "flex",
    gap: "15px",
    marginTop: "8px",
    fontSize: "13px",
    color: "#666",
  },
  trendsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },
  trendCard: {
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  trendStats: {
    display: "flex",
    gap: "15px",
    marginTop: "10px",
    fontSize: "14px",
    color: "#666",
  },
  insightsBox: {
    backgroundColor: "#f0f4ff",
    padding: "24px",
    borderRadius: "8px",
  },
  insightsText: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#444",
    whiteSpace: "pre-line",
  },
  languagesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "15px",
  },
  languageCard: {
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    textAlign: "center",
  },
  languageName: {
    fontWeight: "bold",
    color: "#333",
    marginBottom: "8px",
  },
  languagePercent: {
    fontSize: "1.5rem",
    color: "#2563eb",
    fontWeight: "bold",
  },
  contributorsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "15px",
  },
  contributorCard: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
  },
  avatar: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
  },
  contributorName: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
    display: "block",
    marginBottom: "4px",
  },
  contributions: {
    fontSize: "13px",
    color: "#666",
  },
};


export default RepoDetails;
