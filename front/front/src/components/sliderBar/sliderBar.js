import sliderBar from './sliderBar.module.css';
import databaseIcon from "./photo/database.png";
import requestIcon from "./photo/application.png";
import analyticsIcon from "./photo/analytics.png";
import reportIcon from "./photo/report.png";
import tourIcon from "./photo/travel.png";
import logout from "./photo/logout.png";

import { NavLink } from "react-router-dom";

const SliderBar = () => {
    return ( 
        <aside className={sliderBar.sidebar}>
            <nav>
                <ul>
                    <li>
                        <NavLink to="/dataBase" activeClassName="active" className={sliderBar.menuLine}>
                            <img src={databaseIcon} alt="Database Icon" className={sliderBar.menuIcon}/>
                            <p className={sliderBar.menu}>Клиенты</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/orders" activeClassName="active" className={sliderBar.menuLine}>
                            <img src={requestIcon} alt="Request Icon" className={sliderBar.menuIcon}/>
                            <p className={sliderBar.menu}>Заявки</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/analytics" activeClassName="active" className={sliderBar.menuLine}>
                            <img src={analyticsIcon} alt="Analytics Icon" className={sliderBar.menuIcon}/>
                            <p className={sliderBar.menu}>Аналитика</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/report" activeClassName="active" className={sliderBar.menuLine}>
                            <img src={reportIcon} alt="Report Icon" className={sliderBar.menuIcon}/>
                            <p className={sliderBar.menu}>Отчет</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/toursAdmin" activeClassName="active" className={sliderBar.menuLine}>
                            <img src={tourIcon} alt="Tour Icon" className={sliderBar.menuIcon}/>
                            <p className={sliderBar.menu}>Туры</p>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/signIn" activeClassName="active" className={sliderBar.menuLine}>
                            <img src = {logout} alt = "Logout Icon" className={sliderBar.logoutIcon}/>
                            <p >Выход</p>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

export default SliderBar;
