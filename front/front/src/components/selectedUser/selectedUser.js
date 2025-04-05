import selectedStyle from "./selectedUser.module.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SelectedUser = ({ user, dataBase, setIsVisible, fetchUserOrders, handleCloseSelectedUser }) => {
  const [orderCount, setOrderCount] = useState(null);

  useEffect(() => {
    const fetchOrderCount = async () => {
      if (!user) return;
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`http://localhost:8083/tourAgency/admin/quantityOfOrders/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        setOrderCount(response.data); 
      
    };

    fetchOrderCount();
  }, [user]);

  if (!user) {
    return null;
  }

  const handleClose = () => {
    handleCloseSelectedUser();
  };

  const handleShowOrders = () => {
    fetchUserOrders(user.id);
  };

  const getGender = (gender) => {
    if (gender === 'male') return 'Мужской';
    if (gender === 'female') return 'Женский';
    return 'Не указан';
  };

  return (
    <div className={dataBase.selectedUserInfoContainer}>
      <div className={dataBase.selectedUserInfo}>
        <div className={selectedStyle.user_info_container}>
          <div className={selectedStyle.user_info_header}>
            <div className={selectedStyle.user}>
            {user.surname} {user.name} {user.patronymic}
            </div>
            <button className={selectedStyle.close_button} onClick={handleClose}>
              ×
            </button>
          </div>
          <div className={selectedStyle.user_info_data}>
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}> Пол:</span>
              <span>{getGender(user.genderClient)}</span>
            </div>
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>Моб. телефон:</span>
              <span>{user.phoneNumber}</span>
            </div>
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>email:</span>
              <span className={selectedStyle.spanUser}>{user.email}</span>
            </div>
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>Номер и серия паспорта:</span>
              <span>{user.passportSeries} {user.passportNumber}</span>
            </div>
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>День рождения:</span>
              <span>{user.dateOfBirth}</span>
            </div> 
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>Количество заявок</span>
              <span>{orderCount}</span>
            </div> 
            {/* <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>Срок действия паспорта:</span>
              <span></span>
            </div> */}
            <div >
              <button onClick={handleShowOrders} className={selectedStyle.user_actions}>Посмотреть заявки</button>
              {/* <button>Посмотреть туры</button> */}
            </div>
            <div className={selectedStyle.orderss}>
          
          </div>
          </div>
          <div className={selectedStyle.orderss}>
          
          </div>
        </div>

      </div>

    </div>
  );
};

export default SelectedUser;
