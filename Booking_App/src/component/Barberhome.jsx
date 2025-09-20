import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
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
import "./barberhome.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Barberhome = () => {
  const navigate = useNavigate();
  const [adminId, setadminId] = useState();


  useEffect(() => {
    const fetchuserdata = async () => {
      try {
        console.log("hiiii");
        const response = await axios.get("http://localhost:5000/api/checkvaliduser", {
          withCredentials: true, // Ensures cookies are sent
        });

        if (response) {
          setadminId(response.data.user.adminId);
        } else {
          navigate("/barberlogin");
        }
      } catch (error) {
        console.log(error);
        navigate("/barberlogin");
      }
    };

    fetchuserdata();
  }, [navigate]);

  const handleLogout = async () => {
    console.log("Before logout:", document.cookie); // Debug cookies in the browser

    try {
      const response = await axios.post("http://localhost:5000/api/logout", {}, {
        withCredentials: true,
      });

      console.log(response.data.message);
      console.log("After logout:", document.cookie); // Check if token is removed
      navigate("/barberlogin");
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Appointments',
        data: [15, 12, 18, 8, 20, 25, 10],
        backgroundColor: 'rgba(255, 215, 0, 0.6)',
        borderColor: '#ffd700',
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#192f59'
        }
      },
      title: {
        display: true,
        text: 'Weekly Appointments',
        color: '#192f59',
        font: {
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        grid: {
          color: 'rgba(25, 47, 89, 0.1)'
        },
        ticks: {
          color: '#192f59'
        }
      },
      x: {
        grid: {
          color: 'rgba(25, 47, 89, 0.1)'
        },
        ticks: {
          color: '#192f59'
        }
      }
    }
  };

  return (
    <div className="app-container">
      <div className="top-navigation">
        <div className="brand">
          <i className="fas fa-cut"></i>
          <span>LOOK LIKE</span>
        </div>
        <div className="top-nav-right">
          <div className="admin-info">
            <i className="fas fa-user-circle"></i>
            <span>Admin ID: {adminId}</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-container">
        <div className="sidebar">
          <div className="logo-section">
            <h2>Barbershop Admin</h2>
            <p className="admin-id">ID: {adminId}</p>
          </div>
          <nav className="nav-menu">
            <Link to="/barberhome" className="nav-item active">
              <i className="fas fa-chart-line"></i> Dashboard
            </Link>
            <Link to="/barberform" state={{ adminId }} className="nav-item">
              <i className="fas fa-store"></i> Add Shops
            </Link>
            <Link
              to="/appointments"
              state={{ adminId }}
              className="nav-item"
            >
              <i className="fas fa-calendar-check"></i> Appointments
            </Link>
            <Link to="/daily" className="nav-item">
              <i className="fas fa-clock"></i> Daily Update
            </Link>
            <Link to="/profile" state={{adminId}}className="nav-item">
              <i className="fas fa-user"></i> Profile
            </Link>
          </nav>
        </div>

        <div className="main-content">
          <div className="page-header">
            <h1>Dashboard Overview</h1>
            <div className="breadcrumb">
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </div>
          </div>

          <div className="stats-grid">
            <div className="stats-card">
              <h3>Today's Appointments</h3>
              <p className="stats-number">12</p>
            </div>
            <div className="stats-card">
              <h3>Total Revenue</h3>
              <p className="stats-number">$890</p>
            </div>
            <div className="stats-card">
              <h3>Active Shops</h3>
              <p className="stats-number">3</p>
            </div>
            <div className="stats-card">
              <h3>Total Customers</h3>
              <p className="stats-number">145</p>
            </div>
          </div>

          <div className="chart-container">
            <Bar options={chartOptions} data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Barberhome;

