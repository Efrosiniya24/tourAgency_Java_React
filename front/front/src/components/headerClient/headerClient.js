import React from 'react';
// import header from "./headerAdmin.module.css";
import header from "./headerClient.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import logoutPhoto from './logout.png';
import { useAuth } from '../../components/AuthProvider';
import axios from 'axios';

const HeaderClient = () => {
    const { user, logout } = useAuth(); 
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('authToken');

            const response = await axios.post(
                'http://localhost:8083/tourAgency/auth/logout', 
                {}, 
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    }
                }
            );

            if (response.status === 200) {
                logout(); 

                navigate('/');
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return ( 
        <header className={header.headerNotMain}>
        <NavLink to ="/" className={header.logo}>WORLD</NavLink>
        <div className={header.nav}>
            <ul>
                <li>Главная</li>
                <li>О нас</li>
                <li>Туры</li>
                <li>Профиль</li>
                {user && (
                        <li>
                            <img 
                                src={logoutPhoto} 
                                alt="Logout" 
                                onClick={handleLogout} 
                                className={header.logoutIcon}
                            />
                        </li>
                    )}
            </ul>
        </div>
        </header>
    );
}
 
export default HeaderClient;