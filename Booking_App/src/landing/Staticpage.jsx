import { useState } from "react";
import {
  Scissors,
  Users,
  Star,
  Calendar,
  ChevronRight,
  Clock,
  DollarSign,
  Sparkles,
  User,
  ArrowRight,
} from "lucide-react";
import "./staticpage.css";
import { Link } from "react-router-dom";

function Staticpage() {
  const [activeService, setActiveService] = useState("haircut");

  const services = {
    haircut: {
      title: "Professional Haircuts",
      description: "Expert styling and cutting services tailored to your preferences",
      features: [
        "Consultation and style advice",
        "Precision cutting techniques",
        "Styling and finishing",
        "Aftercare recommendations",
      ],
      price: "Starting from $25",
      duration: "45-60 minutes",
      popular: true,
    },
    shaving: {
      title: "Classic Shaving",
      description: "Traditional wet shave experience with hot towels and premium products",
      features: ["Hot towel preparation", "Premium shaving cream", "Straight razor technique", "Aftershave treatment"],
      price: "Starting from $20",
      duration: "30-45 minutes",
      popular: false,
    },
    trimming: {
      title: "Beard Trimming",
      description: "Professional beard shaping and maintenance services",
      features: ["Beard consultation", "Precision trimming", "Shape and styling", "Beard oil application"],
      price: "Starting from $15",
      duration: "20-30 minutes",
      popular: false,
    },
    packages: {
      title: "Complete Packages",
      description: "Comprehensive grooming packages for the complete experience",
      features: ["Haircut + Beard trim", "Shave + Styling", "Full grooming service", "Premium product treatment"],
      price: "Starting from $45",
      duration: "90-120 minutes",
      popular: true,
    },
    hairwash: {
      title: "Hair Wash & Treatment",
      description: "Relaxing hair wash with premium shampoos and treatments",
      features: ["Deep cleansing shampoo", "Scalp massage", "Conditioning treatment", "Blow dry and basic styling"],
      price: "Starting from $12",
      duration: "20-25 minutes",
      popular: false,
    },
    styling: {
      title: "Hair Styling",
      description: "Professional styling for special occasions and events",
      features: ["Event consultation", "Premium styling products", "Long-lasting hold", "Photo-ready finish"],
      price: "Starting from $30",
      duration: "30-45 minutes",
      popular: false,
    },
  };

  return (
    <div className="app">
      {/* New Top Navbar */}
      <nav className="top-navbar">
        <div className="container">
          <div className="top-navbar-content">
            <div className="top-nav-links">
              <a href="#" className="top-nav-link">HOME</a>
              <a href="#services" className="top-nav-link">SERVICES</a>
              <a href="#work" className="top-nav-link">WORKS</a>
              <a href="#about" className="top-nav-link">ABOUT</a>
              <a href="#role" className="top-nav-link">ROLE</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Existing Navigation */}
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <div className="logo">
              <div className="logo-icon">
                <Scissors className="icon" />
              </div>
              <span className="logo-text">LOOK LIKE</span>
            </div>

            <div className="nav-links">
              <a href="#services" className="nav-link">
                Services
              </a>
              <a href="#work" className="nav-link">
                How It Works
              </a>
              <a href="#about" className="nav-link">
                About
              </a>
              <a href="#features" className="nav-link">
                Features
              </a>
              <a href="#role" className="nav-link">
                Choose Role
              </a>
            </div>

            <div className="nav-action">
              <button className="btn btn-primary" onClick={() => window.location.href = "/chooserole"}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Book your perfect <span className="highlight">haircut</span> in seconds
              </h1>
              <p className="hero-description">
                Say goodbye to phone calls and long waits. Our centralized platform connects you with the best barbers
                in your area, offering real-time availability, secure payments, and personalized service
                recommendations.
              </p>
              <div className="hero-actions">
                <button className="b-btn">
                  Find a Barber
                  <ArrowRight className="btn-icon" />
                </button>
                <button className="btn btn-outline btn-lg">Join as Barber</button>
              </div>
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Verified Barbers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Happy Customers</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">4.8★</span>
                  <span className="stat-label">Average Rating</span>
                </div>
              </div>
            </div>
            <div className="hero-image">
              <div className="image-bg"></div>
              <div className="floating-card card-1">
                <Calendar className="card-icon" />
                <span>Real-time Booking</span>
              </div>
              <div className="floating-card card-2">
                <Star className="card-icon" />
                <span>5-Star Reviews</span>
              </div>
              <img src="https://th.bing.com/th/id/OIP.TPTkHXF1MMkGutZ_TwlRwgHaFj?w=250&h=187&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt="Barber cutting hair" className="main-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Services</h2>
            <p className="section-description">Professional grooming services tailored to your needs</p>
          </div>

          <div className="services-container">
            <div className="service-tabs">
              {Object.entries(services).map(([key, service]) => (
                <button
                  key={key}
                  className={`service-tab ${activeService === key ? "active" : ""}`}
                  onClick={() => setActiveService(key)}
                >
                  <span className="tab-title">{service.title}</span>
                  {service.popular && <span className="popular-badge">Popular</span>}
                  <ChevronRight className="tab-arrow" />
                </button>
              ))}
            </div>

            <div className="service-content">
              <div className="service-details">
                <div className="service-header">
                  <h3 className="service-title">{services[activeService].title}</h3>
                  {services[activeService].popular && (
                    <span className="popular-tag">
                      <Sparkles className="sparkle-icon" />
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="service-description">{services[activeService].description}</p>

                <div className="service-info">
                  <div className="info-item">
                    <DollarSign className="info-icon" />
                    <span>{services[activeService].price}</span>
                  </div>
                  <div className="info-item">
                    <Clock className="info-icon" />
                    <span>{services[activeService].duration}</span>
                  </div>
                </div>

                <div className="service-features">
                  <h4>What's Included:</h4>
                  <ul>
                    {services[activeService].features.map((feature, index) => (
                      <li key={index}>
                        <div className="feature-bullet"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="btn btn-primary btn-lg service-cta">
                  Book This Service
                  <ArrowRight className="btn-icon" />
                </button>
              </div>

              <div className="service-image">
                <img
                  src={`https://placehold.co/400x300?text=${services[activeService].title}`}
                  alt={services[activeService].title}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="work" className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-description">Simple steps to get your perfect haircut booked in minutes</p>
          </div>

          <div className="workflow-diagram">
            <div className="workflow-step">
              <div className="step-node customer">
                <User className="node-icon" />
                <span className="node-label">Customer</span>
              </div>
              <div className="step-content">
                <h3>Browse & Search</h3>
                <p>Find barbers in your area, check profiles, reviews, and availability</p>
              </div>
            </div>

            <div className="workflow-arrow">
              <ArrowRight className="arrow-icon" />
            </div>

            <div className="workflow-step">
              <div className="step-node platform">
                <Calendar className="node-icon" />
                <span className="node-label">Platform</span>
              </div>
              <div className="step-content">
                <h3>Real-time Matching</h3>
                <p>Our system matches you with available barbers based on your preferences</p>
              </div>
            </div>

            <div className="workflow-arrow">
              <ArrowRight className="arrow-icon" />
            </div>

            <div className="workflow-step">
              <div className="step-node barber">
                <Scissors className="node-icon" />
                <span className="node-label">Barber</span>
              </div>
              <div className="step-content">
                <h3>Instant Confirmation</h3>
                <p>Barber confirms your appointment and you receive booking details</p>
              </div>
            </div>

            <div className="workflow-arrow">
              <ArrowRight className="arrow-icon" />
            </div>

            <div className="workflow-step">
              <div className="step-node service">
                <Star className="node-icon" />
                <span className="node-label">Service</span>
              </div>
              <div className="step-content">
                <h3>Enjoy & Review</h3>
                <p>Get your service, pay securely, and leave a review for others</p>
              </div>
            </div>
          </div>

          <div className="use-cases">
            <h3 className="use-cases-title">Common Use Cases</h3>
            <div className="use-cases-grid">
              <div className="use-case-card">
                <div className="use-case-icon">
                  <Clock className="icon" />
                </div>
                <h4>Last-Minute Booking</h4>
                <p>Need a quick trim? Find available slots in the next hour</p>
              </div>
              <div className="use-case-card">
                <div className="use-case-icon">
                  <Star className="icon" />
                </div>
                <h4>Special Occasions</h4>
                <p>Book premium styling for weddings, interviews, or events</p>
              </div>
              <div className="use-case-card">
                <div className="use-case-icon">
                  <Users className="icon" />
                </div>
                <h4>Group Bookings</h4>
                <p>Coordinate appointments for family or friends</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">About BarberBook</h2>
              <p className="about-description">
                We recognized the challenges in the barber service industry - from customers struggling to find and book
                appointments to barbershops managing their bookings inefficiently. Traditional methods like phone calls
                and walk-ins often lead to scheduling conflicts and missed opportunities.
              </p>
              <p className="about-description">
                BarberBook was created to bridge this gap by providing a centralized, user-friendly platform that
                benefits both customers and barbers. Our mission is to modernize the barbering industry through
                technology while maintaining the personal touch that makes each barbershop unique.
              </p>
              <div className="stats-grid">
                <div className="stat">
                  <h4 className="stat-number">500+</h4>
                  <p className="stat-label">Verified Barbers</p>
                </div>
                <div className="stat">
                  <h4 className="stat-number">10K+</h4>
                  <p className="stat-label">Happy Customers</p>
                </div>
                <div className="stat">
                  <h4 className="stat-number">50+</h4>
                  <p className="stat-label">Cities Covered</p>
                </div>
                <div className="stat">
                  <h4 className="stat-number">4.8★</h4>
                  <p className="stat-label">Average Rating</p>
                </div>
              </div>
            </div>
            <div className="about-image">
              <img src="https://deerfieldsquareshopping.com/wp-content/uploads/2025/01/INTERIOR-_Oteros-Barber-Shop.webp" alt="Barbershop interior" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <div className="section-header light">
            <h2 className="section-title">Why Choose BarberBook?</h2>
            <p className="section-description">
              We solve the real problems faced by both customers and barbershops in the industry
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <h3 className="feature-title">For Customers</h3>
              <ul className="feature-list">
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <span>No more phone calls or waiting in line</span>
                </li>
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <span>Real-time availability and instant booking</span>
                </li>
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <span>Detailed barber profiles with reviews</span>
                </li>
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <span>Secure payment processing</span>
                </li>
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <span>Personalized service recommendations</span>
                </li>
              </ul>
            </div>

            <div className="feature-card">
              <h3 className="feature-title">For Barbershops</h3>
              <ul className="feature-list">
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <span>Automated booking management system</span>
                </li>
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <span>Customer preference tracking</span>
                </li>
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <span>Business analytics and insights</span>
                </li>
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <span>Promotional tools and marketing</span>
                </li>
                <li className="feature-item">
                  <div className="feature-bullet"></div>
                  <span>Reduced no-shows and cancellations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Choose Role Section */}
      <section id="role" className="choose-role">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Choose Your Role</h2>
            <p className="section-description">
              Whether you're looking for a great haircut or want to grow your barbershop business, we have the perfect
              solution for you
            </p>
          </div>

          <div className="role-cards">
            <div className="role-card customer">
              <div className="role-icon-wrapper">
                <Users className="role-icon" />
              </div>
              <h3 className="role-title">I'm a Customer</h3>
              <p className="role-description">Looking for the perfect barber and want to book appointments easily</p>
              <ul className="role-features">
                <li>• Browse verified barber profiles</li>
                <li>• Book appointments instantly</li>
                <li>• Read reviews and ratings</li>
                <li>• Secure payment processing</li>
                <li>• Get personalized recommendations</li>
              </ul>
              <button className="btn btn-primary btn-full">Find a Barber</button>
            </div>

            <div className="role-card barber">
              <div className="role-icon-wrapper barber-icon">
                <Scissors className="role-icon" />
              </div>
              <h3 className="role-title">I'm a Barber</h3>
              <p className="role-description">Want to grow my business and manage appointments more efficiently</p>
              <ul className="role-features">
                <li>• Automated booking management</li>
                <li>• Business analytics dashboard</li>
                <li>• Customer preference tracking</li>
                <li>• Promotional tools</li>
                <li>• Secure payment processing</li>
              </ul>
              <button className="btn btn-secondary btn-full">Join as Barber</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <Scissors className="icon-small" />
                </div>
                <span className="footer-logo-text">BarberBook</span>
              </div>
              <p className="footer-description">
                Revolutionizing the barbering industry through technology and seamless user experience.
              </p>
            </div>

            <div className="footer-links">
              <div className="footer-column">
                <h4 className="footer-heading">For Customers</h4>
                <ul className="footer-menu">
                  <li>
                    <a href="#">Find Barbers</a>
                  </li>
                  <li>
                    <a href="#">Book Appointment</a>
                  </li>
                  <li>
                    <a href="#">Reviews</a>
                  </li>
                  <li>
                    <a href="#">Support</a>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">For Barbers</h4>
                <ul className="footer-menu">
                  <li>
                    <a href="#">Join Platform</a>
                  </li>
                  <li>
                    <a href="#">Dashboard</a>
                  </li>
                  <li>
                    <a href="#">Analytics</a>
                  </li>
                  <li>
                    <a href="#">Resources</a>
                  </li>
                </ul>
              </div>

              <div className="footer-column">
                <h4 className="footer-heading">Company</h4>
                <ul className="footer-menu">
                  <li>
                    <a href="#">About Us</a>
                  </li>
                  <li>
                    <a href="#">Contact</a>
                  </li>
                  <li>
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="#">Terms of Service</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2024 BarberBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Staticpage;