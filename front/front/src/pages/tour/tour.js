import React, { useState, useEffect } from 'react';
import ServiceCard from '../../components/serviceCard/ServiceCard';
import styles from './tour.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Tours = () => {
    const [services, setServices] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:8000/tours/allTours')
            .then(response => {
                setServices(response.data);
            })
            .catch(error => {
                console.error('Error fetching services:', error);
            });
    }, []);

    const handleCardClick = (serviceId) => {
        navigate(`/tours/${serviceId}`);
    };

    return (
        <div className={styles.servicesPage}>
            <h1 className={styles.pageTitle}>Туристические услуги</h1>
            <div className={styles.servicesGrid}>
                {services.map(service => (
                    <ServiceCard 
                        key={service.id} 
                        service={service} 
                        onClick={handleCardClick} // Передаем функцию onClick
                    />
                ))}
            </div>
        </div>
    );
};

export default Tours;