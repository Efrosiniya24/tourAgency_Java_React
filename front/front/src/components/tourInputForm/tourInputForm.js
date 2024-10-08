import TextareaAutosize from 'react-textarea-autosize'; 
import axios from 'axios';
import tourInputForm from './tourInputForm.module.css';

const TourInputForm = ({ tourData, handleChange, handleDelete, handleClose, setTours, tours, isEditing }) => {

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!tourData.name || !tourData.country) {
      alert("Пожалуйста, заполните все обязательные поля.");
      return;
    }
    try {
      if (isEditing) {
        const token = localStorage.getItem('accessToken');
        const response = await axios.put(
          `http://localhost:8083/tourAgency/tours/updateTour/${tourData.id}`, 
          tourData, 
          { withCredentials: true,
            headers: {
              'Authorization': `Bearer ${token}`,
            },
           }
        );
        const updatedTour = response.data;
        setTours(tours.map(tour => (tour.id === updatedTour.id ? updatedTour : tour)));
      } else {
        const token = localStorage.getItem('accessToken');
        const response = await axios.post(
          'http://localhost:8083/tourAgency/tours/addTour',
          tourData,
          {
            withCredentials: true,
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setTours([...tours, response.data]);
      }
      handleClose();
    } catch (error) {
      console.error('Ошибка при сохранении тура:', error);
      if (error.response && error.response.data) {
        alert('Ошибка: ' + JSON.stringify(error.response.data));
      } else {
        alert('Произошла ошибка при сохранении.');
      }
    }
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
            <table>
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
              </tbody>
            </table>
            <button type="submit" className={tourInputForm.submit}>
              {isEditing ? 'Сохранить' : 'Добавить'}
            </button>
            {isEditing && (
              <button type="button" onClick={handleDelete} className={tourInputForm.delete}>Удалить</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TourInputForm;
