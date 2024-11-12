import React from 'react';
import mainAdmin from './mainAdmin.module.css';

import travel from "./photo/travel.png";
import report from "./photo/report.png";
import database from "./photo/database.png";
import application from "./photo/application.png";
import analytic from "./photo/analytic.png";

import { NavLink } from "react-router-dom";
import HeaderAdmin from '../../components/headerAdmin/headerAdmin';

const MainAdmin = () => {
    return ( 
        <div className={mainAdmin.mainAdmin}>
            <HeaderAdmin/>
            {/* <main> */}
                <div className={mainAdmin.container}>
                    <NavLink to ="/analytics ">
                        <div className={mainAdmin.card}>
                            <img src={analytic}/>
                            <p className={mainAdmin.card_p}>Аналитика</p>
                        </div>
                    </NavLink>
                    <NavLink to ="/orders">
                            <div className={mainAdmin.card}>
                                <img src={application}/>
                                <p className={mainAdmin.card_p}>Заявки</p>
                            </div>
                    </NavLink>
                    <NavLink to ="/toursAdmin">
                            <div className={mainAdmin.card}>
                                <img src={travel}/>
                                <p className={mainAdmin.card_p}>Туры</p>
                            </div>
                        </NavLink>
                    <NavLink to ="/report">
                        <div className={mainAdmin.card}>
                            <img src={report}/>
                            <p className={mainAdmin.card_p}>Отчет</p>
                        </div>
                        </NavLink>
                    <NavLink to ="/dataBase">
                            <div className={mainAdmin.card}>
                                <img src={database}/>
                                <p className={mainAdmin.card_p}>Клиенты</p>
                            </div>
                    </NavLink>
                    </div>
            {/* </main> */}
        </div>
     );
}
 
export default MainAdmin;