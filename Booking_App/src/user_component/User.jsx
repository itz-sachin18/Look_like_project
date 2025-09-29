import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, UserCircle, Settings, LogOut } from 'lucide-react';
import axios from 'axios';
import { apiEndpoint } from '../api';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './user.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const User = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get userId from user data or location state
  const userId = user?.id || location.state?.userId;
  console.log('[User Page] Current userId:', userId);

  useEffect(() => {
    console.log('[User Page] useEffect - Fetching user data');
    const fetchUser = async () => {
      try {
  const response = await axios.get(apiEndpoint('/api/auth/user'), {
          withCredentials: true,
        });
        console.log('[User Page] User data received:', response.data);
        setUser(response.data);
        setLoading(false);
        
        // Store userId in localStorage as backup
        if (response.data?.id) {
          localStorage.setItem('userId', response.data.id);
        }
      } catch (err) {
        console.error('[User Page] Fetch user error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to fetch user data');
        setLoading(false);
        navigate('/userlogin');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    console.log('[User Page] Logout initiated');
    try {
  await axios.post(apiEndpoint('/api/auth/logout'), {}, { withCredentials: true });
      localStorage.removeItem('userId');
      navigate('/userlogin');
    } catch (err) {
      console.error('[User Page] Logout error:', err);
      setError('Logout failed');
    }
  };

  const navItems = [
    { 
      icon: <Home className="us-nav-icon" />, 
      label: "Dashboard", 
      path: "/user",
      onClick: () => navigate("/user", { state: { userId } })
    },
    { 
      icon: <Search className="us-nav-icon" />, 
      label: "Search Shops", 
      path: "/user-search",
      onClick: () => navigate("/user-search", { state: { userId } })
    },
    { 
      icon: <Calendar className="us-nav-icon" />, 
      label: "Bookings", 
      path: "/bookinghistory",
      onClick: () => {
        console.log('[User Page] Navigating to bookings with userId:', userId);
        navigate("/bookinghistory", { 
          state: { 
            userId,
            from: 'user-page' // Additional debug info
          } 
        });
      }
    },
    { 
      icon: <UserCircle className="us-nav-icon" />, 
      label: "Profile", 
      path: "/profile",
      onClick: () => navigate("/profile", { state: { userId } })
    },
    { 
      icon: <Settings className="us-nav-icon" />, 
      label: "Settings", 
      path: "/settings",
      onClick: () => navigate("/settings", { state: { userId } })
    },
  ];

  // Bar chart data and options
  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Bookings',
        data: [3, 5, 2, 6, 4, 7, 1], // Example data, replace with real data if available
        backgroundColor: 'rgba(30, 58, 138, 0.7)',
        borderColor: '#1e3a8a',
        borderWidth: 1,
        borderRadius: 6,
        maxBarThickness: 40,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Weekly Bookings',
        color: '#1e3a8a',
        font: {
          size: 16,
          weight: 'bold',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(30,58,138,0.05)',
        },
        ticks: {
          color: '#1e3a8a',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(30,58,138,0.05)',
        },
        ticks: {
          color: '#1e3a8a',
        },
      },
    },
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="us-layout">
      <aside className="us-sidebar">
        <div className="us-sidebar-header">
          <h2 className="us-logo">LOOK LIKE</h2>
        </div>

        <nav className="us-sidebar-navs">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={`us-nav-item ${location.pathname === item.path ? "us-active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                console.log(`[User Page] Navigation to ${item.path} clicked`);
                item.onClick();
              }}
            >
              {item.icon}
              <span className="us-nav-label">{item.label}</span>
              {location.pathname === item.path && <div className="us-active-indicator"></div>}
            </a>
          ))}
        </nav>

        <div className="us-sidebar-footer">
          <a
            href="#"
            className="us-nav-item"
            onClick={(e) => {
              e.preventDefault();
              handleLogout();
            }}
          >
            <LogOut className="us-nav-icon" />
            <span className="us-nav-label">Logout</span>
          </a>
        </div>
      </aside>

      <main className="us-main">
        <header className="us-topbar">
          <div className="us-topbar-left">
            <h1 className="us-page-title">Welcome Back, {user?.name || 'User'}</h1>
          </div>
          <div className="us-topbar-right">
            <div className="us-user-id">User ID: {userId || 'Not available'}</div>
          </div>
        </header>

        <div className="us-content">
          <div className="dashboard-grid">
            <div className="stats-card">
              <h3>Total Bookings</h3>
              <p className="stats-number">24</p>
            </div>
            <div className="stats-card">
              <h3>Upcoming Appointments</h3>
              <p className="stats-number">3</p>
            </div>
            <div className="stats-card">
              <h3>Favorite Shops</h3>
              <p className="stats-number">5</p>
            </div>
          </div>

          <div className="chart-container">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default User;