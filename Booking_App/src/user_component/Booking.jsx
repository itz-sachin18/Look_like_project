import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Calendar, Clock, MapPin, Phone, User, ChevronLeft, Check, Info, Search, Home, CalendarIcon, UserCircle, Settings, LogOut, Mail, Scissors } from 'lucide-react'
import { API_BASE_URL } from '../apiConfig';
import "./booking.css"

const Booking = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    phone: "",
    email: "",
  })
  const [currentTime, setCurrentTime] = useState(new Date())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  const {
    uniqueId,
    userId,
    selectedTime,
    selectedStyle,
    selectedBarber,
    selectedBarberId,
    selectedStyleId,
    selectedTiming,
    selectedTimingUnit,
    shopName,
    shopDetails,
  } = location.state || {}

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!uniqueId || !userId || !selectedTime || !selectedStyle || !selectedBarber || !shopName) {
      setError("Missing booking information. Please go back and try again.")
    }
    
    document.title = `${shopName || "Barbershop"} - Confirm Booking`
  }, [uniqueId, userId, selectedTime, selectedStyle, selectedBarber, shopName])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setBookingDetails({
      ...bookingDetails,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (!bookingDetails.name || !bookingDetails.phone || !bookingDetails.email) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uniqueId,
          userId,
          userName: bookingDetails.name,
          userPhoneNumber: bookingDetails.phone,
          userEmail: bookingDetails.email,
          shopName,
          time: selectedTime,
          service: selectedStyle,
          barberName: selectedBarber,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to book appointment")
      }

      const data = await response.json()
      console.log("Booking response:", data)

      setBookingSuccess(true)

      setBookingDetails({
        name: "",
        phone: "",
        email: "",
      })

      // Redirect after 3 seconds
      setTimeout(() => {
        navigate("/bookinghistory", { state: { userId } })
      }, 3000)
    } catch (err) {
      console.error("Error booking appointment:", err)
      setError(err.message || "An error occurred while booking your appointment")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (date) => {
    const options = { weekday: "long", month: "long", day: "numeric", year: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Navigation items for sidebar
  const navItems = [
    { icon: <Home className="us-nav-icon" />, label: "Dashboard", path: "/user" },
    { icon: <Search className="us-nav-icon" />, label: "Search Shops", path: "/search" },
    { icon: <CalendarIcon className="us-nav-icon" />, label: "Bookings", path: "/bookinghistory", active: true },
    { icon: <UserCircle className="us-nav-icon" />, label: "Profile", path: "/profile" },
    { icon: <Settings className="us-nav-icon" />, label: "Settings", path: "/settings" },
  ]

  if (error && (!uniqueId || !userId)) {
    return (
      <div className="us-layout">
        {/* Sidebar */}
        <aside className="us-sidebar">
          <div className="us-sidebar-header">
            <h2 className="us-logo">LOOK LIKE</h2>
            <button className="us-collapse-btn" onClick={toggleSidebar}>
              <ChevronLeft className="us-icon" />
            </button>
          </div>

          <nav className="us-sidebar-nav">
            {navItems.map((item, index) => (
              <a
                key={index}
                href={item.path}
                className={`us-nav-item ${item.active ? "us-active" : ""}`}
                onClick={(e) => {
                  e.preventDefault()
                  navigate(item.path, { state: { userId } })
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
                e.preventDefault()
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
          {/* Top Navbar */}
          <header className="us-topbar">
            <div className="us-topbar-left">
              <h1 className="us-page-title">Booking Error</h1>
            </div>
            <div className="us-topbar-right">
              <div className="us-user-id">User ID: {userId || "681f869d1827a9895634dda"}</div>
            </div>
          </header>

          {/* Content Area */}
          <div className="us-content">
            <div className="us-booking-container">
              <div className="us-error-card">
                <div className="us-error-content">
                  <Info className="us-error-icon" />
                  <h2 className="us-error-title">Booking Error</h2>
                  <p className="us-error-message">{error}</p>
                  <button onClick={() => navigate("/search")} className="us-back-button">
                    <ChevronLeft className="us-icon-small" /> Back to Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="us-layout">
      {/* Sidebar */}
      <aside className="us-sidebar">
        <div className="us-sidebar-header">
          <h2 className="us-logo">Barbershop</h2>
          <button className="us-collapse-btn" onClick={toggleSidebar}>
            <ChevronLeft className="us-icon" />
          </button>
        </div>

        <nav className="us-sidebar-nav">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={item.path}
              className={`us-nav-item ${item.active ? "us-active" : ""}`}
              onClick={(e) => {
                e.preventDefault()
                navigate(item.path, { state: { userId } })
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
              e.preventDefault()
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
        {/* Top Navbar */}
        <header className="us-topbar">
          <div className="us-topbar-left">
            <h1 className="us-page-title">Complete Your Booking</h1>
          </div>
          <div className="us-topbar-right">
            <div className="us-current-time">
              <Clock className="us-icon-small" />
              <span>{formatTime(currentTime)}</span>
            </div>
            <div className="us-user-id">User ID: {userId || "681f869d1827a9895634dda"}</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="us-content">
          <div className="us-booking-container">
            {/* Back button */}
            <div className="us-booking-header">
              <button className="us-back-btn" onClick={() => navigate(-1)}>
                <ChevronLeft className="us-icon" />
              </button>
            </div>

            {bookingSuccess ? (
              <div className="us-success-card">
                <div className="us-success-icon">
                  <Check size={48} />
                </div>
                <h2 className="us-success-title">Booking Successful!</h2>
                <div className="us-success-details">
                  <p>
                    Your appointment has been booked for <span className="us-highlight">{selectedTime}</span> with{" "}
                    <span className="us-highlight">{selectedBarber}</span> for{" "}
                    <span className="us-highlight">{selectedStyle}</span>
                    {selectedTiming && selectedTimingUnit ? (
                      <span>
                        {" "}
                        (<span className="us-highlight">{selectedTiming} {selectedTimingUnit}</span>)
                      </span>
                    ) : (
                      ""
                    )}.
                  </p>
                  <p>
                    <strong>Booking Date:</strong> {formatDate(new Date())}
                  </p>
                  <p>
                    <strong>Status:</strong> <span className="us-status-pending">Pending</span>
                  </p>
                </div>
                <p className="us-redirect-message">You will be redirected to the dashboard shortly...</p>
              </div>
            ) : (
              <>
                <div className="us-booking-details-card">
                  <h2 className="us-card-title">
                    <Calendar className="us-section-icon" />
                    Appointment Details
                  </h2>
                  <div className="us-details-grid">
                    <div className="us-detail-item">
                      <div className="us-detail-icon">
                        <User />
                      </div>
                      <div className="us-detail-content">
                        <span className="us-detail-label">SHOP NAME</span>
                        <span className="us-detail-value">{shopName}</span>
                      </div>
                    </div>

                    <div className="us-detail-item">
                      <div className="us-detail-icon">
                        <Clock />
                      </div>
                      <div className="us-detail-content">
                        <span className="us-detail-label">TIME</span>
                        <span className="us-detail-value">{selectedTime}</span>
                      </div>
                    </div>

                    <div className="us-detail-item">
                      <div className="us-detail-icon">
                        <Scissors />
                      </div>
                      <div className="us-detail-content">
                        <span className="us-detail-label">SERVICE</span>
                        <span className="us-detail-value">{selectedStyle}</span>
                      </div>
                    </div>

                    <div className="us-detail-item">
                      <div className="us-detail-icon">
                        <User />
                      </div>
                      <div className="us-detail-content">
                        <span className="us-detail-label">BARBER</span>
                        <span className="us-detail-value">{selectedBarber}</span>
                      </div>
                    </div>

                    {selectedTiming && selectedTimingUnit && (
                      <div className="us-detail-item">
                        <div className="us-detail-icon">
                          <Clock />
                        </div>
                        <div className="us-detail-content">
                          <span className="us-detail-label">DURATION</span>
                          <span className="us-detail-value">
                            {selectedTiming} {selectedTimingUnit}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="us-detail-item">
                      <div className="us-detail-icon">
                        <Calendar />
                      </div>
                      <div className="us-detail-content">
                        <span className="us-detail-label">BOOKING DATE</span>
                        <span className="us-detail-value">{formatDate(new Date())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="us-booking-form-card">
                  <h2 className="us-card-title">
                    <User className="us-section-icon" />
                    Your Information
                  </h2>

                  {error && (
                    <div className="us-error-message">
                      <Info className="us-error-icon-small" />
                      <p>{error}</p>
                    </div>
                  )}

                  <div className="us-form-group">
                    <label htmlFor="name" className="us-form-label">
                      Full Name
                    </label>
                    <div className="us-input-wrapper">
                      <User className="us-input-icon" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="us-form-input"
                        value={bookingDetails.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="us-form-group">
                    <label htmlFor="phone" className="us-form-label">
                      Phone Number
                    </label>
                    <div className="us-input-wrapper">
                      <Phone className="us-input-icon" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="us-form-input"
                        value={bookingDetails.phone}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="us-form-group">
                    <label htmlFor="email" className="us-form-label">
                      Email
                    </label>
                    <div className="us-input-wrapper">
                      <Mail className="us-input-icon" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="us-form-input"
                        value={bookingDetails.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>

                  <div className="us-form-actions">
                    <button
                      type="button"
                      className="us-cancel-btn"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`us-confirm-btn ${isLoading ? "us-disabled" : ""}`}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Confirm Booking"}
                      {!isLoading && <Check className="us-icon-small" />}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Booking
