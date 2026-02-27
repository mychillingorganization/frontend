import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { VALIDATION } from '../constants';
import './RegisterPage.css';
/* Small Bugkathon logo */
const BugkathonLogoSmall = () => (
    <img src="/assets/bugkathon_logo.svg" alt="Bugkathon" style={{ width: 'auto', height: 'auto' }} />
);
function RegisterPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        // Full name validation
        if (!fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        } else if (fullName.trim().length < VALIDATION.MIN_NAME_LENGTH) {
            newErrors.fullName = `Full name must be at least ${VALIDATION.MIN_NAME_LENGTH} characters`;
        }

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

        // Confirm password validation
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            const newUser = {
                id: Date.now().toString(),
                fullName,
                email,
                password, // Mock storage, obviously insecure in real life
                role: 'Student'
            };

            // Generate or append to mock_users
            const existingUsersStr = localStorage.getItem('mock_users');
            const mockUsers = existingUsersStr ? JSON.parse(existingUsersStr) : [];
            mockUsers.push(newUser);
            localStorage.setItem('mock_users', JSON.stringify(mockUsers));

            // "Log in" as the new user
            localStorage.setItem('current_user', JSON.stringify(newUser));

            navigate('/templates');
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
