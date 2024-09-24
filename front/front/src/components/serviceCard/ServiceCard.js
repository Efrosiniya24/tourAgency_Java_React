import React from 'react';
import styles from './ServiceCard.module.css';

const ServiceCard = ({ service, onClick }) => {
    return (
        <div className={styles.cardTour} onClick={() => onClick(service.id)}>
            <div className={styles.content}>
                <h3 className={styles.title}>{service.name}</h3>
                <p className={styles.description}>{service.description}</p>
            </div>
        </div>
    );
};

export default ServiceCard;
