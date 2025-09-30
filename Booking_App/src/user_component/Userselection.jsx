import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Calendar, Clock, MapPin, Phone, User, ChevronLeft, ChevronRight, Check, X, Scissors, Info, Search, Home, CalendarIcon, UserCircle, Settings, LogOut } from 'lucide-react'
import "./userselection.css"

const UserSelection = () => {
  const [shopDetails, setShopDetails] = useState(null)
  const [selectedBarber, setSelectedBarber] = useState("")
  const [selectedBarberId, setSelectedBarberId] = useState("")
import { API_BASE_URL } from '../apiConfig';
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("")
  const [selectedStyleId, setSelectedStyleId] = useState("")
  const [selectedTiming, setSelectedTiming] = useState("")
  const [selectedTimingUnit, setSelectedTimingUnit] = useState("")
  const [availableBarbers, setAvailableBarbers] = useState([])
  const [availableStyles, setAvailableStyles] = useState([])
  const [showStylesScreen, setShowStylesScreen] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [currentDate] = useState(new Date())
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeSlots, setTimeSlots] = useState([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const location = useLocation()
  const { shop, userId } = location.state || {}
  const navigate = useNavigate()

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (shop) {
      console.log("Shop data received:", shop)
      setShopDetails(shop)
      document.title = `${shop.shopName} - Book Appointment`
      fetchAvailableBarbers()
      generateTimeSlots(shop.openHours)
    } else {
      setError("Shop details not found. Please go back and search again.")
    }
  }, [shop])

  const generateTimeSlots = (openHours) => {
    if (!openHours) {
      console.error("Open hours not provided")
      setTimeSlots([])
      return
    }

    const [startStr, endStr] = openHours
      .toLowerCase()
      .split(" to ")
      .map((s) => s.trim())
    if (!startStr || !endStr) {
      console.error("Invalid open hours format:", openHours)
      setTimeSlots([])
      return
    }

      const url = `${API_BASE_URL}/api/barber-timings?uniqueId=${encodeURIComponent(shop.uniqueId)}`
      const [hourStr, period] = timeStr.match(/(\d+)(am|pm)/).slice(1)
      let hour = Number.parseInt(hourStr, 10)
      if (period === "pm" && hour !== 12) hour += 12
      if (period === "am" && hour === 12) hour = 0
      return hour
    }

    const startHour = parseTime(startStr)
    const endHour = parseTime(endStr)

    if (startHour >= endHour) {
      console.error("Invalid time range: startHour >= endHour", { startHour, endHour })
      setTimeSlots([])
      return
    }

    const slots = []
    for (let hour = startHour; hour < endHour; hour++) {
      const startPeriod = hour < 12 ? "AM" : "PM"
      const endPeriod = hour + 1 <= 12 ? "AM" : "PM"
      const startDisplayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const endDisplayHour = hour + 1 === 0 ? 12 : hour + 1 > 12 ? hour + 1 - 12 : hour + 1

      if (hour === 13) {
        slots.push({ time: "LUNCH BREAK", isLunchBreak: true })
        continue
      }

      const slot = `${startDisplayHour}:00 ${startPeriod} to ${endDisplayHour}:00 ${endPeriod}`
      slots.push({ time: slot, isLunchBreak: false })
    }

    console.log("Generated time slots:", slots)
    setTimeSlots(slots)
  }

  const fetchAvailableBarbers = async () => {
    setIsLoading(true)
    setError(null)

    if (!shop || !shop.uniqueId) {
      console.error("Shop or uniqueId is missing:", { shop })
      setError("Shop details or unique ID not available. Please try again.")
      setIsLoading(false)
      return
    }

    try {
      const url = `http://localhost:5000/api/barber-timings?uniqueId=${encodeURIComponent(shop.uniqueId)}`
      console.log("Fetching barbers from URL:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      console.log("Response status:", response.status)
      console.log("Response headers:", response.headers.get("content-type"))

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error response data:", errorData)
        throw new Error(errorData.message || "Failed to fetch barbers")
      }

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response format: Expected JSON")
      }

      const data = await response.json()
      console.log("Fetched barbers data:", data)

      if (!Array.isArray(data)) {
        console.error("Barbers data is not an array:", data)
        throw new Error("Invalid data format: Expected an array of barbers")
      }

      setAvailableBarbers(data)
    } catch (err) {
      console.error("Error fetching barbers:", err.message)
      setError(err.message || "An error occurred while fetching barbers")
      setAvailableBarbers([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAvailableStyles = async (time) => {
    setIsLoading(true)
    setError(null)

    if (!selectedBarber) {
      console.error("No barber selected for styles fetch")
      setError("Please select a barber first.")
      setIsLoading(false)
      return
    }

    try {
      const barberData = availableBarbers.find((barber) => barber.name === selectedBarber)
      if (!barberData) {
        throw new Error("Selected barber not found in available barbers.")
      }

      const styles = barberData.styles || []
      console.log("Fetched styles for barber:", styles)

      const formattedStyles = styles.map((style) => ({
        name: style.style,
        styleId: style.styleId,
        timing: style.timing.value,
        timingUnit: style.timing.unit,
      }))

      setAvailableStyles(formattedStyles)
    } catch (err) {
      console.error("Error fetching styles:", err.message)
      setError(err.message || "An error occurred while fetching styles")
      setAvailableStyles([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleBarberSelection = (barber) => {
    console.log("Selected barber:", barber)
    setSelectedBarber(barber.name)
    setSelectedBarberId(barber.barberId)
  }

  const handleBookClick = (time) => {
    console.log("Selected time slot:", time)
    setSelectedTime(time)
    setSelectedStyle("")
    setSelectedStyleId("")
    setSelectedTiming("")
    setSelectedTimingUnit("")
    setShowStylesScreen(true)
    fetchAvailableStyles(time)
  }

  const handleStyleChange = (style) => {
    console.log("Selected style:", style)
    setSelectedStyle(style.name)
    setSelectedStyleId(style.styleId)
    setSelectedTiming(style.timing)
    setSelectedTimingUnit(style.timingUnit)
  }

  const handleStyleSelectionClose = () => {
    console.log("Closing style selection modal. Selected style:", selectedStyle)
    setShowStylesScreen(false)

    if (selectedStyle) {
      navigate("/booking", {
        state: {
          shopDetails,
          uniqueId: shopDetails.uniqueId,
          userId,
          selectedTime,
          selectedStyle,
          selectedBarber,
          selectedBarberId,
          selectedStyleId,
          selectedTiming,
          selectedTimingUnit,
          shopName: shopDetails.shopName,
        },
      })
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
    { icon: <Home className="us-nav-icon" />, label: "Dashboard", path: "/dashboard" },
    { icon: <Search className="us-nav-icon" />, label: "Search Shops", path: "/search", active: true },
    { icon: <CalendarIcon className="us-nav-icon" />, label: "Bookings", path: "/bookings" },
    { icon: <UserCircle className="us-nav-icon" />, label: "Profile", path: "/profile" },
    { icon: <Settings className="us-nav-icon" />, label: "Settings", path: "/settings" },
  ]

  if (!shopDetails && error) {
    return (
      <div className="us-error-container">
        <div className="us-error-card">
          <div className="us-error-content">
            <Info className="us-error-icon" />
            <h2 className="us-error-title">Oops!</h2>
            <p className="us-error-message">{error}</p>
            <button onClick={() => navigate("/search")} className="us-back-button">
              <ChevronLeft className="us-icon-small" /> Back to Search
            </button>
          </div>
        </div>
      </div>
    )
  }

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
                navigate(item.path)
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
            <h1 className="us-page-title">Book Appointment</h1>
          </div>
          <div className="us-topbar-right">
            <div className="us-user-id">User ID: {userId || "681f869d1827a9895634dda"}</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="us-content">
          <div className="us-booking-container">
            {/* Back button and time */}
            <div className="us-booking-header">
              <button className="us-back-btn" onClick={() => navigate(-1)}>
                <ChevronLeft className="us-icon" />
              </button>
              <div className="us-current-time">
                <Clock className="us-icon-small" />
                <span>{formatTime(currentTime)}</span>
              </div>
            </div>

            {/* Shop name and date */}
            <div className="us-shop-header">
              <h2 className="us-shop-name">{shopDetails?.shopName || "Shop"}</h2>
              <div className="us-date">
                <Calendar className="us-icon-small" />
                <span>{formatDate(currentDate)}</span>
              </div>
            </div>

            {/* Shop details card */}
            <div className="us-details-card">
              <div className="us-details-grid">
                <div className="us-detail-item">
                  <div className="us-detail-icon">
                    <User />
                  </div>
                  <div className="us-detail-content">
                    <span className="us-detail-label">OWNER</span>
                    <span className="us-detail-value">{shopDetails?.ownerName || "N/A"}</span>
                  </div>
                </div>

                <div className="us-detail-item">
                  <div className="us-detail-icon">
                    <Phone />
                  </div>
                  <div className="us-detail-content">
                    <span className="us-detail-label">CONTACT</span>
                    <span className="us-detail-value">{shopDetails?.ownerContact || "N/A"}</span>
                  </div>
                </div>

                <div className="us-detail-item">
                  <div className="us-detail-icon">
                    <MapPin />
                  </div>
                  <div className="us-detail-content">
                    <span className="us-detail-label">ADDRESS</span>
                    <span className="us-detail-value">{shopDetails?.address || "N/A"}</span>
                  </div>
                </div>

                <div className="us-detail-item">
                  <div className="us-detail-icon">
                    <Clock />
                  </div>
                  <div className="us-detail-content">
                    <span className="us-detail-label">OPEN HOURS</span>
                    <span className="us-detail-value">{shopDetails?.openHours || "N/A"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Barber selection section */}
            <div className="us-selection-section">
              <div className="us-section-title">
                <User className="us-section-icon" />
                <h3>Select Your Barber</h3>
              </div>
              <p className="us-section-desc">Choose your preferred barber for your appointment</p>

              {isLoading ? (
                <div className="us-loading">
                  <div className="us-spinner"></div>
                  <p>Loading available barbers...</p>
                </div>
              ) : error ? (
                <div className="us-error">
                  <Info className="us-error-icon-small" />
                  <p>{error}</p>
                </div>
              ) : availableBarbers.length === 0 ? (
                <div className="us-empty">
                  <Info className="us-info-icon-small" />
                  <p>No barbers available. Please try another shop.</p>
                </div>
              ) : (
                <div className="us-barber-grid">
                  {availableBarbers.map((barber) => (
                    <div
                      key={barber.barberId}
                      className={`us-barber-card ${selectedBarber === barber.name ? "us-selected" : ""}`}
                      onClick={() => handleBarberSelection(barber)}
                    >
                      <span className="us-barber-name">{barber.name}</span>
                      <div className={`us-radio ${selectedBarber === barber.name ? "us-radio-selected" : ""}`}>
                        {selectedBarber === barber.name && <Check className="us-check-icon" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Time slots section */}
            {selectedBarber && (
              <div className="us-selection-section">
                <div className="us-section-title">
                  <Clock className="us-section-icon" />
                  <h3>Available Time Slots</h3>
                </div>
                <p className="us-section-desc">Select a convenient time for your appointment with {selectedBarber}</p>

                {timeSlots.length === 0 ? (
                  <div className="us-empty">
                    <Info className="us-info-icon-small" />
                    <p>No available time slots for this shop.</p>
                  </div>
                ) : (
                  <div className="us-time-grid">
                    {timeSlots.map((slot, index) => (
                      <div key={index} className={`us-time-card ${slot.isLunchBreak ? "us-lunch-break" : ""}`}>
                        <span className="us-time-text">{slot.time}</span>
                        {!slot.isLunchBreak && (
                          <button onClick={() => handleBookClick(slot.time)} className="us-select-btn">
                            Select <ChevronRight className="us-icon-small" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Style Selection Modal */}
      {showStylesScreen && (
        <div className="us-modal-overlay" onClick={() => setShowStylesScreen(false)}>
          <div className="us-modal" onClick={(e) => e.stopPropagation()}>
            <div className="us-modal-header">
              <div className="us-modal-title">
                <Scissors className="us-section-icon" />
                <h2>Select Your Style</h2>
              </div>
              <div className="us-time-badge">{selectedTime}</div>
              <button className="us-close-btn" onClick={() => setShowStylesScreen(false)}>
                <X className="us-icon" />
              </button>
            </div>

            <div className="us-separator"></div>

            {isLoading ? (
              <div className="us-loading">
                <div className="us-spinner"></div>
                <p>Loading available styles...</p>
              </div>
            ) : error ? (
              <div className="us-error">
                <Info className="us-error-icon-small" />
                <p>{error}</p>
              </div>
            ) : availableStyles.length === 0 ? (
              <div className="us-empty">
                <Info className="us-info-icon-small" />
                <p>No styles available for this time slot. Please select another time.</p>
              </div>
            ) : (
              <>
                <p className="us-modal-desc">Choose the style you prefer for your appointment</p>
                <div className="us-style-grid">
                  {availableStyles.map((style) => (
                    <div
                      key={style.styleId}
                      className={`us-style-card ${selectedStyle === style.name ? "us-selected" : ""}`}
                      onClick={() => handleStyleChange(style)}
                    >
                      <div className="us-style-content">
                        <div className="us-style-info">
                          <span className="us-style-name">{style.name}</span>
                          <span className="us-style-duration">
                            {style.timing} {style.timingUnit}
                          </span>
                        </div>
                        <div className={`us-radio ${selectedStyle === style.name ? "us-radio-selected" : ""}`}>
                          {selectedStyle === style.name && <Check className="us-check-icon" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="us-modal-footer">
              <button className="us-cancel-btn" onClick={() => setShowStylesScreen(false)}>
                Cancel
              </button>
              <button
                className={`us-confirm-btn ${!selectedStyle ? "us-disabled" : ""}`}
                onClick={handleStyleSelectionClose}
                disabled={!selectedStyle}
              >
                Confirm Selection <Check className="us-icon-small" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserSelection
