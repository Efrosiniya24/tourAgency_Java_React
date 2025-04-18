import React, { useState, useEffect } from 'react';
import HeaderAdmin from '../../components/headerAdmin/headerAdmin'; 
import SliderBar from '../../components/sliderBar/sliderBar';
import toursAdmin from './toursAdmin.module.css';
import axios from 'axios';
import TourInputForm from './../../components/tourInputForm/tourInputForm'; 

import searchIcon from "./../../photo/search2.png";
import up from "./photo/up.png";
import down from "./photo/down.png";
import reloadIcon from "./../../photo/reload.png";

const ToursAdmin = () => {
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTourId, setSelectedTourId] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sortDirection, setSortDirection] = useState('asc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8083/tourAgency/tours/allTours', { withCredentials: true });
        console.log(response.data); 
        // const getCsrfToken = () => localStorage.getItem('csrfToken');
        setTours(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных: ", error);
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setTourData({ ...tourData, [name]: value });
  };

  const handleSortClick = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  const handleClose = () => {
    setIsVisible(false);
    setSelectedTourId(null);
    setIsEditing(false); 
  };

const handleDelete = async () => {
  if (selectedTourId) {
    try {
      const token = localStorage.getItem('accessToken'); 
      if (!token) {
        throw new Error('Token not found. Please log in again.');
      }
      console.log('Token:', token); 

      const response = await axios.delete(`http://localhost:8083/tourAgency/tours/deleteTour/${selectedTourId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setTours(tours.filter(tour => tour.id !== selectedTourId));
        setSelectedTourId(null);
        setIsVisible(false);
      } else {
        throw new Error('Удаление не удалось');
      }

    } catch (error) {
      console.error('Ошибка при удалении тура:', error);

      if (error.response) {
        console.error('Ответ сервера:', error.response.data);
        console.error('Статус:', error.response.status);
        console.error('Заголовки:', error.response.headers);
        alert(`Ошибка при удалении: ${error.response.data.message || 'Не удалось удалить тур'}`);
      } else if (error.request) {
        console.error('Запрос был сделан, но ответа не было:', error.request);
        alert('Не удалось получить ответ от сервера');
      } else {
        console.error('Ошибка при настройке запроса:', error.message);
        alert('Произошла ошибка при удалении');
      }
    }
  }
};

  const [tourData, setTourData] = useState({
    name: '',
    country: '',
    numberOfDays: '',
    price: '',
    beginningDate: '',
    endDate: '',
    location: '',
    description: '',
    program: '',
  });

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');  
      if (!token) {
        throw new Error('Token not found. Please log in again.');
      }
  
      const response = await axios.get(`http://localhost:8083/tourAgency/tours/search?line=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      setTours(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleSearchEnter = async (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleTourClick = (tour) => {
    if (selectedTour && selectedTour.id === tour.id && isVisible) {
      handleClose();
    } else {
      setSelectedTour(tour);
      setSelectedTourId(tour.id);
      setTourData(tour);
      setIsVisible(true);
      setIsEditing(true); 
    }
  };

  const sortedTours = [...tours].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const handleAddClick = () => {
    setIsVisible(true);
    setSelectedTour(null);
    setTourData({
      name: '',
      country: '',
      numberOfDays: '',
      price: '',
      beginningDate: '',
      endDate: '',
      location: '',
      description: '',
      program: '',
    });
    setIsEditing(false); 
  };

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  }

  return (
    <div>
      <HeaderAdmin/>
      <div className={toursAdmin.containerToursAdmin}>
        <SliderBar/>
        <main className={toursAdmin.content}>
          <div className={toursAdmin.searchAndUserInfo}>
            <div className={toursAdmin.searchAndAddInfo}>
              <button className={toursAdmin.addButton} onClick={handleAddClick}>
                Добавить тур
              </button>
              <div className={toursAdmin.search}>
                <img 
                  src={searchIcon} 
                  alt="Search" 
                  onClick={handleSearch}
                />
                <input 
                  type="text" 
                  placeholder="Введите название тура или страну"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchEnter}
                />
                <img 
                  className={toursAdmin.reloadIcon} 
                  src={reloadIcon} 
                  alt="Reload" 
                  onClick={handleReload} 
                />
              </div>
            </div>
            <div className={toursAdmin.addInfo}>
              {isVisible && (
                <TourInputForm
                  tourData={tourData}
                  handleChange={handleChange}
                  handleDelete={handleDelete}
                  handleClose={handleClose}
                  setTours={setTours}
                  tours={tours}
                  isEditing={isEditing} 
                />
              )}
              </div>
            </div>
            <div className={toursAdmin.tableContainer}> 
              {isLoading ? (
                <div>Загрузка...</div>
              ) : (
                <table className={toursAdmin.tableDataBase}>
                  <thead>
                    <tr className={toursAdmin.first}>
                    <th className={toursAdmin.idColumn}>
                        <div>ID</div>
                        <button onClick={handleSortClick} className={toursAdmin.sort_button}>
                          <img src={sortDirection === 'asc' ? up : down} alt="Sort direction" className={toursAdmin.sort_icon} /> 
                        </button>
                      </th>
                      <th className={toursAdmin.tourColumn}>Туры</th>
                      <th className={toursAdmin.countryColumn}><div>Страна</div></th>
                      <th className={toursAdmin.cityColumn}><div>Город</div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTours.map((tour) => (
                      <tr key={tour.id} onClick={() => handleTourClick(tour)}>
                        <td className={toursAdmin.idColumn}>{tour.id}</td>
                        <td className={toursAdmin.tourColumn}>{tour.name}</td>
                        <td className={toursAdmin.countryColumn}>{tour.country}</td>
                        <td className={toursAdmin.cityColumn}>{tour.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
        </main>
      </div>
    </div>
  );
};

export default ToursAdmin;
