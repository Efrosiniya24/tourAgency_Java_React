import React from 'react';
import style from "./acceptButton.module.css";
import { NavLink } from "react-router-dom";

const AcceptButton = ({onClick}) => {
    return ( 
        <div className={style.acceptButton} onClick = {onClick}>
            <p>Принять</p>
        </div>
     );
}
 
export default AcceptButton;