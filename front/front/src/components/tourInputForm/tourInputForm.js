import React, { useState, useEffect, useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize'; 
import axios from 'axios';
import tourInputForm from './tourInputForm.module.css';

const TourInputForm = ({ tourData, handleChange, handleDelete, handleClose, setTours, tours, isEditing }) => {
  const [images, setImages] = useState([null, null, null, null]);
  const [languageOptions] = useState(["Английский", "Русский", "Испанский", "Немецкий", "Французский", "Итальянский", "Арабский", "Китайский"]);
  const [filteredLanguages, setFilteredLanguages] = useState(languageOptions);
  const [languageInputs, setLanguageInputs] = useState([{ value: '', id: Date.now() }]); 
  const [dropdownStates, setDropdownStates] = useState({}); 
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (tourData && tourData.id) {
      axios
        .get(`http://localhost:8083/tourAgency/photo/getPhoto/${tourData.id}`, { withCredentials: true })
        .then(response => {
          const loadedImages = response.data.map(photoData => `data:image/jpeg;base64,${photoData}`);
          setImages(loadedImages.concat(Array(4 - loadedImages.length).fill(null)));
        })
        .catch(error => {
          console.error("Ошибка загрузки фотографий:", error);
        });
    }
  }, [tourData]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!tourData.name || !tourData.country) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }
  
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('tours', JSON.stringify({
        ...tourData,
    }));
    
  
      images.forEach((image) => {
        if (image && typeof image !== 'string') {
            formData.append('images', image);
        }
    }); 

    languageInputs
    .map((input) => input.value.trim())
    .filter((value) => value !== '')
    .forEach((language) => formData.append('languages', language));
  
      const url = tourData.id 
        ? `http://localhost:8083/tourAgency/tours/updateTour/${tourData.id}`
        : 'http://localhost:8083/tourAgency/tours/addTour';
      const method = tourData.id ? 'put' : 'post';
  
      const response = await axios({
        method: method,
        url: url,
        data: formData,
        withCredentials: true,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (tourData.id) {
        setTours(tours.map((tour) => (tour.id === tourData.id ? response.data : tour)));
      } else {
        setTours([...tours, response.data]);
      }
  
      handleClose();
    } catch (error) {
      console.error('Ошибка при сохранении тура:', error);
      alert('Произошла ошибка при сохранении.');
    }
  };
  
  const handleImageUpload = (index, event) => {
    const file = event.target.files[0];
    const maxSizeInBytes = 10 * 1024 * 1024; 
    
    if (file && file.size > maxSizeInBytes) {
        alert("Размер файла превышает допустимый лимит в 10 MB.");
        return;
    }

    if (file) {
        const newImages = [...images];
        newImages[index] = file;
        setImages(newImages);
    }
};

  const handleImageClick = (index) => {
    document.getElementById(`fileInput-${index}`).click();
  };


  const today = new Date().toISOString().split('T')[0];

  const handleNumberChange = (event) => {
    const { name, value } = event.target;
    if (value === '' || /^[1-9]\d*$/.test(value)) {
      handleChange(event);
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

  const handleAddLanguageInput = () => {
    if (languageInputs.every(input => input.value.trim() !== '')) {
      setLanguageInputs([...languageInputs, { value: '', id: Date.now() }]);
    } else {
      alert("Пожалуйста, заполните все существующие поля, прежде чем добавлять новое.");
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

  return (
    <div className={tourInputForm.containerInput}>
      <div className={tourInputForm.table_containerInput}>
        <form onSubmit={handleSubmit}>
          <div className={tourInputForm.border}>
            <div className={tourInputForm.closeButton} onClick={handleClose}>×</div>
            <table className={tourInputForm.tableStyle}>
              <tbody>
                <tr>
                  <th>Название тура:</th>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={tourData.name}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Страна:</th>
                  <td>
                    <input
                      type="text"
                      name="country"
                      value={tourData.country}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Количество дней:</th>
                  <td>
                    <input
                      type="number"
                      name="numberOfDays"
                      value={tourData.numberOfDays}
                      onChange={handleNumberChange}
                      min="1"
                      step="1"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Цена:</th>
                  <td>
                    <input
                      type="number"
                      name="price"
                      value={tourData.price}
                      onChange={handleNumberChange}
                      min="1"
                      step="1"
                    />
                  </td>
                </tr>
                <tr>
                  <th>Начало тура:</th>
                  <td>
                    <input
                      type="date"
                      name="beginningDate"
                      value={tourData.beginningDate ? new Date(tourData.beginningDate).toISOString().split('T')[0] : ''}
                      onChange={handleChange}
                      className={tourInputForm.datePicker}
                      min={today}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Конец тура:</th>
                  <td>
                    <input
                      type="date"
                      name="endDate"
                      value={tourData.endDate ? new Date(tourData.endDate).toISOString().split('T')[0] : ''}
                      onChange={handleChange}
                      className={tourInputForm.datePicker}
                      min={today}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Город:</th>
                  <td>
                    <input
                      type="text"
                      name="location"
                      value={tourData.location}
                      onChange={handleChange}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Описание:</th>
                  <td>
                    <TextareaAutosize
                      name="description"
                      value={tourData.description}
                      onChange={handleChange}
                      className={tourInputForm.textarea}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Программа:</th>
                  <td>
                    <TextareaAutosize
                      name="program"
                      value={tourData.program}
                      onChange={handleChange}
                      className={tourInputForm.textarea}
                    />
                  </td>
                </tr>
                <tr>
                  <th>Язык (и): </th>
                  <td>
                    {Array.isArray(languageInputs) && languageInputs.map((input, index) => (
                      <div key={input.id} className={tourInputForm.autoCompleteContainer} ref={dropdownRef}>
                        <input
                          type="text"
                          value={input.value}
                          onChange={(e) => handleLanguageInputChange(e, input.id)}
                          onFocus={() => setDropdownStates((prev) => ({ ...prev, [input.id]: true }))}
                          placeholder="Введите или выберите язык"
                          className={tourInputForm.autoCompleteInput}
                        />
                        {dropdownStates[input.id] && (
                          <ul className={tourInputForm.suggestionsList}>
                            {filteredLanguages.map((language) => (
                              <li
                                key={language}
                                onClick={() => handleLanguageSelect(language, input.id)}
                                className={tourInputForm.suggestionItem}
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
                              className={tourInputForm.removeButton}
                            >
                              -
                            </button>
                            {index === languageInputs.length - 1 && input.value !== '' && (
                              <button
                                type="button"
                                onClick={handleAddLanguageInput}
                                className={tourInputForm.addButton}
                              >
                                +
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </td>
                </tr>
                <tr>
                  <th>Фото:</th>
                  <td className={tourInputForm.photoContainer}>
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className={tourInputForm.photoBox}
                      onClick={() => handleImageClick(index)}
                    >
                      {image ? (
                        <img
                          src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                          alt={`Фото ${index + 1}`}
                          className={tourInputForm.photo}
                        />
                      ) : (
                        <span className={tourInputForm.addIcon}>+</span>
                      )}
                      <input
                        type="file"
                        id={`fileInput-${index}`}
                        style={{ display: 'none' }}
                        accept="image/*"
                        onChange={(e) => handleImageUpload(index, e)}
                      />
                    </div>
                  ))}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className={tourInputForm.buttonsPanel}>
              <button type="submit" className={tourInputForm.submit}>
                {isEditing ? 'Сохранить' : 'Добавить'}
              </button>
              {isEditing && (
                <button type="button" onClick={handleDelete} className={tourInputForm.delete}>Удалить</button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourInputForm;