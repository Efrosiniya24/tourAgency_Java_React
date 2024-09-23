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
        const response = await axios.get('http://localhost:8000/tours/allTours');
        console.log(response.data); 
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
    setIsEditing(false); // Reset the editing state
  };

  const handleDelete = async () => {
    if (selectedTourId) {
      try {
        await axios.delete(`http://localhost:8000/tours/deleteTour/${selectedTourId}/`);
        setTours(tours.filter(tour => tour.id !== selectedTourId));
        setSelectedTourId(null);
        setIsVisible(false);
      } catch (error) {
        console.error('Ошибка при удалении тура:', error);
      }
    }
  };

  const [tourData, setTourData] = useState({
    name: '',
    country: '',
    numberOfDays: '',
    price: '',
    startDate: '',
    endDate: '',
    city: '',
    description: '',
    program: '',
    travelAgency: '',
  });

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/tours/search/', { search: searchTerm }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setTours(response.data);
    } catch (error) {
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
      city: '',
      description: '',
      program: '',
      travelAgency: '',
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
            <button className={toursAdmin.addButton} onClick={handleAddClick}>
              Добавить<br/>Услугу
            </button>
            <div className={toursAdmin.search}>
              <img 
                src={searchIcon} 
                alt="Search" 
                onClick={handleSearch}
              />
              <input 
                type="text" 
                placeholder="Введите название тура, страну,город или турагентство"
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
          <section className={toursAdmin.data}>
            <div className={toursAdmin.tableContainer}> 
              {isLoading ? (
                <div>Загрузка...</div>
              ) : (
                <table className={toursAdmin.tableDataBase}>
                  <thead>
                    <tr>
                      <th className={toursAdmin.th_content}>
                        <div>ID</div>
                        <button onClick={handleSortClick} className={toursAdmin.sort_button}>
                          <img src={sortDirection === 'asc' ? up : down} alt="Sort direction" className={toursAdmin.sort_icon} /> 
                        </button>
                      </th>
                      <th className={toursAdmin.th_content}><div>Туры</div></th>
                      <th className={toursAdmin.th_content}><div>Страна</div></th>
                      <th className={toursAdmin.th_content}><div>Город</div></th>
                      <th className={toursAdmin.th_content}><div>Турагентство</div></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTours.map((tour) => (
                      <tr key={tour.id} onClick={() => handleTourClick(tour)}>
                        <td>{tour.id}</td>
                        <td>{tour.name}</td>
                        <td>{tour.country}</td>
                        <td>{tour.city}</td>
                        <td>{tour.travelAgency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ToursAdmin;
