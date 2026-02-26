import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css';

/* Small Bugkathon logo */
const BugkathonLogoSmall = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57 57" width="100%" height="100%">
        <rect width="57" height="57" rx="10" fill="#121212" />
        <circle cx="28.5" cy="27.8" r="14.25" fill="#4285F4" opacity="0.1" />
        <path d="M21.375 20.675L12.825 29.225L21.375 37.775" fill="none" stroke="#FBBC05" strokeWidth="3.42" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M35.625 20.675L44.175 29.225L35.625 37.775" fill="none" stroke="#EA4335" strokeWidth="3.42" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M31.35 17.825L25.65 40.625" fill="none" stroke="#4285F4" strokeWidth="3.42" strokeLinecap="round" />
        <circle cx="28.5" cy="14.975" r="2.28" fill="#34A853" />
        <path d="M27.075 13.55C25.175 10.7 23.0375 9.75 20.6625 10.7" fill="none" stroke="#34A853" strokeWidth="1.14" strokeLinecap="round" />
        <path d="M29.925 13.55C31.825 10.7 33.9625 9.75 36.3375 10.7" fill="none" stroke="#34A853" strokeWidth="1.14" strokeLinecap="round" />
        <text x="28.5" y="49" fontFamily="Courier New, monospace" fontSize="5.4" fontWeight="bold" fill="#FFFFFF" textAnchor="middle" letterSpacing="0.6">BUGKATHON</text>
        <text x="28.5" y="53.5" fontFamily="Arial, sans-serif" fontSize="1.7" fontWeight="bold" fill="#888888" textAnchor="middle" letterSpacing="0.3">IT'S NOT A BUG, IT'S A FEATURE</text>
    </svg>
);

function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register:', { fullName, email, password, confirmPassword });
    };

    return (
        <div className="register-page">
            {/* Small logo top-left */}
            <Link to="/" className="register-logo">
                <BugkathonLogoSmall />
            </Link>

            <div className="register-card">
                <h2 className="register-title">Create an account</h2>
                <p className="register-subtitle">
                    Enter your details below to create your account
                </p>

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            className="form-input"
                            type="text"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            className="form-input"
                            type="email"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Confirm Password</label>
                        <input
                            className="form-input"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="register-submit">Create Account</button>
                </form>

                <div className="register-footer">
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
