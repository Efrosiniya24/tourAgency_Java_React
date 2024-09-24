import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import styles from './applicationForm.module.css';

const ApplicationForm = () => {
    const location = useLocation();
    const tour = location.state?.tour;

    const [formData, setFormData] = useState({
        email: '',
        name: '',
        phone: '',
        surname: '',
        patronymic: '',
        gender_client: 'not specified',
        age: 0,
        country: tour?.country || '',
        numberOfDays: tour?.numberOfDays || 0,
        price: tour?.price || 0,
        beginningDate: tour?.beginningDate || '',
        endDate: tour?.endDate || '',
        city: tour?.city || '',
        travelAgency: tour?.travelAgency || '',
        numberOfPeople: 1,
        specialRequests: ''
    });

    useEffect(() => {
        if (tour) {
            setFormData({
                ...formData,
                country: tour.country,
                numberOfDays: tour.numberOfDays,
                price: tour.price,
                beginningDate: tour.beginningDate,
                endDate: tour.endDate,
                city: tour.city,
                travelAgency: tour.travelAgency
            });
        }
    }, [tour]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8000/applications', formData)
            .then(response => {
                console.log('Application submitted:', response.data);
                // Handle success
            })
            .catch(error => {
                console.error('Error submitting application:', error);
                // Handle error
            });
    };

    return (
        <div>
            <div className={styles.applicationFormPage}>
                <h1 className={styles.pageTitle}>Форма заявки</h1>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Имя:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Телефон:</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="surname">Фамилия:</label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="patronymic">Отчество:</label>
                        <input
                            type="text"
                            id="patronymic"
                            name="patronymic"
                            value={formData.patronymic}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="gender_client">Пол:</label>
                        <select
                            id="gender_client"
                            name="gender_client"
                            value={formData.gender_client}
                            onChange={handleChange}
                            required
                        >
                            <option value="not specified" disabled>Не указано</option>
                            <option value="male">Мужской</option>
                            <option value="female">Женский</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="age">Возраст:</label>
                        <input
                            type="number"
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="country">Страна:</label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={formData.country}
                            readOnly
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="numberOfDays">Количество дней:</label>
                        <input
                            type="number"
                            id="numberOfDays"
                            name="numberOfDays"
                            value={formData.numberOfDays}
                            readOnly
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="price">Цена:</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            readOnly
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="beginningDate">Дата начала:</label>
                        <input
                            type="date"
                            id="beginningDate"
                            name="beginningDate"
                            value={formData.beginningDate}
                            readOnly
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="endDate">Дата окончания:</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            readOnly
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="city">Город:</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            readOnly
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="travelAgency">Туристическое агентство:</label>
                        <input
                            type="text"
                            id="travelAgency"
                            name="travelAgency"
                            value={formData.travelAgency}
                            readOnly
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="numberOfPeople">Количество человек:</label>
                        <input
                            type="number"
                            id="numberOfPeople"
                            name="numberOfPeople"
                            value={formData.numberOfPeople}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="specialRequests">Особые пожелания:</label>
                        <textarea
                            id="specialRequests"
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            rows="4"
                            maxLength="2000"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.submitButton}>Отправить заявку</button>
                </form>
            </div>
        </div>
    );
};

export default ApplicationForm;
