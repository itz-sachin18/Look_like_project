

import { useEffect, useState } from "react"
import { useLocation, useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { Calendar, Clock, User, CheckCircle, AlertCircle } from "lucide-react"
import "./Appointment.css"

const Appointment = () => {
  const { state } = useLocation()
  const { adminId, updatedUserId, newStatus } = state || {}
  const navigate = useNavigate()
  const [barberData, setBarberData] = useState([])
  const [selectedBarber, setSelectedBarber] = useState("")
  const [selectedBarberId, setSelectedBarberId] = useState("")
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [appointmentsLoading, setAppointmentsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [appointmentsError, setAppointmentsError] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!adminId) {
      navigate("/barberlogin")
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        const shopResponse = await axios.get(`http://localhost:5000/api/shops/admin/${adminId}`, {
          withCredentials: true,
        })

        if (shopResponse.data && shopResponse.data.uniqueId) {
          const barbersResponse = await axios.get(
            `http://localhost:5000/api/appointments/${shopResponse.data.uniqueId}`,
            { withCredentials: true },
          )

          setBarberData(barbersResponse.data)
          const names = barbersResponse.data.map((barber) => barber.name)
          if (names.length > 0) {
            setSelectedBarber(names[0])
            const firstBarber = barbersResponse.data[0]
            setSelectedBarberId(firstBarber.barberId)
          }
        } else {
          setError("No shop found for this admin.")
        }
      } catch (err) {
        console.error("Error fetching barbers:", err)
        setError("Failed to load barbers. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [adminId, navigate])

  useEffect(() => {
    if (!selectedBarberId) return

    const fetchAppointments = async () => {
      try {
        setAppointmentsLoading(true)
        setAppointmentsError(null)
        const response = await axios.get(`http://localhost:5000/api/api/bookings/barber/${selectedBarberId}`, {
          withCredentials: true,
        })

        let updatedAppointments = response.data || []

        // Update appointment status if navigated back from QR code scan
        if (updatedUserId && newStatus) {
          updatedAppointments = updatedAppointments.map((appt) =>
            appt.userId === updatedUserId ? { ...appt, status: newStatus } : appt
          )
        }

        setAppointments(updatedAppointments)
      } catch (err) {
        console.error("Error fetching appointments:", err)
        setAppointmentsError("Failed to load appointments. Please try again.")
      } finally {
        setAppointmentsLoading(false)
      }
    }

    fetchAppointments()
  }, [selectedBarberId, updatedUserId, newStatus])

  const handleBarberChange = (event) => {
    const selectedName = event.target.value
    setSelectedBarber(selectedName)
    const selectedBarberData = barberData.find((barber) => barber.name === selectedName)
    if (selectedBarberData) {
      setSelectedBarberId(selectedBarberData.barberId)
    }
  }

  const handleScanQRCode = (appointment) => {
    // Format bookingDate to match QR code format (M/D/YYYY)
    const bookingDate = new Date(appointment.bookingDate).toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    })

    const qrCodeData = {
      adminId,
      userId: appointment.userId,
      bookingDate,
      time: appointment.time,
      returnPath: "/appointments",
    };

    console.log("[APPOINTMENT] Navigating to /qrcode with data:", qrCodeData);

    navigate("/qrcode", {
      state: qrCodeData,
    })
  }

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <CheckCircle className="appt-status-icon completed" />
      case "pending":
        return <AlertCircle className="appt-status-icon pending" />
      default:
        return null
    }
  }

  return (
    <div className="appt-layout">
      {/* Top Navigation */}
      <div className="appt-topbar">
        <div className="appt-brand">
          <i className="fas fa-cut"></i>
          <span>LOOK LIKE</span>
        </div>
        <div className="appt-nav-right">
          <div className="appt-admin-info">
            <i className="fas fa-user-circle"></i>
            <span>Admin ID: {adminId}</span>
          </div>
        </div>
      </div>

      <div className="appt-container">
        {/* Sidebar */}
        <aside className="appt-sidebar">
          <div className="appt-sidebar-header">
            <h2>Barbershop Admin</h2>
            <p className="appt-admin-id">ID: {adminId}</p>
          </div>
          <nav className="appt-nav-menu">
            <Link to="/barberhome" className="appt-nav-item">
              <i className="fas fa-home"></i>
              <span>Dashboard</span>
            </Link>
            <Link to="/barberform" className="appt-nav-item">
              <i className="fas fa-store"></i>
              <span>Add Shops</span>
            </Link>
            <Link to="/appointments" className="appt-nav-item active">
              <i className="fas fa-calendar"></i>
              <span>Appointments</span>
            </Link>
            <Link to="/daily" className="appt-nav-item">
              <i className="fas fa-clock"></i>
              <span>Daily Update</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="appt-main">
          <div className="appt-dashboard">
            {/* Current Date and Time */}
            <div className="appt-datetime-card">
              <div className="appt-datetime-icon">
                <Clock size={24} />
              </div>
              <div className="appt-datetime-info">
                <h3 className="appt-datetime-title">Current Date & Time</h3>
                <p className="appt-datetime-value">
                  {currentTime.toLocaleString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    timeZone: "Asia/Kolkata",
                  })}
                </p>
              </div>
            </div>

            <div className="appt-main-container">
              <div className="appt-section appt-barbers-section">
                <div className="appt-section-header">
                  <User size={20} className="appt-section-icon" />
                  <h2 className="appt-section-title">Select Barber</h2>
                </div>

                <div className="appt-section-content">
                  {loading && <div className="appt-loading">Loading barbers...</div>}
                  {error && <div className="appt-error">{error}</div>}

                  {!loading && !error && (
                    <>
                      {barberData.length > 0 ? (
                        <div className="appt-barber-list">
                          {barberData.map((barber, index) => (
                            <label key={index} className="appt-barber-option">
                              <input
                                type="radio"
                                name="barber"
                                value={barber.name}
                                checked={selectedBarber === barber.name}
                                onChange={handleBarberChange}
                                className="appt-barber-radio"
                              />
                              <span className="appt-barber-checkmark"></span>
                              <span className="appt-barber-name">{barber.name}</span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="appt-empty-state">
                          <p>No barbers found for this shop.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="appt-section appt-appointments-section">
                <div className="appt-section-header">
                  <Calendar size={20} className="appt-section-icon" />
                  <h2 className="appt-section-title">
                    Appointments for <span className="appt-selected-barber">{selectedBarber}</span>
                  </h2>
                </div>

                <div className="appt-section-content">
                  {appointmentsLoading && <div className="appt-loading">Loading appointments...</div>}
                  {appointmentsError && <div className="appt-error">{appointmentsError}</div>}

                  {!appointmentsLoading && !appointmentsError && (
                    <>
                      {appointments.length > 0 ? (
                        <div className="appt-appointments-grid">
                          {appointments.map((appointment, index) => (
                            <div key={index} className="appt-appointment-card">
                              <div className="appt-appointment-header">
                                <div className="appt-appointment-status">
                                  {getStatusIcon(appointment.status)}
                                  <span className={`appt-status-badge ${appointment.status.toLowerCase()}`}>
                                    {appointment.status}
                                  </span>
                                </div>
                              </div>
                              <div className="appt-appointment-body">
                                <div className="appt-appointment-detail">
                                  <span className="appt-detail-label">Client:</span>
                                  <span className="appt-detail-value">
                                    {appointment.userName} ({appointment.userEmail || appointment.userPEmail})
                                  </span>
                                </div>
                                <div className="appt-appointment-detail">
                                  <span className="appt-detail-label">Service:</span>
                                  <span className="appt-detail-value">
                                    {appointment.service} - {appointment.time}
                                  </span>
                                </div>
                                <div className="appt-appointment-detail">
                                  <span className="appt-detail-label">Date:</span>
                                  <span className="appt-detail-value">
                                    {new Date(appointment.bookingDate).toLocaleString("en-IN", {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      timeZone: "Asia/Kolkata",
                                    })}
                                  </span>
                                </div>
                                {appointment.status.toLowerCase() === "pending" && (
                                  <button
                                    onClick={() => handleScanQRCode(appointment)}
                                    className="appt-qr-button"
                                    style={{ marginTop: "10px" }}
                                  >
                                    Scan QR Code
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="appt-empty-state">
                          <p>No appointments found for this barber.</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Appointment
