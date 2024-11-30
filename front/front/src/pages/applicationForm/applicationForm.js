import React, { useState, useEffect, useRef } from 'react';
import styles from './applicationForm.module.css';
import HeaderClient from '../../components/headerClient/headerClient';
import { NavLink, useLocation, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import Plus from "../../components/plus/plus";
import Minus from "../../components/minus/minus";
import Checkbox from '../../components/checkbox/checkbox';
import calendar from './calendar.png';
import TextareaAutosize from 'react-textarea-autosize'; 

const ApplicationForm = () => {
    const location = useLocation();
    const tour = location.state?.tour;
    const [languageOptions, setLanguageOptions] = useState([]); 
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [languageInputs, setLanguageInputs] = useState([{ value: '', id: Date.now() }]); 
    const [dropdownStates, setDropdownStates] = useState({}); 
    const dropdownRef = useRef(null);
    const[days, setDays] = useState(tour.numberOfDays);
    const[people, setPeople] = useState(1);
    const [gender, setGender] = useState({ male: false, female: false });
    const isAuthenticated = !!localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');
    const [havingChild, setHavingChild] = useState(false);    
    const initialDepartureDate = location.state?.departureDate ;
    const [departureDate, setDepartureDate] = useState(initialDepartureDate);
    const [successMessage, setSuccessMessage] = useState('');
    const [user, setUser] = useState({
        name: '',
        surname: '',
        patronymic: '',
        passportSeries: '',
        genderClient: '',
        phoneNumber: '',
        dateOfBirth: '',
        passportNumber: '',
    });

    useEffect(() => {
        if (tour) {
            axios.get(`http://localhost:8083/tourAgency/tours/tour/${tour.id}`)
                .then(response => {
                    const tourLanguages = response.data.languages || []; 
                    setLanguageOptions(tourLanguages); 
                    setFilteredLanguages(tourLanguages); 
                })
                .catch(error => console.error('Error fetching tour details:', error));
        }
    }, [tour]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken'); 

        axios.get('http://localhost:8083/tourAgency/admin/getUserData', {
            headers: {
                'Authorization': `Bearer ${token}`
                },
        })
            .then((response) => {
                setUser(response.data); 
            })
            .catch((error) => console.error('Ошибка получения данных пользователя:', error));
    }, []);

    useEffect(() => {
        if (user.genderClient) {
            setGender({
                male: user.genderClient === 'male',
                female: user.genderClient === 'female',
            });
        }
    }, [user.genderClient]);
    
    const handlePeopleIncrement = () => setPeople(prevPeople => prevPeople + 1);
    const handlePeopleDecrement = () => setPeople(prevPeople =>  Math.max(1, prevPeople - 1));    

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownStates((prev) => {
                const newState = {};
                Object.keys(prev).forEach((key) => {
                    newState[key] = false; 
                });
                return newState;
            });
        }
    };

    const handleLanguageInputChange = (event, id) => {
        const input = event.target.value;
        setLanguageInputs((prev) =>
            prev.map((item) =>
            item.id === id ? { ...item, value: input } : item
            )
        );
        const filtered = languageOptions.filter((language) =>
            language.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredLanguages(filtered);
        };

    const handleLanguageSelect = (language, id) => {
        setLanguageInputs((prev) =>
            prev.map((item) =>
            item.id === id ? { ...item, value: language } : item
            )
        );
        setDropdownStates((prev) => ({ ...prev, [id]: false })); 
        };
    

    const handleRemoveLanguageInput = (id) => {
        setLanguageInputs([{ value: '', id: Date.now() }]);
        setDropdownStates((prev) => {
            const newState = { ...prev };
            delete newState[id]; 
            return newState;
        });
    };
    

    const handleAddLanguageInput = () => {
        if (languageInputs.every(input => input.value.trim() !== '')) {
            setLanguageInputs([...languageInputs, { value: '', id: Date.now() }]);
        } else {
            alert("Пожалуйста, заполните все существующие поля, прежде чем добавлять новое.");
        }
    };



    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleGenderChange = (genderType) => {
        setGender({
            male: genderType === 'male',
            female: genderType === 'female',
        });
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
        };
    
    if (!isAuthenticated) {
        return <Navigate to="/signIn" replace />;
    }

    if (userRole !== 'USER') {
        return <Navigate to="/signIn" replace />;
    }

    const handleHavingChild = (child) => {
        setHavingChild(prevHavingChild => !prevHavingChild)
    }


    const handleSubmit = async () => { 
        try {
            const token = localStorage.getItem('accessToken');

            const formData = new FormData();
    
            formData.append(
                "user",
                new Blob([JSON.stringify({
                    id: user.id,
                    name: user.name,
                    surname: user.surname,
                    patronymic: user.patronymic,
                    email: user.email,
                    phoneNumber: user.phoneNumber,
                    genderClient: gender.male ? "male" : "female",
                    passportNumber: user.passportNumber,
                    passportSeries: user.passportSeries,
                })], { type: 'application/json' })
            );

            formData.append(
                "order",
                JSON.stringify({
                    date: departureDate,
                    status: "Processing",
                    numberOfPeople: people,
                    specialRequests: user.specialRequests || "",
                    nameOfTour: tour.name,
                    idTour: tour.id,
                    numberOfDays: days,
                    createdDate: new Date().toISOString(),
                })
            );

            languageInputs
                .map((input) => input.value.trim())
                .filter((value) => value !== '')
                .forEach((language) => formData.append('languages', language));

            const response = await axios.post(
                'http://localhost:8083/tourAgency/orders/addOrder',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            console.log('Order added successfully:', response.data);

            setSuccessMessage('Заявка отправлена успешно!');
            setTimeout(() => setSuccessMessage(''), 3000); 
    
        } catch (error) {
            console.error('Error adding order:', error);
            setSuccessMessage('Заполните все поля');
            setTimeout(() => setSuccessMessage(''), 3000); 
        }
    };

    return (
        <div>
            <HeaderClient />
            <div className={styles.applicationForm}>
                <div className={styles.highLink}>
                    <ul>
                        <li>
                            <NavLink to="/" className={styles.noLink}>Главная</NavLink>
                        </li>
                        <li>
                            <NavLink to="/tours" className={styles.noLink}>/Каталог</NavLink>
                        </li>
                        <li>
                            <Link to={`/tour`} state={{ tour }} className={styles.noLink}> /{tour?.name}</Link>
                        </li>
                        <li className={styles.noLink}>/Заявка</li>
                    </ul>
                </div>
                <div className={styles.application}>
                    <div className={styles.textApplication}>
                        <h1>Заявка</h1>
                        <p>Проверьте правильность введенных данных. Введите недостающие данные или измените имеющиеся (кроме данных о туре)</p>
                    </div>
                    <div className={styles.allRows}>
                    <div className={styles.columnForApplication}>
                        <div className={styles.secondPartOfApplication}>
                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>Название тура</p>
                                    <input
                                        type="text"
                                        name="nameOfTour"
                                        placeholder="Страна"
                                        value={tour.name}
                                        readOnly
                                    />
                                </div>
                            </div>
                        

                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>Язык тура</p>
                                    {Array.isArray(languageInputs) && languageInputs.map((input, index) => (
                                        <div key={input.id} className={styles.autoCompleteContainer} ref={dropdownRef}>
                                            <input
                                                type="text"
                                                value={input.value}
                                                onChange={(e) => handleLanguageInputChange(e, input.id)}
                                                onFocus={() => setDropdownStates((prev) => ({ ...prev, [input.id]: true }))}
                                                placeholder="Выберите язык"
                                                className={styles.autoCompleteInput}
                                                readOnly
                                                // onClick={handleAddLanguageInput}
                                            />
                                            {dropdownStates[input.id] && (
                                                <ul className={styles.suggestionsList}>
                                                    {filteredLanguages.map(({ id, language }) => (
                                                        <li
                                                            key={id}
                                                            onClick={() => handleLanguageSelect(language, input.id)}
                                                            className={styles.suggestionItem}
                                                        >
                                                            {language}
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            {input.value && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveLanguageInput(input.id)}
                                                        className={styles.removeButton}
                                                    >
                                                        -
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className={styles.days}>
                                    <div className={styles.specificFilter}>
                                        <div classname = {styles.FilerPrintOrChoose}>
                                            <p>Длительность</p>
                                            <div className={styles.FilerPrintOrChooseInput}>
                                                <h4>{days} дней</h4>
                                            </div>
                                        </div>
                                    </div>
                            </div>

                            <div className={styles.days}>
                                    <div className={styles.specificFilter}>
                                        <div classname = {styles.FilerPrintOrChoose}>
                                            <p>Количество человек</p>
                                            <div className={styles.FilerPrintOrChooseInput}>
                                                <h5>Человек</h5>
                                                <input
                                                    type="text"
                                                    placeholder="1"
                                                    value={people}
                                                    onChange = {(e) => setPeople(Number(e.target.value) || 0)}
                                                />
                                                <div className={styles.plus} onClick={handlePeopleIncrement}>
                                                    <Plus/>
                                                </div>
                                                <div className={styles.minus} onClick={handlePeopleDecrement}>
                                                    <Minus/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            </div>
                        </div>

                        <div className={styles.secondPartOfApplication}>
                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>Имя</p>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Имя"
                                        value={user.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>Фамилия</p>
                                    <input
                                        type="text"
                                        name="surname"
                                        placeholder="Фамилия"
                                        value={user.surname}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>Отчество</p>
                                    <input
                                        type="text"
                                        name="patronymic"
                                        placeholder="Отчество"
                                        value={user.patronymic}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>Пол</p>
                                    <div className={styles.genderOptions}>
                                        <div className={styles.ratingCheckbox}>
                                            <Checkbox
                                                checked={gender.male}
                                                onClick={() => handleGenderChange('male')}
                                                onChange={handleInputChange}
                                            />
                                            <p>Мужской</p>
                                        </div>
                                        <div className={styles.ratingCheckbox}>
                                            <Checkbox
                                                checked={gender.female}
                                                onClick={() => handleGenderChange('female')}

                                                onChange={handleInputChange}
                                            />
                                            <p>Женский</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.secondPartOfApplication}>
                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>Серия паспорта</p>
                                    <input
                                        type="text"
                                        name="passportSeries"
                                        placeholder="Серия паспорта"
                                        value={user.passportSeries}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>Номер паспорта</p>
                                    <input
                                        type="text"
                                        name="passportNumber"
                                        placeholder="Номер паспорта"
                                        value={user.passportNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>Email</p>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="email"
                                        value={user.email}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>Моб. телефон</p>
                                    <input
                                        type="text"
                                        name="phoneNumber"
                                        placeholder="Моб.телефон"
                                        value={user.phoneNumber}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles. secondPartOfApplication}>
                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>Дата отъезда</p>
                                        <div className={styles.calendar}>
                                            <div className={styles.inputDate}>
                                                <input
                                                    type="date"
                                                    name="dateOfBirth"
                                                    placeholder="дд.мм.гггг"
                                                    value={departureDate}
                                                    onChange={(e) => setDepartureDate(e.target.value)} 
                                                />
                                            </div>
                                            <div className={styles.calendarIcon}>
                                                <img src = {calendar}/>
                                            </div>
                                        </div>
                                </div>
                            </div>
                            <div className={styles.justFilter}>
                                <div className={styles.specificFilter}>
                                    <p>С ребонком (до 16 лет)</p>
                                    <div className={styles.ratingCheckbox}>
                                            <Checkbox checked={havingChild} onClick={handleHavingChild}/> 
                                            <p>Да</p>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.justFilter}>
                        <div className={styles.specificFilter}>
                            <p>Пожелания</p>
                            <TextareaAutosize
                                type="text"
                                name="specialRequests"
                                placeholder="Пожелания"
                                className={styles.textarea}
                            />
                        </div>
                    </div>
                        <div className={styles.justFilter}>
                            <div>
                        </div>
                        <div>
                            <Link to = {`/application`} state = {{tour}} className={styles.noLink}>
                                <div className={styles.buttonUse} onClick={handleSubmit}>
                                    <p>Отправить заявку</p>
                                </div>
                                {successMessage && (
                            <div className={styles.successMessage}>
                                {successMessage}
                            </div>
                        )}
                            </Link>
                            </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;
