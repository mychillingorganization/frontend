import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link
                    to="/generator"
                    className={`navbar-link${location.pathname === '/' || location.pathname === '/generator' ? ' active' : ''}`}
                >
                    Generator
                </Link>
                <Link to="/create" className={`navbar-link${location.pathname === '/create' ? ' active' : ''}`}>
                    Create New
                </Link>
                <Link to="/templates" className={`navbar-link${location.pathname === '/templates' ? ' active' : ''}`}>
                    My Templates
                </Link>
            </div>
            <div className="navbar-right">
                <Link to="/login" className="btn btn-ghost">Sign In</Link>
                <Link to="/register" className="btn btn-primary">Register</Link>
            </div>
        </nav>
    );
}

export default Navbar;
