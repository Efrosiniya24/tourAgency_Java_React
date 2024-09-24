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

const DataBase = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showOrders, setShowOrders] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:8000/user/allUsers/');
        setUsers(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  
  const fetchUserOrders = async (userId) => {
    try {
      const response = await axios.post('http://localhost:8000/orders/userOrders', { user_id: userId });
      console.log(response.data); // Проверка данных
      setOrders(response.data);
      setShowOrders(true); // Показываем заявки
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
      const response = await axios.post('http://localhost:8000/user/search', { 
        name: searchTerm,
        surname: searchTerm,
        patronymic: searchTerm,
        phone: searchTerm,
        email: searchTerm,
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
      setShowOrders(false); // Закрываем заявки при закрытии пользователя
    } else {
      setSelectedUser(user);
      setIsVisible(true);
      setSelectedUserId(user.id); // Сохраняем ID выбранного пользователя
      setShowOrders(false); // Закрываем заявки при выборе другого пользователя
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
        // Обновить состояние заказов, если необходимо
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
          <div className={dataBase.leftPanel}>
            <div className={dataBase.search}>
              <img 
                src={searchIcon} 
                alt="Search" 
                onClick={handleSearch}
              />
              <input 
                type="text" 
                placeholder="Введите ФИО клиента"
                value={searchTerm}
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
            {isVisible && <SelectedUser user={selectedUser} dataBase={dataBase} setIsVisible={setIsVisible} fetchUserOrders={fetchUserOrders} handleCloseSelectedUser={handleCloseSelectedUser} />}
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
                              <span className={dataBase.name}>{`${order.user.surname} ${order.user.name} ${order.user.patronymic}`}</span>
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
                                <span className={dataBase.id_label}>email</span>
                                <span className={dataBase.name}>{order.user.email}</span>
                              </div>
                            </div>
                            <div className={dataBase.phone_box}>
                              <span className={dataBase.phone}>{order.user.phone}</span>
                            </div>
                            <div className={dataBase.inline_container}>
                              <div className={dataBase.phone_box}>
                                <span className={dataBase.id_label}>Кол. чел.:</span>
                                <span className={dataBase.phone}>{order.numberOfPeople}</span>
                              </div>
                              <div className={dataBase.phone_box}>
                                <span className={dataBase.id_label}>Турагентство:</span>
                                <span className={dataBase.phone}>{order.tour.travelAgency}</span>
                              </div>
                            </div>
                          </div>
                          <div className={dataBase.application_main}>
                            <div className={dataBase.application_details}>
                              <p className={`${dataBase.header} ${dataBase.rectangle}`}>{order.tour.name}</p>
                              <div>
                                <p>{order.tour.description}</p>
                              </div>
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

          <section className={dataBase.data}>
            <table className={dataBase.tableDataBase}>
              <thead>
                <tr>
                  <th className={dataBase.th_content}>
                    <div>ID</div>
                    <button onClick={handleSortClick} className={dataBase.sort_button}>
                      <img src={sortDirection === 'asc' ? up : down} alt="Sort direction" className={dataBase.sort_icon} /> 
                    </button>
                  </th>
                  <th className={dataBase.th_content}><div>Клиент</div></th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr key={user.id} onClick={() => handleUserClick(user)}>
                    <td>{user.id}</td>
                    <td>{user.surname} {user.name} {user.patronymic}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}

export default DataBase;
