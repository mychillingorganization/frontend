import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { VALIDATION } from '../constants';
import './LoginPage.css';
/* Small Bugkathon logo */
const BugkathonLogoSmall = () => (
    <img src="/assets/bugkathon_logo.svg" alt="Bugkathon" style={{ width: 'auto', height: 'auto' }} />
);

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!VALIDATION.EMAIL_REGEX.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < VALIDATION.MIN_PASSWORD_LENGTH) {
            newErrors.password = `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const existingUsersStr = localStorage.getItem('mock_users');
            if (existingUsersStr) {
                const mockUsers = JSON.parse(existingUsersStr);
                const userMatch = mockUsers.find(u => u.email === email && u.password === password);

                if (userMatch) {
                    localStorage.setItem('current_user', JSON.stringify(userMatch));
                    navigate('/templates');
                } else {
                    setErrors({ email: 'Invalid email or password' });
                }
            } else {
                setErrors({ email: 'Account does not exist. Please register first.' });
            }
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
