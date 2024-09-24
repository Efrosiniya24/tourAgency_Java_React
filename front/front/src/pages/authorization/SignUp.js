import React, { useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import axios from 'axios';
import login from './login.module.css';

const SignUp = () => {
  const navigate = useNavigate();  // Вызов useNavigate в начале компонента
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault(); // Предотвращение отправки формы по умолчанию

    try {
      const response = await axios.post('http://localhost:8083/tourAgency/auth/signUp', {
        name,
        email,
        password, // phone убран, если его нет на сервере
      });

      if (response.status === 201) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        console.log('Successfully registered:', response.data);
        navigate('/signIn');  // Перенаправление пользователя на страницу входа после успешной регистрации
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className={login.containerLogin}>
      <div className={login.form_container}>
        <div className={login.sign_in}>
          <form onSubmit={handleSubmit}>
            <h1>Зарегистрироваться</h1>
            <input
              type="text"
              name="name"
              placeholder="Имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              name="phone"
              placeholder="Номер телефона"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <input
              type="password"  // Изменен тип на password для правильного ввода пароля
              name="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Зарегистрироваться</button>
          </form>
        </div>
      </div>
      <div className={login.toggle_container}>
        <div className={login.toggle}>
          <div className={login.toggle_panel}>
            <div className={login.toggle_right}>
              <h1>Добро пожаловать!</h1>
              <p>Введите Ваши персональные данные для авторизации</p>
              <NavLink to="/signIn">
                <button className={login.hidden}>Войти</button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
