import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Calendar as CalendarIcon, UserCircle, Settings, LogOut } from 'lucide-react';
import "./userSearch.css";
import BASE_URL from "../api";

const UserSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId || "No User ID";

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      alert("Please enter a search term.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/search?query=${encodeURIComponent(searchTerm)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch data");
      }

      const data = await response.json();
      setSearchResults(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError(error.message || "An error occurred while searching");
      setSearchResults([]);
    }
  };

  const handleShopClick = (shop) => {
    if (!shop) {
      console.error("No shop selected!");
      return;
    }

    console.log("Navigating to userselection page with:", shop);
    navigate("/select-barber", { state: { shop, userId } });
  };

  const navItems = [
    { icon: <Home className="us-nav-icon" />, label: "Dashboard", path: "/user" },
    { icon: <Search className="us-nav-icon" />, label: "Search Shops", path: "/search", active: true },
    { icon: <CalendarIcon className="us-nav-icon" />, label: "Bookings", path: "/bookinghistory" },
    { icon: <UserCircle className="us-nav-icon" />, label: "Profile", path: "/profile" },
    { icon: <Settings className="us-nav-icon" />, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="us-layout">
      {/* Sidebar */}
      <aside className="us-sidebar">
        <div className="us-sidebar-header">
          <h2 className="us-logo">LOOK LIKE</h2>
        </div>

        <nav className="us-sidebar-navs">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={`us-nav-item ${item.active ? "us-active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path, { state: { userId } });
              }}
            >
              {item.icon}
              <span className="us-nav-label">{item.label}</span>
              {item.active && <div className="us-active-indicator"></div>}
            </a>
          ))}
        </nav>

        <div className="us-sidebar-footer">
          <a
            href="#"
            className="us-nav-item"
            onClick={(e) => {
              e.preventDefault();
              // Handle logout
            }}
          >
            <LogOut className="us-nav-icon" />
            <span className="us-nav-label">Logout</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="us-main">
        <header className="us-topbar">
          <div className="us-topbar-left">
            <h1 className="us-page-title">Search Barbershop</h1>
          </div>
          <div className="us-topbar-right">
            <div className="us-user-id">User ID: {userId}</div>
          </div>
        </header>

        <div className="us-content">
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search by shop name, location, or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <button className="search-button" onClick={handleSearch}>
                <Search className="us-icon-small" /> Search
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="search-results">
              {searchResults.length > 0 ? (
                <div className="results-grid">
                  {searchResults.map((shop, index) => (
                    <div
                      key={index}
                      className="shop-card"
                      onClick={() => handleShopClick(shop)}
                    >
                      <div className="shop-image">
                        <i className="fas fa-store"></i>
                      </div>
                      <div className="shop-info">
                        <h3>{shop.shopName}</h3>
                        <p>Owner Name:<i className="fas fa-user"></i> {shop.ownerName}</p>
                        <p>owner Contact:<i className="fas fa-phone"></i> {shop.ownerContact}</p>
                        <p>Shop Address:<i className="fas fa-map-marker-alt"></i> {shop.address}</p>
                        <p>shop Open Hours:<i className="fas fa-clock"></i> {shop.openHours}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <i className="fas fa-search"></i>
                  <p>No shops found. Try different search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserSearch;