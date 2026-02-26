import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import './HomePage.css';

/* Bugkathon logo — exact SVG */
const BugkathonLogo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
        <rect width="400" height="400" rx="40" fill="#121212" />
        <circle cx="200" cy="160" r="100" fill="#4285F4" opacity="0.1" />
        <path d="M 150 110 L 90 170 L 150 230" fill="none" stroke="#FBBC05" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 250 110 L 310 170 L 250 230" fill="none" stroke="#EA4335" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 220 90 L 180 250" fill="none" stroke="#4285F4" strokeWidth="24" strokeLinecap="round" />
        <circle cx="200" cy="70" r="16" fill="#34A853" />
        <path d="M 190 60 Q 170 30 145 40" fill="none" stroke="#34A853" strokeWidth="8" strokeLinecap="round" />
        <path d="M 210 60 Q 230 30 255 40" fill="none" stroke="#34A853" strokeWidth="8" strokeLinecap="round" />
        <text x="200" y="310" fontFamily="Courier New, monospace" fontSize="38" fontWeight="bold" fill="#FFFFFF" textAnchor="middle" letterSpacing="4">BUGKATHON</text>
        <text x="200" y="345" fontFamily="Arial, sans-serif" fontSize="12" fontWeight="bold" fill="#888888" textAnchor="middle" letterSpacing="2">IT'S NOT A BUG, IT'S A FEATURE</text>
    </svg>
);

function HomePage() {
    return (
        <>
            <Navbar />
            <div className="home-page">
                {/* Logo icon */}
                <div className="home-logo-section">
                    <div className="home-logo-icon">
                        <BugkathonLogo />
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
