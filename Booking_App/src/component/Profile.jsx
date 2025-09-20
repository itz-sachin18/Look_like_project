"use client"

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState("ADM-C1447C");
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock profile data based on the screenshot
  useEffect(() => {
    const mockProfileData = {
      adminId: "ADM-C1447C",
      uniqueId: "683dd00a6984c0695d6b207b",
      shopName: "mohan cut'z",
      email: "mohan@gmail.com",
      createdAt: "2/6/2025, 9:53:38 pm",
      secondaryId: "683dd0276984c0695d6b207e",
    };
    setProfileData(mockProfileData);
  }, []);

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      navigate("/barberlogin");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  if (loading) return <div className="profile-loading">Loading...</div>;
  if (error) return <div className="profile-error">{error}</div>;
  if (!profileData) return <div className="profile-error">No profile data available.</div>;

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <div className="top-navigation">
        <div className="brand">
          <span>LOOK LIKE</span>
        </div>
        <div className="top-nav-right">
          <div className="admin-info">
            <span>Admin ID: {adminId}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo-section">
            <h2>Barbershop Admin</h2>
            <p className="admin-id">ID: {adminId}</p>
          </div>
          <nav className="nav-menu">
            <Link to="/barberhome" className="nav-item">
              Dashboard
            </Link>
            <Link to="/barberform" className="nav-item">
              Add Shops
            </Link>
            <Link to="/appointments" className="nav-item">
              Appointments
            </Link>
            <Link to="/daily" className="nav-item">
              Daily Update
            </Link>
            <Link to="/profile" className="nav-item active">
              Profile
            </Link>
          </nav>
        </div>

        {/* Main Content - Improved Profile Display */}
        <div className="profile-main-content">
          <div className="profile-header">
            <h1>Profile</h1>
          </div>

          <div className="profile-card">
            <div className="profile-info-group">
              <div className="profile-info-item">
                <div className="info-label">Admin ID</div>
                <div className="info-value">{profileData.adminId}</div>
              </div>

              <div className="profile-info-item">
                <div className="info-label">Unique ID</div>
                <div className="info-value">{profileData.uniqueId}</div>
              </div>

              <div className="profile-info-item">
                <div className="info-label">Shop Name</div>
                <div className="info-value">{profileData.shopName}</div>
              </div>

              <div className="profile-info-item">
                <div className="info-label">Email</div>
                <div className="info-value">{profileData.email}</div>
              </div>

              <div className="profile-info-item">
                <div className="info-label">Created At</div>
                <div className="info-value">{profileData.createdAt}</div>
              </div>

              <div className="profile-info-item">
                <div className="info-label">Secondary ID</div>
                <div className="info-value">{profileData.secondaryId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
