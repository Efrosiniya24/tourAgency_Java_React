import React from 'react';
import style from "./acceptButton.module.css";
import { NavLink } from "react-router-dom";

const AcceptButton = () => {
    return ( 
        <div className={style.acceptButton}>
            <p>Принять</p>
        </div>
     );
}
 
export default AcceptButton;