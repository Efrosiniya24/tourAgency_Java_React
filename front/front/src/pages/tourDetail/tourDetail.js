import React, { useState, useEffect } from 'react'; 
import { NavLink, useLocation } from 'react-router-dom';
import HeaderClient from '../../components/headerClient/headerClient';
import styles from './tourDetail.module.css';
import axios from 'axios';

const TourDetail = () => {
    const location = useLocation();
    const tour = location.state?.tour;
    const [photos, setPhotos] = useState([null, null, null, null]);
    const [tourDetails, setTourDetails] = useState(null);

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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TourDetail;
