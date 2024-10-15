import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className='navbar'>
            <div className='navbar-logo'>
                <Link to='#'>Cipher Sight</Link>
            </div>
            <ul className='navbar-links'>
                <li>
                    <Link to='/'>Home</Link>
                </li>
                <li>
                    <Link to='/algorithm'>Algorithms</Link>
                </li>
            </ul>
        </nav>
    )

};

export default Navbar;