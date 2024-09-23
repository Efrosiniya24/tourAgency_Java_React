import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './tourDetail.module.css';

const TourDetail = () => {
    const { id } = useParams();
    const [tour, setTour] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch tour details from API
        axios.get(`http://localhost:8000/tours/viewingTour/${id}/`)
            .then(response => {
                setTour(response.data);
            })
            .catch(error => {
                console.error('Error fetching tour details:', error);
            });
    }, [id]);

    const handleBookClick = () => {
        navigate('/application', { state: { tour } });
    };

    if (!tour) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.tourDetailPage}>
            <div className={styles.tourDetailContainer}>
                <div className={styles.detailsContainer}>
                    <h1 className={styles.title}>{tour.name}</h1>
                    <p className={styles.description}>{tour.description}</p>
                    <div className={styles.info}>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Страна:</span>
                            <span className={styles.value}>{tour.country}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Город:</span>
                            <span className={styles.value}>{tour.city}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Количество дней:</span>
                            <span className={styles.value}>{tour.numberOfDays}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Стоимость:</span>
                            <span className={styles.value}>${tour.price}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Начальная дата:</span>
                            <span className={styles.value}>{new Date(tour.beginningDate).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Дата окончания:</span>
                            <span className={styles.value}>{new Date(tour.endDate).toLocaleDateString()}</span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.label}>Туристическое агентство:</span>
                            <span className={styles.value}>{tour.travelAgency}</span>
                        </div>
                    </div>
                    <div className={styles.programContainer}>
                        <h2 className={styles.programTitle}>Программа</h2>
                        <p className={styles.program}>{tour.program}</p>
                    </div>
                    <button className={styles.bookButton} onClick={handleBookClick}>Оформить заявку</button>
                </div>
            </div>
        </div>
    );
};

export default TourDetail;