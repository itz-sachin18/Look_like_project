import { useState, useEffect } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import { Clock, User, Scissors, Check, AlertCircle } from 'lucide-react'
import { apiEndpoint } from '../api';
import "./timer.css"

const Timer = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const adminId = "12345" // Example admin ID

  // Data passed from AddBarbers with validation
  const { barberNames = [], selectedStyles = [], uniqueId } = location.state || {}

  // Validate required data
  useEffect(() => {
    if (!barberNames.length || !selectedStyles.length) {
      setError("Missing required data. Please add barbers and styles first.")
      setTimeout(() => {
        navigate("/add-barbers")
      }, 3000)
    }
  }, [barberNames, selectedStyles, navigate])

  // Initialize timing state with validation
  const [timing, setTiming] = useState(() => {
    try {
      return barberNames.reduce((acc, barberName) => {
        acc[barberName] = selectedStyles.reduce((styleAcc, style) => {
          styleAcc[style] = { value: "00:00", unit: "H" }
          return styleAcc
        }, {})
        return acc
      }, {})
    } catch (error) {
      console.error("Error initializing timing state:", error)
      return {}
    }
  })

  // Validate time format (HH:MM)
  const isValidTimeFormat = (time) => {
    const [hours, minutes] = time.split(":")
    const validHours = parseInt(hours) >= 0 && parseInt(hours) <= 23
    const validMinutes = parseInt(minutes) >= 0 && parseInt(minutes) <= 59
    return validHours && validMinutes
  }

  // Handle Time Change with Enhanced Validation
  const handleTimeChange = (barberName, style, value) => {
    try {
      // Remove non-numeric and non-colon characters
      let formattedValue = value.replace(/[^0-9:]/g, "")

      // Handle colon placement
      if (formattedValue.length === 2 && !formattedValue.includes(":")) {
        formattedValue += ":"
      }

      // Validate format
      const timePattern = /^([0-9]{0,2})(:?[0-9]{0,2})$/
      const match = formattedValue.match(timePattern)

      if (match) {
        setTiming((prev) => ({
          ...prev,
          [barberName]: {
            ...prev[barberName],
            [style]: {
              ...prev[barberName][style],
              value: formattedValue,
            },
          },
        }))
      }
    } catch (error) {
      console.error("Error updating time:", error)
    }
  }

  // Handle Unit Change with Validation
  const handleUnitChange = (barberName, style, unit) => {
    try {
      if (!["H", "M"].includes(unit)) {
        console.error("Invalid unit value:", unit)
        return
      }

      setTiming((prev) => ({
        ...prev,
        [barberName]: {
          ...prev[barberName],
          [style]: {
            ...prev[barberName][style],
            unit,
          },
        },
      }))
    } catch (error) {
      console.error("Error updating unit:", error)
    }
  }

  // Handle Submit with Enhanced Error Handling
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate all times before submission
    const hasInvalidTimes = Object.values(timing).some((barberTiming) =>
      Object.values(barberTiming).some((style) => !isValidTimeFormat(style.value))
    )

    if (hasInvalidTimes) {
      setError("Please ensure all times are in valid HH:MM format")
      setIsLoading(false)
      return
    }

    // Prepare data for the POST request (only send barber's name, selected style, and timing)
    const dataToSend = barberNames.map((barberName) => {
      return {
        barberName,
        styles: selectedStyles.map((style) => ({
          style,
          timing: timing[barberName]?.[style],
        })),
      }
    })

    // Log the data being sent to the backend
    console.log("Sending data to backend:", dataToSend)

    try {
  const response = await fetch(apiEndpoint(`/api/timings/save-timings/${uniqueId}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
        // Send the prepared data
      })

      const data = await response.json()

      if (data.success) {
        alert("Timings saved successfully!")
        navigate("/barberhome")
      } else {
        setError(data.message || "Failed to save timings. Please try again.")
      }
    } catch (error) {
      setError("Network error. Please check your connection and try again.")
      console.error("Error saving timings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
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
          </div>
        </div>

        <div className="dashboard-container">
          <div className="sidebar">
            <div className="logo-section">
              <h2>Barbershop Admin</h2>
              <p className="admin-id">ID: {adminId}</p>
            </div>
            <nav className="nav-menu">
              <Link to="/barberhome" className="nav-item">
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </Link>
              <Link to="/barberform" className="nav-item">
                <i className="fas fa-store"></i>
                <span>Add Shops</span>
              </Link>
              <Link to="/appointments" className="nav-item">
                <i className="fas fa-calendar"></i>
                <span>Appointments</span>
              </Link>
              <Link to="/timer-styles" className="nav-item active">
                <i className="fas fa-clock"></i>
                <span>Set Timings</span>
              </Link>
            </nav>
          </div>

          <div className="main-content">
            <div className="timer-error-container">
              <div className="timer-error-card">
                <AlertCircle size={48} className="timer-error-icon" />
                <h2 className="timer-error-title">Error</h2>
                <p className="timer-error-message">{error}</p>
                <p className="timer-error-redirect">Redirecting to previous page...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

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
        </div>
      </div>

      <div className="dashboard-container">
        <div className="sidebar">
          <div className="logo-section">
            <h2>Barbershop Admin</h2>
            <p className="admin-id">ID: {adminId}</p>
          </div>
          <nav className="nav-menu">
            <Link to="/barberhome" className="nav-item">
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </Link>
            <Link to="/barberform" className="nav-item">
              <i className="fas fa-store"></i>
              <span>Add Shops</span>
            </Link>
            <Link to="/appointments" className="nav-item">
              <i className="fas fa-calendar"></i>
              <span>Appointments</span>
            </Link>
            <Link to="/timer-styles" className="nav-item active">
              <i className="fas fa-clock"></i>
              <span>Set Timings</span>
            </Link>
          </nav>
        </div>

        <div className="main-content">
          <div className="timer-container">
            <div className="timer-header">
              <h1 className="timer-title">
                <Clock className="timer-title-icon" />
                Service Duration Setup
              </h1>
              {uniqueId && <div className="timer-shop-id">Shop ID: {uniqueId}</div>}
            </div>

            <div className="timer-description">
              Set the time required for each service by barber. This helps in scheduling appointments efficiently.
            </div>

            <form onSubmit={handleSubmit} className="timer-form">
              {barberNames.map((barber, barberIndex) => (
                <div key={barberIndex} className="timer-barber-card">
                  <div className="timer-barber-header">
                    <User className="timer-barber-icon" />
                    <h2 className="timer-barber-name">{barber}</h2>
                  </div>

                  <div className="timer-styles-grid">
                    {selectedStyles.map((style, styleIndex) => (
                      <div key={styleIndex} className="timer-style-item">
                        <div className="timer-style-header">
                          <Scissors className="timer-style-icon" />
                          <h3 className="timer-style-name">{style}</h3>
                        </div>
                        <div className="timer-input-container">
                          <input
                            type="text"
                            className="timer-time-input"
                            maxLength="5"
                            value={timing[barber]?.[style]?.value || ""}
                            onChange={(e) => handleTimeChange(barber, style, e.target.value)}
                            placeholder="00:00"
                          />
                          <select
                            className="timer-unit-select"
                            value={timing[barber]?.[style]?.unit || "H"}
                            onChange={(e) => handleUnitChange(barber, style, e.target.value)}
                          >
                            <option value="H">Hours</option>
                            <option value="M">Minutes</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="timer-actions">
                <button type="submit" className="timer-submit-button" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Service Durations"}
                  {!isLoading && <Check className="timer-button-icon" />}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timer
