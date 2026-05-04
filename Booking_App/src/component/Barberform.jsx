"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate, useLocation, Link } from "react-router-dom"
import "./barberform.css"
import BASE_URL from "../api"

const Barberform = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Extract adminId from location.state or localStorage (fallback)
  const adminId = location.state?.adminId || localStorage.getItem("adminId")

  console.log("Admin ID in Barberform:", adminId) // Debugging log

  const [formData, setFormData] = useState({
    email: "",
    ownerName: "",
    ownerContact: "",
    shopName: "",
    description: "",
    openHours: "",
    address: "",
  })

  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (!adminId) {
      setError("Admin not logged in. Please log in first.")
      setIsSubmitting(false)
      return
    }

    if (Object.values(formData).some((value) => value.trim() === "")) {
      setError("Please fill in all fields before submitting.")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Form data before submission:", formData)

      const response = await axios.post(`${BASE_URL}/api/barbershops`, {
        adminId, // Send admin ID
        ...formData,
      })

      const uniqueId = response.data.uniqueId
      setSuccessMessage("Shop registered successfully")
      setError("")

      setFormData({
        adminId,
        email: "",
        ownerName: "",
        ownerContact: "",
        shopName: "",
        description: "",
        openHours: "",
        address: "",
      })

      navigate("/add-barbers", { state: { uniqueId, adminId } })
    } catch (error) {
      setError(error.response?.data?.message || "Error registering shop")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/logout`, {}, { withCredentials: true })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("adminId")
      navigate("/barberlogin")
    }
  }

  return (
    <div className="barberform-page barber-form-wrapper">
      <div className="barber-top-nav">
        <div className="barber-brand">
          <i className="fas fa-cut"></i>
          <span>LOOK LIKE</span>
        </div>
        <div className="barber-nav-right">
          <div className="barber-info-box">
            <i className="fas fa-user-circle"></i>
            <span>Admin ID: {adminId}</span>
          </div>
          <button className="barber-logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </div>

      <div className="barber-sidebar">
        <div className="barber-sidebar-header">
          <h2>Barbershop Admin</h2>
          <p className="barber-sidebar-id">ID: {adminId}</p>
        </div>
        <nav className="barber-nav-menu">
          <Link to="/barberhome" className="barber-nav-link">
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </Link>
          <Link to="/barberform" className="barber-nav-link active">
            <i className="fas fa-store"></i>
            <span>Add Shops</span>
          </Link>
          <Link to="/appointments" state={{ adminId }} className="barber-nav-link">
            <i className="fas fa-calendar"></i>
            <span>Appointments</span>
          </Link>
          <Link to="/daily" className="barber-nav-link">
            <i className="fas fa-clock"></i>
            <span>Daily Update</span>
          </Link>
        </nav>
      </div>

      <div className="barber-main-content">
        <div className="barber-form-container">
          <h1 className="barber-form-title">Add New Barbershop</h1>

          <div className="barber-form-card">
            <div className="barber-form-header">
              <div className="barber-form-image">
                <img
                  src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2074&auto=format&fit=crop"
                  alt="Barbershop"
                  className="barber-image"
                />
              </div>
            </div>

            <div className="barber-form-content">
              {error && <div className="alert alert-error">{error}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="email" className="form-label">
                      <i className="fas fa-envelope"></i>
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      placeholder="Enter Email"
                      className="form-input"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="ownerName" className="form-label">
                      <i className="fas fa-user"></i>
                      Owner Name
                    </label>
                    <input
                      type="text"
                      id="ownerName"
                      name="ownerName"
                      value={formData.ownerName}
                      placeholder="Enter Owner Name"
                      className="form-input"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="ownerContact" className="form-label">
                      <i className="fas fa-phone"></i>
                      Owner Contact
                    </label>
                    <input
                      type="text"
                      id="ownerContact"
                      name="ownerContact"
                      value={formData.ownerContact}
                      placeholder="Enter Owner Contact"
                      className="form-input"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="shopName" className="form-label">
                      <i className="fas fa-store"></i>
                      Shop Name
                    </label>
                    <input
                      type="text"
                      id="shopName"
                      name="shopName"
                      value={formData.shopName}
                      placeholder="Enter Shop Name"
                      className="form-input"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field form-grid full">
                    <label htmlFor="description" className="form-label">
                      <i className="fas fa-file-alt"></i>
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      placeholder="Enter Shop Description"
                      className="form-textarea"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label htmlFor="openHours" className="form-label">
                      <i className="fas fa-clock"></i>
                      Open Hours
                    </label>
                    <input
                      type="text"
                      id="openHours"
                      name="openHours"
                      value={formData.openHours}
                      placeholder="e.g., 9:00 AM - 6:00 PM"
                      className="form-input"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-field form-grid full">
                    <label htmlFor="address" className="form-label">
                      <i className="fas fa-map-marker-alt"></i>
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      placeholder="Enter Shop Address"
                      className="form-input"
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => navigate("/barberhome", { state: { adminId } })}>
                    Cancel
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

export default Barberform
