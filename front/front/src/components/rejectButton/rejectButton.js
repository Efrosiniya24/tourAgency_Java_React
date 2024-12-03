import React from 'react';
import style from "./rejectButton.module.css";
import { NavLink } from "react-router-dom";

const RejectButton = () => {
    return ( 
        <div className={style.rejectButton}>
            <p>Отклонить</p>
        </div>
     );
}
 
export default RejectButton;