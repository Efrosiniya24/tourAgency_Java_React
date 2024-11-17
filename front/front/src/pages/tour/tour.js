import React, { useState, useEffect } from 'react';
import styles from './tour.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderClient from "../../components/headerClient/headerClient";
import Plus from "../../components/plus/plus";
import Minus from "../../components/minus/minus";
import Checkbox from "../../components/checkbox/checkbox";
import Circle from '../../components/circle/circle';
import Like from "../../components/like/like";

import searchIcon from "./../../photo/search2.png";
import up from "./photo/up.png";
import down from "./photo/down.png";
import reloadIcon from "./../../photo/reload.png";
import Iceland from "./photo/Iceland.jpg";

const Tours = () => {

    const[days, setDays] = useState(1);
    const[people, setPeople] = useState(1);
    const [countryInputs, setCountryInputs] = useState([""]);
    const [showMore, setShowMore] = useState(false); 
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [ratings, setRatings] = useState([false, false, false, false, false]);
    const [languages, setLanguages] = useState({
        Русский: false,
        Английский: false,
        Немецкий: false,
        Испанский: false,
        Французский: false,
        Итальянский: false,
        Арабский: false,
        Китайский: false,
        Другой: false
    });
    const [havingChild, setHavingChild] = useState(false);
    const [typeOfTour, setTypeOfTour] = useState({
        "Культурный тур": false,
        "Гастрономический тур": false,
        "Cплав на каноэ": false,
        "Наблюдения за дельфинами и китами": false,
        "Многодневные поездки": false,
        "Экскурсионный тур": false,
        "Пляжный отдых": false,
        "Поход": false,
        "Дайвинг": false,
        "Сафари": false,
    });
    const [sortOption, setSortOption] = useState("По популярности");

    const handleDaysIncrement = () => setDays(prevDays => prevDays + 1);
    const handleDaysDecrement = () => setDays(prevDays =>  Math.max(1, prevDays - 1));

    const handlePeopleIncrement = () => setPeople(prevPeople => prevPeople + 1);
    const handlePeopleDecrement = () => setPeople(prevPeople =>  Math.max(1, prevPeople - 1));

    const handleCountryAdd = () => {
        setCountryInputs(prevInputs => [...prevInputs, ""]); 
    };

    const handleCountryRemove = (index) => {
        setCountryInputs(prevInputs => prevInputs.filter((_, i) => i !== index)); 
    };

    const handleCountryChange = (index, event) => {
        const newInputs = [...countryInputs];
        newInputs[index] = event.target.value;
        setCountryInputs(newInputs);
    };
    
    const handleRatingClick = (index) => {
        setRatings(prevRatings => 
            prevRatings.map((val, i) => i === index ? !val : val)
        );
    };

    const handleLanguageClick = (language) => {
        setLanguages(prevLanguages => ({
            ...prevLanguages,
            [language]: !prevLanguages[language]
        }));
    };

    const handleHavingChild = (child) => {
        setHavingChild(prevHavingChild => !prevHavingChild)
    }

    const handleTypeOfTour = (type) => {
        setTypeOfTour(prevType => ({
            ...prevType,
            [type]: !prevType[type]
        }));
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleResetFilters = () => {
        setDays(1);
        setPeople(1);
        setCountryInputs([""]);
        setShowMore(false);
        setMinPrice("");
        setMaxPrice(""); 
        setRatings([false, false, false, false, false])
        setLanguages({
            Русский: false,
            Английский: false,
            Немецкий: false,
            Испанский: false,
            Французский: false,
            Итальянский: false,
            Арабский: false,
            Китайский: false,
            Другой: false
        });
        setHavingChild(false);
        setTypeOfTour({
            "Культурный тур": false,
            "Гастрономический тур": false,
            "Cплав на каноэ": false,
            "Наблюдения за дельфинами и китами": false,
            "Многодневные поездки": false,
            "Экскурсионный тур": false,
            "Пляжный отдых": false,
            "Поход": false,
            "Дайвинг": false,
            "Сафари": false,
        });
    }

    const [tours, setTours] = useState([]);
    const[photos, setPhotos] = useState({});

    useEffect(() => {
        axios.get('http://localhost:8083/tourAgency/tours/allTours')
            .then(response => {
                setTours(response.data);
                fetchPhotos(response.data); 
            })
            .catch(error => console.error('Error fetching tours:', error));
    }, []);

    const fetchPhotos = async (tours) => {
        const photosMap = {}; 
        try {
            for (const tour of tours) {
                const response = await axios.get(
                    `http://localhost:8083/tourAgency/photo/getFirstPhoto/${tour.id}`,
                    { withCredentials: true }
                );
                photosMap[tour.id] = `data:image/jpeg;base64,${response.data}`;
            }
            setPhotos(photosMap);
        } catch (error) {
            console.error("Ошибка загрузки фотографий:", error);
        }
    };
    


    // const [services, setServices] = useState([]);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     axios.get('http://localhost:8000/tours/allTours')
    //         .then(response => {
    //             setServices(response.data);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching services:', error);
    //         });
    // }, []);

    // const handleCardClick = (serviceId) => {
    //     navigate(`/tours/${serviceId}`);
    // };

    return (
        <div>
            <HeaderClient/>
            <div className={styles.toursPage}>
                <div className={styles.highLink}>
                    <ul>
                        <li>Главная </li>
                        <li> /Каталог  </li>
                    </ul>
                </div>
                <h1 className={styles.title}>Поиск туров</h1>
                <div className={styles.search}>
                    <img 
                        src={searchIcon} 
                        alt="Search" 
                        // onClick={handleSearch}
                    />
                    <input 
                        type="text" 
                        placeholder="Введите название тура, страну,город или турагентство"
                        // value={searchTerm}
                        // onChange={(e) => setSearchTerm(e.target.value)}
                        // onKeyDown={handleSearchEnter}
                    />
                    <img 
                        className={styles.reloadIcon} 
                        src={reloadIcon} 
                        alt="Reload" 
                        // onClick={handleReload} 
                    />
                </div>
                <div className={styles.allTours}>
                    <div className={styles.filter}>
                        <div className={styles.spesificFilter}>
                            <p>Цена</p>
                                <div className={styles.minMax}>
                                    <div className={styles.costMinMax}>
                                        <h5>Мин</h5>
                                        <input
                                            type="text"
                                            placeholder="1000$"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)} 
                                        />
                                    </div>
                                    <div className={styles.costMinMax}>
                                        <h5>Макс</h5>
                                        <input
                                            type="text"
                                            placeholder="10000$"
                                            value={maxPrice}
                                            onChange = {(e) => setMaxPrice(e.target.value)}
                                        />
                                    </div>
                                </div>
                        </div>

                        <div className={styles.spesificFilter}>
                            <div classname = {styles.FilerPrintOrChoose}>
                                <p>Длительность</p>
                                <div className={styles.FilerPrintOrChooseInput}>
                                    <h5>Дней</h5>
                                    <input
                                        type="text"
                                        placeholder="1"
                                        value={days}
                                        onChange = {(e) => setDays(Number(e.target.value) || 0)}
                                    />
                                    <div className={styles.plus} onClick={handleDaysIncrement}>
                                        <Plus/>
                                    </div>
                                    <div className={styles.minus} onClick={handleDaysDecrement}>
                                        <Minus/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.spesificFilter}>
                            <div classname = {styles.FilerPrintOrChoose}>
                                <p>Количество человек</p>
                                <div className={styles.FilerPrintOrChooseInput}>
                                    <h5>Человек</h5>
                                    <input 
                                        type="text"
                                        placeholder="1"
                                        value = {people}
                                        onChange = {(e) => setPeople(Number(e.target.value) ||0)}
                                    />
                                    <div className={styles.plus} onClick = {handlePeopleIncrement}>
                                        <Plus/>
                                    </div>
                                    <div className={styles.minus} onClick={handlePeopleDecrement}>
                                        <Minus/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.spesificFilter}>
                            <div className={styles.FilerPrintOrChoose}>
                                <p>Рейтинг</p>
                                <div className={styles.ratingCheckbox}>
                                    {ratings.map((checked, index) => (
                                        <div key={index} className={styles.ratingCenter}>
                                            <Checkbox checked={checked} onClick={() => handleRatingClick(index)} />
                                            <p>{index + 1}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.spesificFilter}>
                            <div className={styles.FilerPrintOrChoose}>
                                <p>Язык тура</p>
                                <div className={styles.ratingLeft}>
                                    {Object.keys(languages).map((lang) => (
                                        <div key={lang} className={styles.ratingCheckbox}>
                                            <Checkbox checked={languages[lang]} onClick={() => handleLanguageClick(lang)} />
                                            <p>{lang}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className={styles.spesificFilter}>
                            <div className={styles.FilerPrintOrChoose}>
                                <p>С ребенком (до 16 лет)</p>
                                <div className={styles.ratingLeft}>
                                    <div className={styles.ratingCheckbox}>
                                            <Checkbox checked={havingChild} onClick={handleHavingChild}/> 
                                            <p>Да</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.spesificFilter}>
                            <div className={styles.FilerPrintOrChoose}>
                            <p>Страна</p>
                                <div className={styles.inputFilter}>
                                    <div className={styles.ratingLeft}>
                                        {countryInputs.map((country, index) => (
                                            <div key={index} className={styles.ratingCheckbox}>
                                                <input
                                                    type="text"
                                                    placeholder="Введите страну"
                                                    value={country}
                                                    onChange={(event) => handleCountryChange(index, event)}
                                                />
                                                <div className={styles.icon} onClick={() => index === countryInputs.length - 1 ? handleCountryAdd() : handleCountryRemove(index)}>
                                                    {index === countryInputs.length - 1 ? <Plus /> : <Minus />}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.spesificFilter}>
                            <div className={styles.FilerPrintOrChoose}>
                                <p>Тип</p>
                                <div className={styles.ratingLeft}>
                                    {Object.keys(typeOfTour).slice(0, showMore ? undefined : 5).map((tourType) => (
                                        <div key={tourType} className={styles.ratingCheckbox}>
                                            <Checkbox checked={typeOfTour[tourType]} onClick={() => handleTypeOfTour(tourType)} />
                                            <p>{tourType}</p>
                                        </div>
                                    ))}
                                </div>
                                <h6 onClick={() => setShowMore((prev) => !prev)}>
                                    {showMore ? 'Скрыть' : 'Показать больше'}
                                </h6>
                            </div>
                        </div>

                        <div className={styles.spesificFilter}>
                            <div className={styles.FilerPrintOrChoose}>
                                <div className={styles.ratingCheckbox}>
                                    <div className={styles.buttonUse}>
                                        <p>Применить</p>
                                    </div>
                                    <div className={styles.buttonLose} onClick = {handleResetFilters}>
                                        <p>Сбросить</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.catalog}>
                        <div className={styles.overCatalog}>
                            <h6>Найдено 1234 туров</h6>
                            <div className={styles.sortContainer}>
                            <label className={styles.sortLabel}>Сортировать :</label>
                            <select 
                                value={sortOption} 
                                onChange={handleSortChange} 
                                className={styles.sortSelect}
                            >
                                <option value="По популярности">По популярности</option>
                                <option value="По цене">По цене</option>
                                <option value="По рейтингу">По рейтингу</option>
                            </select>
                            </div>
                        </div>

                        <div className={styles.catalogTours}>
                            {/* <div className={styles.toursContainer}> */}
                                {tours.map((tour) => (
                                    <div key={tour.id} className={styles.cardTour}>
                                        <img
                                            src={photos[tour.id]}
                                            alt={`Фото тура ${tour.name}`}
                                            className={styles.tourPhoto}
                                        />                               
                                            <div className={styles.shortDescriptionTour}>
                                            <h1>{tour.name}</h1>
                                            <div className={styles.firstLine}>
                                                <div className={styles.ratingCircle}>
                                                    {[...Array(5)].map((_, index) => (
                                                        <Circle key={index} />
                                                        ))}
                                                </div>
                                                <p>735 отзыва</p>
                                                <div className={styles.additionalText}>
                                                    <p>{tour.country}, {tour.location}</p>
                                                </div>
                                            </div>

                                            <div className={styles.cost}>
                                                <p>{tour.price.toLocaleString('ru-RU')} $</p>
                                                <div className={styles.additionalText}>
                                                    <p>/{tour.numberOfDays} дней</p>
                                                </div>
                                            </div> 

                                            <div className={styles.lastLine}>
                                                <div className={styles.buttonUse}>
                                                    <p>Отправить заявку</p>
                                                </div>
                                                <div className={styles.like}>
                                                    <Like />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            {/* </div> */}
                        </div>
                    </div>
                </div>
                

                {/* <div>
                    {services.map(service => (
                        <ServiceCard 
                            key={service.id} 
                            service={service} 
                            onClick={handleCardClick} // Передаем функцию onClick
                        />
                    ))}
                </div> */}
            </div>
        </div>
    );
};

export default Tours;