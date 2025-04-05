import React, { useState, useEffect } from 'react';
import styles from './tour.module.css';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import HeaderClient from "../../components/headerClient/headerClient";
import Plus from "../../components/plus/plus";
import Minus from "../../components/minus/minus";
import Checkbox from "../../components/checkbox/checkbox";
import Circle from '../../components/circle/circle';
import Like from "../../components/like/like";
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import searchIcon from "./../../photo/search2.png";
import up from "./photo/up.png";
import down from "./photo/down.png";
import reloadIcon from "./../../photo/reload.png";
import Iceland from "./photo/Iceland.jpg";

const Tours = () => {
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        days: '',
        languages: [],
        countries: [],
      });   
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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
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
        const selectedOption = event.target.value;
        setSortOption(selectedOption);
    
        let sortedTours = [...filteredTours]; 
    
        if (selectedOption === "Сначала дешевые") {
            sortedTours.sort((a, b) => a.price - b.price); 
        }
    
        if (selectedOption === "Сначала дорогие") {
            sortedTours.sort((a, b) => b.price - a.price); 
        }
    
        if (selectedOption === "По популярности") {
            sortedTours.sort((a, b) => b.rating - a.rating); 
        }
    
        setFilteredTours(sortedTours); 
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
        axios.get('http://localhost:8083/tourAgency/tours/allTours')
            .then(response => {
                setTours(response.data);
                fetchPhotos(response.data); 
                setFilteredTours(tours);
            })
            .catch(error => console.error('Error fetching tours:', error));
        
    }

    const[tours, setTours] = useState([]);
    const[photos, setPhotos] = useState({});
    const[count, setCount] = useState(0);

    useEffect(() => {
        axios.get('http://localhost:8083/tourAgency/tours/allTours')
            .then(response => {
                setTours(response.data);
                fetchPhotos(response.data); 
                setFilteredTours(response.data);
            })
            .catch(error => console.error('Error fetching tours:', error));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8083/tourAgency/tours/countTours')
            .then(response => {
                setCount(response.data); 
            })
            .catch(error => console.error('Error fetching tour count:', error));
    }, []);

    const fetchPhotos = async (tours) => {
        try {
            const photoPromises = tours.map((tour) =>
                axios.get(`http://localhost:8083/tourAgency/photo/getFirstPhoto/${tour.id}`, { withCredentials: true })
            );
            const photoResponses = await Promise.all(photoPromises);
    
            const photosMap = photoResponses.reduce((acc, response, index) => {
                acc[tours[index].id] = `data:image/jpeg;base64,${response.data}`;
                return acc;
            }, {});
    
            setPhotos(photosMap);
        } catch (error) {
            console.error("Ошибка загрузки фотографий:", error);
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const token = localStorage.getItem('accessToken');  
          if (!token) {
            throw new Error('Token not found. Please log in again.');
          }
      
          const response = await axios.get(`http://localhost:8083/tourAgency/tours/search?line=${searchTerm}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          setTours(response.data); 
          setFilteredTours(response.data);
        } catch (error) {
          console.error('Search error:', error);
          setError(error);
        } finally {
          setIsLoading(false);
        }
      };
      
    
      const handleSearchEnter = async (event) => {
        if (event.key === 'Enter') {
          handleSearch();
        }
      };
    
      const handleReload = () => {
        window.location.reload();
      };      
    const [filteredTours, setFilteredTours] = useState(tours); 
        const handleApplyFilters = async () => {
            const filterData = {
                minPrice,
                maxPrice,
                days: days === 1 ? null : days,
                languages: Object.keys(languages).filter((lang) => languages[lang]), 
                countries: countryInputs.filter((country) => country), 
            };
            console.log("Отправляемые данные фильтра:", filterData);

            try {
                const token = localStorage.getItem('accessToken');
                if (!token) {
                    throw new Error('Token not found. Please log in again.');
                }
                const response = await axios.post('http://localhost:8083/tourAgency/tours/filter', filterData, {
                    withCredentials: true,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                    
                });
                setFilteredTours(response.data)
                console.log("Отправляемые данные фильтра:", filterData);
                console.log("Фильтрованные туры:", response.data);
                setTours(response.data);
            } catch (error) {
                console.error("Ошибка при фильтрации туров:", error);
            }
        };
        
    
    return (
        <div>
            <HeaderClient/>
            <div className={styles.toursPage}>
                <div className={styles.highLink}>
                    <ul>
                        <li><NavLink to = "/" className={styles.noLink}>Главная </NavLink></li> 
                        <li> /Каталог  </li>
                    </ul>
                </div>
                <h1 className={styles.title}>Поиск туров</h1>
                <div className={styles.search}>
                    <img 
                        src={searchIcon} 
                        alt="Search" 
                        onClick={handleSearch}
                    />
                    <input 
                        type="text" 
                        placeholder="Введите название тура или страну"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearchEnter}
                    />
                    <img 
                        className={styles.reloadIcon} 
                        src={reloadIcon} 
                        alt="Reload" 
                        onClick={handleReload} 
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
                                    <div className={styles.buttonUse} onClick={handleApplyFilters}>
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
                            <h6>Найдено {count} туров</h6>
                            <div className={styles.sortContainer}>
                            <label className={styles.sortLabel}>Сортировать :</label>
                            <select 
                                value={sortOption} 
                                onChange={handleSortChange} 
                                className={styles.sortSelect}
                            >
                                <option value="По популярности">По популярности</option>
                                <option value="Сначала дешевые">Сначала дешевые</option>
                                <option value="Сначала дорогие">Сначала дорогие</option>
                                <option value="По рейтингу">По рейтингу</option>
                            </select>
                            </div>
                        </div>

                        <div className={styles.catalogTours}>
                            
                            {/* <div className={styles.toursContainer}> */}
                                {filteredTours.map((tour) => (
                                    <div key={tour.id} className={styles.cardTour}>
                                        <Link to={`/tour`} state={{ tour }}>
                                            <LazyLoadImage
                                                src={photos[tour.id]}
                                                alt={`Фото тура ${tour.name}`}
                                                className={styles.tourPhoto}
                                                effect="blur"
                                            />
                                        </Link>                              
                                            <div className={styles.shortDescriptionTour}>
                                            <Link to={`/tour`} state={{ tour }} className={styles.noLink}><h1>{tour.name}</h1></Link>
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
                                            <Link to = {`/application`} state = {{tour}} className={styles.noLink}>
                                                    <div className={styles.buttonUse}>
                                                        <p>Отправить заявку</p>
                                                    </div>
                                                </Link>
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