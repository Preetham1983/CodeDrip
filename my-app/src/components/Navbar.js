import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav style={styles.nav}>
      <h2 style={{ ...styles.logo, cursor: "pointer" }}>
  <Link 
    to="/" 
    style={{ textDecoration: "none", color: "inherit" }}
  >
    Repo Explorer 🔍
  </Link>
</h2>
      <div>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/analyze" style={{ ...styles.link, marginLeft: "20px" }}>Analyze</Link>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#000000ff",
    padding: "10px 20px",
    color: "white",
  },
  logo: {
    fontWeight: "bold",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
  },
};

export default Navbar;