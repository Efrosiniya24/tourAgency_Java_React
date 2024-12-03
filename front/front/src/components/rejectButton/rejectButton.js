import React from 'react';
import style from "./rejectButton.module.css";
import { NavLink } from "react-router-dom";

const RejectButton = ({onClick}) => {
    return ( 
        <div className={style.rejectButton} onClick = {onClick}>
            <p>Отклонить</p>
        </div>
     );
}
 
export default RejectButton;