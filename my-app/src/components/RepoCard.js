import React, { useState } from "react";
import { Link } from "react-router-dom";

const RepoCard = ({ repo }) => {
  const [expanded, setExpanded] = useState(false);

  const getHealthColor = (score) => {
    if (score >= 80) return "#4caf50";
    if (score >= 60) return "#ff9800";
    return "#f44336";
  };

  const getStatusBadgeStyle = (status) => {
    const baseStyle = {
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "bold",
    };

    if (status === "Healthy") {
      return { ...baseStyle, backgroundColor: "#e8f5e9", color: "#4caf50" };
    } else if (status === "Warning") {
      return { ...baseStyle, backgroundColor: "#fff3e0", color: "#ff9800" };
    } else {
      return { ...baseStyle, backgroundColor: "#ffebee", color: "#f44336" };
    }
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.cardHeader}>
        <div>
          <h3 style={styles.repoName}>{repo.basic?.fullName || repo.name}</h3>
          <p style={styles.description}>
            {repo.basic?.description || "No description"}
          </p>
        </div>
        {repo.basic?.language && (
          <span style={styles.languageBadge}>{repo.basic.language}</span>
        )}
      </div>

      {/* Stats Row */}
      {repo.basic && (
        <div style={styles.statsRow}>
          <div style={styles.statItem}>
            <span style={styles.statValue}>⭐ {repo.basic.stars}</span>
            <span style={styles.statLabel}>Stars</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>🍴 {repo.basic.forks}</span>
            <span style={styles.statLabel}>Forks</span>
          </div>
          <div style={styles.statItem}>
            <span style={styles.statValue}>🐛 {repo.basic.openIssues}</span>
            <span style={styles.statLabel}>Issues</span>
          </div>
        </div>
      )}

      {/* Health Score */}
      {repo.health && (
        <div style={styles.healthSection}>
          <div style={styles.healthHeader}>
            <span style={styles.healthLabel}>Repository Health</span>
            <div style={styles.healthScoreContainer}>
              <div
                style={{
                  ...styles.healthScore,
                  color: getHealthColor(repo.health.score),
                }}
              >
                {repo.health.score}/100
              </div>
            </div>
          </div>

          {/* Health Metrics */}
          <div style={styles.metricsGrid}>
            <div style={styles.metricBadge}>
              <span style={styles.metricLabel}>Activity</span>
              <span
                style={getStatusBadgeStyle(
                  repo.health.metrics.commitActivity.status
                )}
              >
                {repo.health.metrics.commitActivity.status}
              </span>
            </div>
            <div style={styles.metricBadge}>
              <span style={styles.metricLabel}>Issues</span>
              <span
                style={getStatusBadgeStyle(
                  repo.health.metrics.issueHealth.status
                )}
              >
                {repo.health.metrics.issueHealth.status}
              </span>
            </div>
            <div style={styles.metricBadge}>
              <span style={styles.metricLabel}>PRs</span>
              <span
                style={getStatusBadgeStyle(repo.health.metrics.prStatus.status)}
              >
                {repo.health.metrics.prStatus.status}
              </span>
            </div>
            <div style={styles.metricBadge}>
              <span style={styles.metricLabel}>Contributors</span>
              <span
                style={getStatusBadgeStyle(
                  repo.health.metrics.contributorHealth.status
                )}
              >
                {repo.health.metrics.contributorHealth.count}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {repo.aiInsights && (
        <div style={styles.insightsSection}>
          <div
            style={styles.insightsHeader}
            onClick={() => setExpanded(!expanded)}
          >
            <span style={styles.insightsLabel}>🤖 AI Insights</span>
            <span style={styles.expandIcon}>{expanded ? "▲" : "▼"}</span>
          </div>
          {expanded && (
            <div style={styles.insightsContent}>
              <p style={styles.insightsText}>{repo.aiInsights}</p>
            </div>
          )}
        </div>
      )}

      {/* Trends Quick View */}
      {repo.trends && (
        <div style={styles.trendsSection}>
          <div style={styles.trendItem}>
            <span style={styles.trendLabel}>Commits (30d)</span>
            <span
              style={{
                ...styles.trendValue,
                color:
                  repo.trends.commitTrend.change > 0 ? "#4caf50" : "#f44336",
              }}
            >
              {repo.trends.commitTrend.change > 0 ? "↗" : "↘"}{" "}
              {repo.trends.commitTrend.current}
            </span>
          </div>
          <div style={styles.trendItem}>
            <span style={styles.trendLabel}>Active Contributors</span>
            <span style={styles.trendValue}>
              👥 {repo.trends.contributorTrend.recentContributors}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={styles.buttonGroup}>
        <Link to={`/repo/${repo._id}`} style={styles.detailsButton}>
          📊 View Full Analysis
        </Link>
        <a
          href={repo.gitUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.githubButton}
        >
          GitHub →
        </a>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    minHeight: "450px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },
  repoName: {
    margin: "0 0 8px 0",
    fontSize: "1.3rem",
    color: "#000000ff",
    fontWeight: "bold",
  },
  description: {
    margin: 0,
    color: "#666",
    fontSize: "14px",
    lineHeight: "1.5",
  },
  languageBadge: {
    backgroundColor: "#000000ff",
    color: "white",
    padding: "6px 12px",
    borderRadius: "16px",
    fontSize: "13px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },
  statsRow: {
    display: "flex",
    gap: "20px",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
  },
  statItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  statValue: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: "12px",
    color: "#888",
  },
  healthSection: {
    backgroundColor: "#f8f9fa",
    padding: "16px",
    borderRadius: "8px",
  },
  healthHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  healthLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  healthScoreContainer: {
    display: "flex",
    alignItems: "center",
  },
  healthScore: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  metricBadge: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 10px",
    backgroundColor: "white",
    borderRadius: "6px",
  },
  metricLabel: {
    fontSize: "13px",
    color: "#666",
  },
  insightsSection: {
    backgroundColor: "#f0f4ff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  insightsHeader: {
    padding: "12px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
  },
  insightsLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  expandIcon: {
    color: "#666",
    fontSize: "12px",
  },
  insightsContent: {
    padding: "0 16px 16px 16px",
  },
  insightsText: {
    fontSize: "14px",
    color: "#444",
    lineHeight: "1.6",
    margin: 0,
    whiteSpace: "pre-line",
  },
  trendsSection: {
    display: "flex",
    gap: "16px",
    paddingTop: "12px",
    borderTop: "1px solid #e5e7eb",
  },
  trendItem: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  trendLabel: {
    fontSize: "12px",
    color: "#888",
  },
  trendValue: {
    fontSize: "15px",
    fontWeight: "bold",
    color: "#333",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "auto",
  },
  detailsButton: {
    flex: 1,
    display: "block",
    textAlign: "center",
    padding: "10px",
    backgroundColor: "#000000ff",
    color: "white",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "background-color 0.2s, transform 0.2s",
    cursor: "pointer",
  },
  githubButton: {
    flex: 1,
    display: "block",
    textAlign: "center",
    padding: "10px",
    border: "2px solid #000000",
    backgroundColor: "#ffffffff",
    color: "black",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: "bold",
    transition: "background-color 0.2s, transform 0.2s",
  },
};

export default RepoCard;