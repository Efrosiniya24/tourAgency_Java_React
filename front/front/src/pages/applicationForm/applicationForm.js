import React, { useState, useEffect, useRef } from 'react';
import styles from './applicationForm.module.css';
import HeaderClient from '../../components/headerClient/headerClient';
import { NavLink, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
const ApplicationForm = () => {
    const location = useLocation();
    const tour = location.state?.tour;
    const [languageOptions, setLanguageOptions] = useState([]); 
    const [filteredLanguages, setFilteredLanguages] = useState([]);
    const [languageInputs, setLanguageInputs] = useState([{ value: '', id: Date.now() }]); 
    const [dropdownStates, setDropdownStates] = useState({}); 
    const dropdownRef = useRef(null);

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

    const handleLanguageSelect = (language, id) => {
        setLanguageInputs((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, value: language } : item
            )
        );
        setDropdownStates((prev) => ({ ...prev, [id]: false })); 
    };

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

    const handleRemoveLanguageInput = (id) => {
        setLanguageInputs((prev) => {
            const updatedInputs = prev.filter((item) => item.id !== id);

            if (updatedInputs.length === 0) {
                setLanguageInputs([{ value: '', id: Date.now() }]);
            } else {
                setLanguageInputs(updatedInputs);
            }

            setDropdownStates((prev) => {
                const newState = { ...prev };
                delete newState[id]; 
                return newState;
            });
        });
    };

    const handleAddLanguageInput = () => {
        if (languageInputs.every(input => input.value.trim() !== '')) {
            setLanguageInputs([...languageInputs, { value: '', id: Date.now() }]);
        } else {
            alert("Пожалуйста, заполните все существующие поля, прежде чем добавлять новое.");
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

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

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
                        <p>Проверьте правильность введенных данных. Введите недостающие данные</p>
                    </div>
                    <div className={styles.columnForApplication}>
                        <div className={styles.firstPartOfApplication}>
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

                        <div className={styles.firstPartOfApplication}>
                            <div className={styles.specificFilter}>
                                <p>Язык(и) тура</p>
                                {Array.isArray(languageInputs) && languageInputs.map((input, index) => (
                                    <div key={input.id} className={styles.autoCompleteContainer} ref={dropdownRef}>
                                        <input
                                            type="text"
                                            value={input.value}
                                            onChange={(e) => handleLanguageInputChange(e, input.id)}
                                            onFocus={() => setDropdownStates((prev) => ({ ...prev, [input.id]: true }))} 
                                            placeholder="Введите или выберите язык"
                                            className={styles.autoCompleteInput}
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
                                                {index === languageInputs.length - 1 && input.value !== '' && (
                                                    <button
                                                        type="button"
                                                        onClick={handleAddLanguageInput}
                                                        className={styles.addButton}
                                                    >
                                                        +
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationForm;
