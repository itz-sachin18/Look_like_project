
import { useState, useEffect } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"
import { Clock, Users, Scissors, Plus, Check } from "lucide-react"
import "./Addbarbers.css"
import { API_BASE_URL } from '../apiConfig';

const Addbarbers = () => {
  const location = useLocation()
  const [dateTime, setDateTime] = useState(new Date())
  const [barbersCount, setBarbersCount] = useState(1)
  const [barberNames, setBarberNames] = useState([""])
  const [styles, setStyles] = useState([
    "Haircut",
    "Haircut + Shaving",
    "Trimming",
    "Haircut + Trimming + Facial",
    "Packages",
  ])
  const [selectedStyles, setSelectedStyles] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()
  const { uniqueId, adminId } = location.state || {}

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const handleBarbersCountChange = (e) => {
    const count = Number.parseInt(e.target.value, 10) || 0
    setBarbersCount(count)
    const updatedBarberNames = [...barberNames]
    if (count > barberNames.length) {
      for (let i = barberNames.length; i < count; i++) {
        updatedBarberNames.push("")
      }
    } else {
      updatedBarberNames.length = count
    }
    setBarberNames(updatedBarberNames)
  }

  const handleBarberNameChange = (index, value) => {
    const updatedBarberNames = [...barberNames]
    updatedBarberNames[index] = value
    setBarberNames(updatedBarberNames)
  }

  const handleStyleChange = (e) => {
    const { value, checked } = e.target
    if (value === "Select All") {
      setSelectedStyles(checked ? [...styles] : [])
    } else {
      setSelectedStyles((prev) => (checked ? [...prev, value] : prev.filter((style) => style !== value)))
    }
  }

  const addMoreStyle = () => {
    const newStyle = prompt("Enter a new style:")
    if (newStyle) {
      setStyles((prev) => [...prev, newStyle])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (barberNames.some((name) => name === "")) {
      alert("Please enter all barber names.")
      setIsSubmitting(false)
      return
    }

    if (selectedStyles.length === 0) {
      alert("Please select at least one style.")
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/barbers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barberNames, selectedStyles, uniqueId }),
      })

      const data = await response.json()

      if (response.ok) {
        alert(data.message)
        navigate("/timer-styles", {
          state: { barberNames, selectedStyles, uniqueId },
        })
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error("Error submitting data:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
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
            <Link to="/daily" className="nav-item active">
              <i className="fas fa-clock"></i>
              <span>Daily Update</span>
            </Link>
          </nav>
        </div>

        <div className="main-content">
          <div className="page-header">
            <h1>Add Shop Details</h1>
            <div className="breadcrumb">
              <i className="fas fa-store"></i>
              <span>Add Barbers</span>
            </div>
          </div>

          <div className="content-wrapper">
            <div className="barber-form-container">
              <div className="barber-form-header">
                <h2 className="barber-form-title">Barber & Services Setup</h2>
                <div className="barber-form-datetime">
                  <Clock size={16} />
                  <span>{dateTime.toLocaleString()}</span>
                </div>
              </div>

              <form className="barber-form" onSubmit={handleSubmit}>
                <div className="barber-form-section">
                  <div className="barber-form-section-header">
                    <Users size={20} />
                    <h3>Barber Information</h3>
                  </div>

                  <div className="barber-form-field">
                    <label htmlFor="barbersCount">Number of Barbers</label>
                    <input
                      id="barbersCount"
                      type="number"
                      placeholder="How many barbers available?"
                      className="barber-form-input"
                      value={barbersCount}
                      onChange={handleBarbersCountChange}
                      min="1"
                    />
                  </div>

                  <div className="barber-names-grid">
                    {Array.from({ length: barbersCount }).map((_, index) => (
                      <div key={index} className="barber-form-field">
                        <label htmlFor={`barber-${index}`}>Barber {index + 1}</label>
                        <input
                          id={`barber-${index}`}
                          type="text"
                          placeholder={`Enter Barber Name ${index + 1}`}
                          className="barber-form-input"
                          value={barberNames[index]}
                          onChange={(e) => handleBarberNameChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="barber-form-section">
                  <div className="barber-form-section-header">
                    <Scissors size={20} />
                    <h3>Available Services</h3>
                    {uniqueId && <div className="shop-id">Shop ID: {uniqueId}</div>}
                  </div>

                  <div className="barber-styles-container">
                    <div className="barber-style-select-all">
                      <label className="barber-style-checkbox">
                        <input
                          type="checkbox"
                          value="Select All"
                          onChange={handleStyleChange}
                          checked={selectedStyles.length === styles.length && styles.length > 0}
                        />
                        <span className="checkmark"></span>
                        <span className="label-text">Select All Services</span>
                      </label>
                    </div>

                    <div className="barber-styles-grid">
                      {styles.map((style, index) => (
                        <label key={index} className="barber-style-checkbox">
                          <input
                            type="checkbox"
                            value={style}
                            onChange={handleStyleChange}
                            checked={selectedStyles.includes(style)}
                          />
                          <span className="checkmark"></span>
                          <span className="label-text">{style}</span>
                        </label>
                      ))}
                    </div>

                    <button type="button" className="barber-add-style-button" onClick={addMoreStyle}>
                      <Plus size={16} />
                      Add Custom Service
                    </button>
                  </div>
                </div>

                <div className="barber-form-actions">
                  <button className="barber-submit-button" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Continue to Set Timing"}
                    {!isSubmitting && <Check size={16} className="button-icon" />}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Addbarbers
