import header from "./../../pages/mainPage/header.module.css"
import index from "./../mainPage/index.module.css"
import aboutUs from "./aboutUs.module.css"

import we from "./we.jpg";
import photo2 from "./photo2.jpg";
import photo3 from "./photo3.png";
import photo4 from "./photo4.jpg";

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
            <main className={aboutUs.mainPage}>
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
                <div className={aboutUs.second}>
                    <div className={aboutUs.secondBlock}>
                        <h1>Возможности</h1>
                        <p>Мы знаем, как снять стрес при планировании поездки.
Будь то выходные, кругосветное путешествие или маршрут
по нескольким городам, мы здесь, чтобы помочь.Мы не только забронируем ваши авиабилеты и отели,
но также разработаем полный маршрут с индивидуальными
впечатлениями и мероприятиями, адаптированные под ваши интересы</p>
                <img src = {photo2}/> 
                    </div>
                </div>
                <div className={aboutUs.whiteBlock}>
                    <div className = {aboutUs.frame}>
                        <h1>Быстрое бронирование тура</h1>
                        <p>Никаких поездок в офис и ожиданий в очередях. Онлайн бронирование доступно в любое время</p>
                    </div>
                    <img src = {photo3} className={aboutUs.photo2}/>
                    <div className = {aboutUs.frame2}>
                        <h1>Надежность</h1>
                        <p>Работаем с проверенными туроператорами. Это сводит к минимуму форс-мажорные ситуации</p>
                    </div>
                    <img src ={photo4} className={aboutUs.photo}/>
                </div>
                <div className={aboutUs.mapContainer}>
                <div style={{ position: 'relative', overflow: 'hidden', width: '100%' }}>
                    <a
                        href="https://yandex.by/maps/org/coral_travel/197831557469/?utm_medium=mapframe&utm_source=maps"
                        style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '0px' }}
                    >
                        Coral Travel
                    </a>
                    <a
                        href="https://yandex.by/maps/157/minsk/category/travel_agency/184106432/?utm_medium=mapframe&utm_source=maps"
                        style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '14px' }}
                    >
                        Турагентство в Минске
                    </a>
                    <a
                        href="https://yandex.by/maps/157/minsk/category/tour_operator/184106430/?utm_medium=mapframe&utm_source=maps"
                        style={{ color: '#eee', fontSize: '12px', position: 'absolute', top: '28px' }}
                    >
                        Туроператор в Минске
                    </a>
                    <iframe
                        src="https://yandex.by/map-widget/v1/?ll=27.613353%2C53.901256&mode=search&oid=197831557469&ol=biz&sll=48.757130%2C44.474120&sspn=49.893227%2C22.781164&text=%D1%82%D1%83%D1%80%D0%B0%D0%B3%D0%B5%D0%BD%D1%81%D1%82%D0%B2%D0%BE%20%D0%BC%D0%B8%D0%BD%D1%81%D0%BA&z=11.89"
                        style={{ width: '100%', height: '400px', border: 'none' }}
                        allowFullScreen
                    ></iframe>
                </div>
                </div>
            </main>
        </div>
  );
}
 
export default MainPageUser;