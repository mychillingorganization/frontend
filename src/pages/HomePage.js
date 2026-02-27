import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './HomePage.css';
function HomePage() {
    return (
        <>
            <Navbar />
            <div className="home-page">
                {/* Logo icon */}
                <div className="home-logo-section">
                    <div className="home-logo-icon">
                        <img src="/assets/bugkathon_logo.svg" alt="Bugkathon Logo" style={{width: "100%", height: "100%"}} className="bugkathon-logo" />
                    </div>
                </div>
                {/* Hero */}
                <div className="home-hero">
                    <h1 className="home-title">Bugkathon</h1>
                    <p className="home-subtitle">Dynamic SVG Certificate &amp; Asset Generator</p>
                    <div className="home-actions">
                        <Link to="/login" className="btn btn-outline">Sign in</Link>
                        <Link to="/register" className="btn btn-primary">Register</Link>
                    </div>
                </div>
            </div>
        </>
    );
}
export default HomePage;
