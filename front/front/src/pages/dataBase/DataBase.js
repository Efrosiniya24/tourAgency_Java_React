import { NavLink } from "react-router-dom";
import HeaderAdmin from '../../components/headerAdmin/headerAdmin';
import SliderBar from "../../components/sliderBar/sliderBar";
import SelectedUser from "../../components/selectedUser/selectedUser";

import dataBase from './DataBase.module.css';

import up from "./photo/up.png";
import down from "./photo/down.png";
import searchIcon from "./photo/search2.png";
import reloadIcon from "./../../photo/reload.png";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaChevronRight } from 'react-icons/fa';
import ToursAdmin from "../toursAdmin/ToursAdmin";

const DataBase = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [name, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [user_id, setUser_id] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('accessToken');  
        const response = await axios.get('http://localhost:8083/tourAgency/admin/allUsers', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        console.log(response.data); 
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError(error); 
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const fetchUserOrders = async (userId) => {
    try {
      const token = localStorage.getItem('accessToken'); 
      if (!token) {
        throw new Error('Token not found. Please log in again.');
      }
      
      const response = await axios.get(`http://localhost:8083/tourAgency/orders/getOrders/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log(response.data); 
      setOrders(response.data);
      setShowOrders(true); 
    } catch (error) {
      setError(error);
    }
  };
  
  

  const handleSortClick = () => {
    setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');  
      const response = await axios.get(`http://localhost:8083/tourAgency/admin/searchUser?nameUser=${name}`, { 
        name: name,
        surname: name,
        patronymic: name,
        phone: name,
        email: name,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setUsers(response.data);
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

  const handleUserClick = (user) => {
    if (user.id === selectedUserId) { 
      setIsVisible(false);
      setSelectedUserId(null); 
      setShowOrders(false); 
    } else {
      setSelectedUser(user);
      setIsVisible(true);
      setSelectedUserId(user.id); 
      setShowOrders(false); 
    }
  };

  const handleCloseOrders = () => {
    setShowOrders(false);
  };

  const handleCloseSelectedUser = () => {
    setIsVisible(false);
    setShowOrders(false);
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(`http://localhost:8000/order/update-status`, {
        order_id: orderId,
        status: newStatus
      });
      if (response.status === 200) {
        const updatedOrders = orders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  if (error) {
    return <div>Ошибка: {error.message}</div>;
  }

  return (
    <div className={dataBase.DataBase}>
      <HeaderAdmin />
      <div className={dataBase.containerDataBase}>
        <SliderBar />
        <main className={dataBase.content}>
          <div className={dataBase.searchAndUserInfo}>
            <div className={dataBase.searchAndInfo}>
              <div className={dataBase.search}>
                <img 
                  src={searchIcon} 
                  alt="Search" 
                  onClick={handleSearch}
                />
                <input 
                  type="text" 
                  placeholder="Введите ФИО клиента"
                  value={name}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleSearchEnter}
                />
                <img 
                  className={dataBase.reloadIcon} 
                  src={reloadIcon} 
                  alt="Reload" 
                  onClick={handleReload} 
                />
              </div>
            </div>
            <div className={dataBase.userInformation}>
            {isVisible && 
              <SelectedUser
              user={selectedUser} 
              dataBase={dataBase} 
              setIsVisible={setIsVisible} 
              fetchUserOrders={fetchUserOrders} 
              handleCloseSelectedUser={handleCloseSelectedUser} 
            />}
            {showOrders && (
              <div className={dataBase.application_cards}>
                <button className={dataBase.closeButton} onClick={handleCloseOrders}>×</button>
                {isLoading ? (
                  <div>Загрузка...</div>
                ) : (
                  orders.map(order => {
                    return (
                      <div key={order.id} className={dataBase.application_card}>
                        <div className={dataBase.application_header}>
                          <div className={dataBase.id_box}>
                            <span className={dataBase.id_label}>ID</span>
                            <span className={dataBase.divider}></span>
                            <span className={dataBase.id_value}>{order.id}</span>
                          </div>
                          <div className={dataBase.user_info}>
                            <div className={dataBase.name_box}>
                              <span className={dataBase.id_label}>K</span>
                              {/* Conditional rendering to prevent errors */}
                              {order.user ? (
                                <span className={dataBase.name}>{`${order.user.surname} ${order.user.name} ${order.user.patronymic}`}</span>
                              ) : (
                                <span className={dataBase.name}>User information not available</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className={dataBase.application_body}>
                          <div className={dataBase.client_info}>
                            <div className={dataBase.inline_container}>
                              <div className={dataBase.date_box}>
                                <span className={dataBase.date}>{new Date(order.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className={dataBase.name_box}>
                                <span className={dataBase.id_label}>Email</span>
                                {/* Check if user exists before trying to access email */}
                                {order.user ? (
                                  <span className={dataBase.name}>{order.user.email}</span>
                                ) : (
                                  <span className={dataBase.name}>Email not available</span>
                                )}
                              </div>
                            </div>
                            <div className={dataBase.phone_box}>
                              {/* Check if user exists before trying to access phone */}
                              {order.user ? (
                                <span className={dataBase.phone}>{order.user.phone}</span>
                              ) : (
                                <span className={dataBase.phone}>Phone not available</span>
                              )}
                            </div>
                            <div className={dataBase.inline_container}>
                              <div className={dataBase.phone_box}>
                                <span className={dataBase.id_label}>Кол. чел.:</span>
                                <span className={dataBase.phone}>{order.numberOfPeople}</span>
                              </div>
                            </div>
                          </div>
                          <div className={dataBase.application_main}>
                            <div className={dataBase.application_details}>
                              {/* Ensure order.tour is defined before rendering its properties */}
                              {order.tour ? (
                                <>
                                  <p className={`${dataBase.header} ${dataBase.rectangle}`}>{order.tour.name}</p>
                                  <div>
                                    <p>{order.tour.description}</p>
                                  </div>
                                </>
                              ) : (
                                <p>Tour information not available</p> 
                              )}
                              <button className={dataBase.nextButton}><FaChevronRight /></button>
                            </div>
                          </div>
                          
                        </div>
                      </div>
                    );
                  })
                )}
            </div>
            )}
          </div>
          </div>
          <div className={dataBase.data}>
            <table className={dataBase.tableDataBase}>
              <thead>
                <tr className={dataBase.first}>
                  <th className={dataBase.idColumn}>
                    <div>ID</div>
                    <button onClick={handleSortClick} className={dataBase.sort_button}>
                      <img src={sortDirection === 'asc' ? up : down} alt="Sort direction" className={dataBase.sort_icon} /> 
                    </button>
                  </th>
                  <th className={dataBase.clientColumn}>Клиент</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  user && user.surname ? (
                    <tr key={user.id} onClick={() => handleUserClick(user)}>
                      <td className={dataBase.idColumn}>{user.id}</td>
                      <td className={dataBase.clientColumn}>{user.surname} {user.name} {user.patronymic}</td>
                    </tr>
                  ) : (
                    <tr key={user?.id || Math.random()}><td colSpan="2">Invalid User Data</td></tr>
                  )
                ))}
              </tbody>
            </table>
          </div>
          
        </main>
      </div>
      
    </div>
  );
}

export default DataBase;
