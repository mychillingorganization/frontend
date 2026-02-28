import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './LoginPage.css';
/* Small Bugkathon logo */
const BugkathonLogoSmall = () => (
    <img src="/assets/bugkathon_logo.svg" alt="Bugkathon" style={{ width: 'auto', height: 'auto' }} />
);

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login({ email, password });
            navigate('/templates');
        } catch (error) {
            const message = error.response?.data?.detail || 'Đăng nhập thất bại.';
            alert(message);
        }
    };
    return (
        <div className="login-page">
            {/* Small logo top-left */}
            <Link to="/" className="login-logo">
                <BugkathonLogoSmall />
            </Link>
            <div className="login-card">
                <h2 className="login-title">Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
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
                    <span className="login-forgot">Forgotten password?</span>
                    <button type="submit" className="login-submit">Sign In</button>
                </form>
                <div className="login-footer">
                    Don't have an account? <Link to="/register">Register</Link>
                </div>
            </div>
        </div>
    );
}
export default LoginPage;
