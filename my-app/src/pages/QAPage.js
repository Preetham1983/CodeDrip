import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const API = axios.create({
  baseURL: "YOUR-BACKEND-DEPLOY-URL/api",
});




const QAPage = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState("");
  const [repoName, setRepoName] = useState("Repository");
  const [messages, setMessages] = useState([
    {
      type: "answer",
      text: "Hello! I'm the Code Assistant AI. Ask me anything technical about this repository's health, metrics, or recent activity!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch repository name on load
  useEffect(() => {
    API.get(`/repos/${id}`)
      .then((res) => {
        setRepoName(res.data.basic?.fullName || res.data.name);
      })
      .catch((err) => {
        console.error("Error fetching repo name:", err);
        setRepoName("Unknown Repository");
      });
  }, [id]);

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async (e) => {
    e.preventDefault();
    const query = question.trim();
    if (!query) return;

    // Add user question immediately
    const newUserMessage = { type: "question", text: query };
    setMessages((prev) => [...prev, newUserMessage]);

    // Clear input and start loading
    setQuestion("");
    setLoading(true);

    // Call the backend endpoint
    try {
      const response = await API.post(
        `/repos/${id}/ask`,
        { question: query }
      );

      setMessages((prev) => [
        ...prev,
        { type: "answer", text: response.data.answer },
      ]);
    } catch (error) {
      console.error("Error asking question:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          text: "Sorry, I ran into an error trying to answer that. Please check the backend log.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Link to={`/repo/${id}`} style={styles.backButton}>
        ← Back to {repoName} Analysis
      </Link>
      <h2 style={styles.title}>❓ Q&A for {repoName}</h2>
      <p style={styles.subtitle}>Ask technical questions about the repository's metrics or how it functions.</p>

      <div style={styles.chatBox}>
        <div style={styles.messagesContainer}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                ...styles.message,
                ...styles[msg.type],
              }}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div style={{ ...styles.message, ...styles.answer }}>
              <span style={styles.loader}>
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleAsk} style={styles.form}>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about health scores, commits, or issues..."
            style={styles.input}
            disabled={loading}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  backButton: {
    display: "inline-block",
    marginBottom: "20px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    margin: "0 0 5px 0",
  },
  subtitle: {
    color: "#666",
    margin: "0 0 20px 0",
  },
  chatBox: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    height: "60vh",
    minHeight: "400px",
  },
  messagesContainer: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "15px",
    maxWidth: "80%",
    wordWrap: "break-word",
    fontSize: "15px",
  },
  question: {
    alignSelf: "flex-end",
    backgroundColor: "#2563eb",
    color: "white",
    borderBottomRightRadius: "4px",
  },
  answer: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f4ff", // Light purple/blue
    color: "#333",
    borderBottomLeftRadius: "4px",
  },
  form: {
    display: "flex",
    gap: "10px",
    padding: "15px",
    borderTop: "1px solid #eee",
  },
  input: {
    flex: 1,
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    outline: "none",
  },
  button: {
    padding: "12px 24px",
    backgroundColor: "#7c3aed", // Purple for Q&A action
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "background-color 0.2s ease",
  },
  loader: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "3px",
    fontSize: "18px",
    animation: "fade 1.2s infinite",
  },
  // --- New Styles for Suggested Questions ---
  suggestedQuestions: {
    marginBottom: "15px",
    padding: "10px 20px", // Adjusted padding for consistency
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    margin: "0 20px 15px 20px",
    border: "1px solid #e0e0e0"
  },
  suggestionLabel: {
    fontSize: "12px",
    color: "#666",
    margin: "0 0 8px 0",
    fontWeight: "600",
  },
  questionTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },
  questionTag: {
    padding: "6px 12px",
    backgroundColor: "#e0e7ff",
    color: "#5b21b6",
    border: "1px solid #c7d2fe",
    borderRadius: "16px",
    cursor: "pointer",
    fontSize: "13px",
    transition: "all 0.2s ease",
    whiteSpace: 'nowrap',
  }
  // --- End New Styles ---
};


export default QAPage;
