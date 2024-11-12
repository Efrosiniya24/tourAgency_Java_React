import React, { useState, useEffect } from 'react';
import TextareaAutosize from 'react-textarea-autosize'; 
import axios from 'axios';
import tourInputForm from './tourInputForm.module.css';

const TourInputForm = ({ tourData, handleChange, handleDelete, handleClose, setTours, tours, isEditing }) => {
  const [images, setImages] = useState([null, null, null, null]);

  useEffect(() => {
    if (tourData && tourData.id) {
      axios
        .get(`http://localhost:8083/tourAgency/photo/getPhoto/${tourData.id}`, { withCredentials: true })
        .then(response => {
          const loadedImages = response.data.map(photoData => `data:image/jpeg;base64,${photoData}`);
          setImages([...loadedImages, ...Array(4 - loadedImages.length).fill(null)]);
        })
        .catch(error => {
          console.error("Ошибка загрузки фотографий:", error);
        });
    }
  }, [tourData]);
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tourData.name || !tourData.country) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('tours', JSON.stringify(tourData)); 

      images.forEach((image) => {
        if (image && typeof image !== 'string')  {
          formData.append('images', image);
        }
      });

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
