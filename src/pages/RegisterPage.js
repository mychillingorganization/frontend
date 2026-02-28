import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './RegisterPage.css';
/* Small Bugkathon logo */
const BugkathonLogoSmall = () => (
    <img src="/assets/bugkathon_logo.svg" alt="Bugkathon" style={{ width: 'auto', height: 'auto' }} />
);
function RegisterPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Mật khẩu không khớp.');
            return;
        }
        try {
            await authService.register({
                email,
                name: fullName,
                password,
                role: 'MEMBER',
            });
            navigate('/login');
        } catch (error) {
            const message = error.response?.data?.detail || 'Đăng ký thất bại.';
            alert(message);
        }
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
                        {errors.fullName && <span style={{ color: '#EA4335', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.fullName}</span>}
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
                        {errors.email && <span style={{ color: '#EA4335', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
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
                        {errors.password && <span style={{ color: '#EA4335', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.password}</span>}
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
                        {errors.confirmPassword && <span style={{ color: '#EA4335', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.confirmPassword}</span>}
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
