import React from 'react';
import './Landing.css';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-container">
            <div className="image-container">
                <img 
                    src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3"
                    alt="Barbershop Interior" 
                    className="landing-image" 
                />
            </div>
            <div className="content-container">
                <h1 className="header">CHOOSE YOUR ROLE</h1>
                <div className="button-container">
                    <div className="card" onClick={() => navigate('/barbersignup')}>
                        <p className="card-text">BARBER</p>
                    </div>
                    <div className="card" onClick={() => navigate('/usersignup')}>
                        <p className="card-text">USER</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
