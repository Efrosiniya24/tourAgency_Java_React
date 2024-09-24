import React from 'react';
import selectedStyle from "./selectedUser.module.css";

const SelectedUser = ({ user, dataBase, setIsVisible, fetchUserOrders, handleCloseSelectedUser }) => {
  if (!user) {
    return null;
  }

  const handleClose = () => {
    handleCloseSelectedUser(); // Закрыть both SelectedUser и application_cards
  };

  const handleShowOrders = () => {
    fetchUserOrders(user.id);
  };

  return (
    <div className={dataBase.selectedUserInfoContainer}>
      <div className={dataBase.selectedUserInfo}>
        <div className={selectedStyle.user_info_container}>
          <div className={selectedStyle.user_info_header}>
            {user.surname} {user.name} {user.patronymic}
            <button className={selectedStyle.close_button} onClick={handleClose}>
              ×
            </button>
          </div>
          <div className={selectedStyle.user_info_data}>
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>Адрес:</span>
              <span></span>
            </div>
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>Дата рождения:</span>
              <span></span>
            </div>
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>Моб. телефон:</span>
              <span>{user.phone}</span>
            </div>
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>email:</span>
              <span>{user.email}</span>
            </div>
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>Номер и серия паспорта:</span>
              <span></span>
            </div>
            <div className={selectedStyle.user_info_row}>
              <span className={selectedStyle.user_info_term}>Срок действия паспорта:</span>
              <span></span>
            </div>
          </div>
          <div className={selectedStyle.user_actions}>
            <button onClick={handleShowOrders}>Посмотреть заявки</button>
            {/* <button>Посмотреть туры</button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedUser;
