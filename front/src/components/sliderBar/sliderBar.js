import sliderBar from './sliderBar.module.css';
import databaseIcon from "./photo/database.png";
import requestIcon from "./photo/application.png";
import analyticsIcon from "./photo/analytics.png";
import reportIcon from "./photo/report.png";
import tourIcon from "./photo/travel.png";

import { NavLink } from "react-router-dom";

const SliderBar = () => {
    return ( 
        <aside className={sliderBar.sidebar}>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/dataBase" activeClassName="active">
                            <img src={databaseIcon} alt="Database Icon" />
                            <p className={sliderBar.menu}>База данных</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/orders" activeClassName="active">
                            <img src={requestIcon} alt="Request Icon" />
                            <p className={sliderBar.menu}>Заявки</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/analytics" activeClassName="active">
                            <img src={analyticsIcon} alt="Analytics Icon" />
                            <p className={sliderBar.menu}>Аналитика</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/report" activeClassName="active">
                            <img src={reportIcon} alt="Report Icon" />
                            <p className={sliderBar.menu}>Отчет</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/toursAdmin" activeClassName="active">
                            <img src={tourIcon} alt="Tour Icon" />
                            <p className={sliderBar.menu}>Туры</p>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default SliderBar;
