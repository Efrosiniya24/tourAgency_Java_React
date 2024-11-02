import React from 'react';
// import header from "./headerAdmin.module.css";
import header from "./headerClient.module.css";
import { NavLink } from "react-router-dom";

const HeaderClient = () => {
    return ( 
        <header className={header.headerNotMain}>
        <NavLink to ="/" className={header.logo}>WORLD</NavLink>
        <div className={header.nav}>
            <ul>
                <li>Главная</li>
                <li>О нас</li>
                <li>Туры</li>
                <li>Профиль</li>
            </ul>
        </div>
        </header>
     );
}
 
export default HeaderClient;