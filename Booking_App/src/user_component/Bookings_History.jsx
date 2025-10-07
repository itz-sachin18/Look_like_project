"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Home, Search, CalendarIcon, UserCircle, Settings, LogOut, Clock, Scissors, User, QrCode } from "lucide-react"
import axios from "axios"
import { QRCodeCanvas } from "qrcode.react"
import "./booking_history.css"
import BASE_URL from "../api"

const BookingsHistory = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("upcoming")
  const [qrCodeVisible, setQrCodeVisible] = useState({})

  // Get userId with multiple fallbacks
  const stateUserId = location.state?.userId
  const localStorageUser = JSON.parse(localStorage.getItem("userData"))
  const userId = stateUserId || localStorageUser?._id

  console.log("Current userId:", userId)

  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) {
        setError("User authentication required. Please login again.")
        setLoading(false)
        return
      }

      try {
        const response = await axios.get(`${BASE_URL}/api/user/${userId}`, {
          withCredentials: true,
        })

        if (response.data.success) {
          setBookings(response.data.bookings || [])
        } else {
          setError(response.data.message || "No bookings found")
        }
      } catch (err) {
        console.error("Error fetching bookings:", err)
        setError(err.response?.data?.message || "Failed to load bookings")
        if (err.response?.status === 401) {
          navigate("/userlogin")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [userId, navigate])

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true })
      localStorage.removeItem("userData")
      navigate("/userlogin")
    } catch (err) {
      setError("Logout failed")
    }
  }

  const toggleQRCode = (bookingId) => {
    setQrCodeVisible((prev) => ({
      ...prev,
      [bookingId]: !prev[bookingId],
    }))
  }

  const filteredBookings = bookings.filter((booking) => {
    if (filter === "upcoming") {
      return booking.status === "pending"
    } else {
      return booking.status === "completed" || booking.status === "cancelled"
    }
  })

  const navItems = [
    {
      icon: <Home className="bh-nav-icon" />,
      label: "Dashboard",
      path: "/user",
      onClick: () => navigate("/user", { state: { userId } }),
    },
    {
      icon: <Search className="bh-nav-icon" />,
      label: "Search Shops",
      path: "/user-search",
      onClick: () => navigate("/user-search", { state: { userId } }),
    },
    {
      icon: <CalendarIcon className="bh-nav-icon" />,
      label: "Bookings",
      path: "/bookinghistory",
      active: true,
      onClick: () => navigate("/bookinghistory", { state: { userId } }),
    },
    {
      icon: <UserCircle className="bh-nav-icon" />,
      label: "Profile",
      path: "/profile",
      onClick: () => navigate("/profile", { state: { userId } }),
    },
    {
      icon: <Settings className="bh-nav-icon" />,
      label: "Settings",
      path: "/settings",
      onClick: () => navigate("/settings", { state: { userId } }),
    },
  ]

  if (loading) {
    return (
      <div className="bh-layout">
        <div className="bh-loading">Loading your bookings...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bh-layout">
        <div className="bh-error">
          {error}
          <button className="bh-retry-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
          <button className="bh-login-btn" onClick={() => navigate("/userlogin")}>
            Login Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bh-layout">
      <aside className="bh-sidebar">
        <div className="bh-sidebar-header">
          <h1>BOOKING HISTORY</h1>
        </div>

        <nav className="bh-sidebar-nav">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={`bh-nav-item ${item.active ? "bh-active" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                item.onClick()
              }}
            >
              {item.icon}
              <span className="bh-nav-label">{item.label}</span>
              {item.active && <div className="bh-active-indicator"></div>}
            </a>
          ))}
        </nav>

        <div className="bh-sidebar-footer">
          <a
            href="#"
            className="bh-nav-item"
            onClick={(e) => {
              e.preventDefault()
              handleLogout()
            }}
          >
            <LogOut className="bh-nav-icon" />
            <span className="bh-nav-label">Logout</span>
          </a>
        </div>
      </aside>

      <main className="bh-main">
        <header className="bh-topbar">
          <div className="bh-topbar-left">
            {/* <h1 className="bh-page-title">Your Bookings</h1> */}
          </div>
          <div className="bh-topbar-right">{userId && <div className="bh-user-id">User ID: {userId}</div>}</div>
        </header>

        <div className="bh-content">
          <div className="bh-filter-buttons">
            <button
              className={`bh-filter-btn ${filter === "upcoming" ? "bh-active-filter" : ""}`}
              onClick={() => setFilter("upcoming")}
            >
              Upcoming
            </button>
            <button
              className={`bh-filter-btn ${filter === "completed" ? "bh-active-filter" : ""}`}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>

          <div className="bh-bookings-list">
            {filteredBookings.length === 0 ? (
              <p className="bh-no-bookings">No {filter} bookings found</p>
            ) : (
              filteredBookings.map((booking, index) => (
                <div key={index} className="bh-booking-card">
                  <div className="bh-booking-header">
                    <h3 className="bh-booking-shop">{booking.shopName}</h3>
                    <span className={`bh-booking-status bh-status-${booking.status}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="bh-booking-content">
                    <div className="bh-booking-details">
                      <p>
                        <CalendarIcon size={20} /> {new Date(booking.bookingDate).toLocaleDateString()}
                      </p>
                      <p>
                        <Clock size={20} /> {booking.time}
                      </p>
                      <p>
                        <Scissors size={20} /> {booking.service}
                      </p>
                      <p>
                        <User size={20} /> {booking.barberName}
                      </p>
                      <p>
                        <Clock size={20} /> Duration: {booking.timing} {booking.timingUnit}
                      </p>
                    </div>
                    <div className="bh-qr-section">
                      <button className="bh-qr-btn" onClick={() => toggleQRCode(index)}>
                        <QrCode size={16} style={{ marginRight: "8px" }} />
                        {qrCodeVisible[index] ? "Hide QR Code" : "Show QR Code"}
                      </button>
                    </div>
                  </div>
                  {qrCodeVisible[index] && (
                    <div className="bh-qr-display">
                      <QRCodeCanvas
                        value={JSON.stringify({
                          userId,
                          bookingDate: new Date(booking.bookingDate).toLocaleDateString(),
                          time: booking.time,
                        })}
                        size={150}
                      />
                      <p className="bh-qr-text">Scan this QR code to view your booking details</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default BookingsHistory