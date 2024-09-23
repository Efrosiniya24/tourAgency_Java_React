import header from "./../../styles/header.module.css"
import index from "./../mainPage/index.module.css"
import aboutUs from "./aboutUs.module.css"

import we from "./we.jpg"

import { NavLink } from "react-router-dom"

const MainPageUser = () => {
    return ( 
        <div>
            <header className={header.headerNotMain}>
                <a href="/static" className={index.logo}>WORLD</a>
                <ul className={header.nav}>
                    <li><NavLink to ="/">Главная</NavLink></li>
                    <li><a href="#"> О нас</a></li>
                    <li><a href="#">Туры</a></li>
                </ul>
            </header>
            <main>
                <div className={aboutUs.first_clide}>
                    <div className={aboutUs.rectangle}>
                        <img src={we}/>
                        <h3>Наша <br/>история</h3>
                        <p className={aboutUs.p_aboutUs}>Турагентство WORLD было основано в 2016 году группой друзей,
                            которые были объединены общей страстью к путешествиям. Мы
                            начинали с небольшого офиса, но за эти годы мы выросли в одну
                            из ведущих туроператоров в стране. За 7 лет мы отправили в
                            незабываемые поездки более 40 000 человек, открыв им красоту
                            300+ уникальных направлений</p>
                        <div className={aboutUs.p_inColor}>
                            <h3>Мы работаем для того,<br/>
                                чтобы ваши мечты о путешествиях стали<br/>
                                реальностью!
                            </h3>
                        </div>
                    </div>
                </div>
            </main>
        </div>
  );
}
 
export default MainPageUser;