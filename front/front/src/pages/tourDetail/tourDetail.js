import React, { useState, useEffect } from 'react'; 
import { NavLink, useLocation, Link } from 'react-router-dom';
import HeaderClient from '../../components/headerClient/headerClient';
import styles from './tourDetail.module.css';
import axios from 'axios';
import calendar from './calendar.png';
import destination from './destination.png';
import Plus from '../../components/plus/plus';
import Minus from '../../components/minus/minus';

const TourDetail = () => {
    const location = useLocation();
    const tour = location.state?.tour;
    const [photos, setPhotos] = useState([null, null, null, null]);
    const [tourDetails, setTourDetails] = useState(null);
    const [departureDate, setDepartureDate] = useState();

    useEffect(() => {
        if (tour) {
            axios.get(`http://localhost:8083/tourAgency/tours/tour/${tour.id}`)
                .then(response => {
                    setTourDetails(response.data); 
                    fetchPhotos(response.data);
                })
                .catch(error => console.error('Error fetching tour details:', error));
        }
    }, [tour]);

    const fetchPhotos = (tour) => {
        axios.get(`http://localhost:8083/tourAgency/photo/getPhoto/${tour.id}`, { withCredentials: true })
            .then(response => {
                console.log("Фотографии:", response.data);
                if (Array.isArray(response.data)) {
                    const loadedImages = response.data.map((photoData, index) => {
                        if (photoData && photoData.trim() !== '') {
                            return `data:image/jpeg;base64,${photoData}`;
                        }
                        return null;
                    });

                    setPhotos(loadedImages.concat(Array(4 - loadedImages.length).fill(null))); 
                } else {
                    console.error("Ошибка: Ответ от сервера не является массивом изображений");
                }
            })
            .catch(error => console.error("Ошибка загрузки фотографий:", error));
    };

    const formatText = (text) => {
        return text.replace(/\n/g, '<br />');
    };

    const[people, setPeople] = useState(1);

    const handlePeopleIncrement = () => setPeople(prevPeople => prevPeople + 1);
    const handlePeopleDecrement = () => setPeople(prevPeople =>  Math.max(1, prevPeople - 1));

    // const getFormattedDate = (dateString) => {
    //     if (!dateString) {
    //         return ''; 
    //     }
    //     const date = new Date(dateString);
    //     if (isNaN(date.getTime())) {
    //         return 'Неверная дата'; 
    //     }
    //     const formatter = new Intl.DateTimeFormat('ru-RU', {
    //         weekday: 'long',
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric',
    //     });
    //     return formatter.format(date);
    // };
    
    // const getCurrentDateWithDay = () => {
    //     const today = new Date();
    //     const formatter = new Intl.DateTimeFormat('ru-RU', {
    //         weekday: 'long', 
    //         year: 'numeric',
    //         month: 'long',
    //         day: 'numeric',
    //     });
    //     return formatter.format(today); 
    // };

    return (
        <div>
            <HeaderClient/>
            <div className={styles.tourDetailPage}>
                <div className={styles.highLink}>
                    <ul>
                        <li>
                            <NavLink to="/" className={styles.noLink}>Главная</NavLink>
                        </li> 
                        <li>
                            <NavLink to="/tours" className={styles.noLink}>/Каталог</NavLink>   
                        </li>
                        <li> /{tourDetails?.name}</li>
                    </ul>
                </div>

                <div className={styles.tour}>
                    <div className={styles.leftPart}>
                        <div className={styles.photosTour}>
                            {photos.map((photo, index) => (
                                <img
                                    key={index}
                                    src={photo}
                                    alt={`Фото ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles.rightPart}>
                        <div className={styles.aboutTourUp}>
                            <h1>{tour.name}</h1>
                            <p dangerouslySetInnerHTML={{ __html: formatText(tour.description) }} />
                        </div>

                        <div className={styles.card}>
                            <div className={styles.inside}>
                                <div className={styles.leftInside}>
                                    <div className={styles.blockInsideLeft}>
                                        <p>Выберите день отъезда</p>
                                        <div className={styles.calendar}>
                                            <div className={styles.inputDate}>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    placeholder="дд.мм.гггг"
                                                    // value={departureDate}
                                                    onChange={(e) => setDepartureDate(e.target.value)} 
                                                />
                                            </div>
                                            <div className={styles.calendarIcon}>
                                                <img src = {calendar}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.blockInsideLeft}>
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

                                        <div className={styles.cost}>
                                            <p>{tour.price.toLocaleString('ru-RU')} $</p>
                                                <div className={styles.additionalText}>
                                                    <p>/{tour.numberOfDays} дней</p>
                                                </div>
                                        </div> 
                                </div>

                                <div className={styles.leftInside}>
                                    <div className={styles.destination}>
                                        <img src= {destination}/>
                                    </div>
                                    <Link to = {`/application`} state ={{tour, departureDate, people}} className={styles.noLink}>
                                        <div className={styles.buttonUse}>
                                            <p>Отправить заявку</p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetail;
