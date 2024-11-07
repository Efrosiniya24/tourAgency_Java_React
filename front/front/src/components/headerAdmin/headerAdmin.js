import React from 'react';
import header from "./headerAdmin.module.css";
import { NavLink } from "react-router-dom";

const HeaderAdmin = () => {
    return ( 
        <header className={header.headerNotMain}>
            <NavLink to ="/mainAdmin/:user_id">WORLD</NavLink>
        </header>
     );
}
 
export default HeaderAdmin;