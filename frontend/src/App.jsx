import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Allauction from "../src/components/Allauction";
import Bid from "../src/components/Bid";
import CreateAuction from "../src/components/CreateAuction";
import Myauction from "../src/components/Myauction";
import UserInfo from "../src/components/UserInfo";
import AuthPage from "../src/components/AuthPage";
import { jwtDecode } from "jwt-decode";
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Import Bootstrap

function App() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [userId, setUserId] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setToken(storedToken);
        setUserId(decoded.userId);
        setName(decoded.name);
        setEmail(decoded.email);
        setIsAuthorized(true);
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthorized(false);
        localStorage.removeItem("token");
      }
    } else {
      setIsAuthorized(false);
    }
  }, []);

  const handleAuthSuccess = (data) => {
    setToken(data.token);
    setUserId(data.userId);
    setName(data.name);
    setEmail(data.email);
    setIsAuthorized(true);
    localStorage.setItem("token", data.token);
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    setUserId(1);
    setName("");
    setEmail("");
    setToken("");
    localStorage.removeItem("token");
  };

  return (
    <Router>
      <div className="container-fluid">
        {isAuthorized ? (
        <header>
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">
        AuctionApp
      </Link>

      {/* ✅ Toggler button for mobile */}
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      {/* ✅ Collapsible content */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Allauction
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/create-auction">
              CreateAuction
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/my-auction">
              Myauction
            </Link>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="btn btn-outline-light"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</header>

        ) : (
          <AuthPage onAuthSuccess={handleAuthSuccess} />
        )}

        {isAuthorized && (
          <main>
            <Routes>
              <Route path="/" element={<Allauction userId={userId} />} />
              <Route path="/bid/:paramsId" element={<Bid userId={userId} />} />
              <Route
                path="/create-auction"
                element={<CreateAuction userId={userId} />}
              />
              <Route
                path="/my-auction"
                element={<Myauction userId={userId} />}
              />
              <Route
                path="/user-info"
                element={<UserInfo userId={userId} />}
              />
            </Routes>
          </main>
        )}

        {!isAuthorized && (
          <main>
            <div className="alert alert-warning text-center mt-4">
              Please log in or sign up to access the app.
            </div>
          </main>
        )}
      </div>
    </Router>
  );
}

export default App;
