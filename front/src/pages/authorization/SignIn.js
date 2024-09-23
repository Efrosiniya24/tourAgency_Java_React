import React, { useState } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import axiosInstance from './axiosInstance'; 
import login from './login.module.css';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Получение CSRF токена из meta-тега
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

  const handleSubmit = async (event) => {
    event.preventDefault(); 
    try {
      axiosInstance.post(
        '/user/signIn', 
        { email, password },
        { headers: { 'X-CSRFToken': csrfToken } } 
      )
      .then(response => {
        if (response.status !== 200) return;

        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);
        const { id, role } = response.data;
        localStorage.setItem('userRole', role);

        switch (role) {
          case 'client':
            navigate(`/tours`);
            break;
          case 'admin':
            navigate(`/mainAdmin/${id}`);
            break;
          default:
            setErrorMessage('Неизвестная роль пользователя');
        }
      })
      .catch(error => {
        console.log(error.response.status);
        if (error.response.status === 403) {
          setErrorMessage('Ваш аккаунт деактивирован. Пожалуйста, свяжитесь с поддержкой.');
        } else {
          console.error('Ошибка при авторизации:', error);
          setErrorMessage('Неверный логин или пароль');
        }
      });
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      setErrorMessage('Неверный логин или пароль');
    }
  };

  return (
    <div className={login.mainLogin}>
      <div className={login.containerLogin}>
        <div className={login.sign_in}>
          <div className={login.form_container}>
            <form onSubmit={handleSubmit}>
              <h1>Войти</h1>
              <input 
                type="email" 
                name="email" 
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input 
                type="password" 
                name="password" 
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input type="hidden" name="_csrf" value={csrfToken} /> 
              <button type="submit">Войти</button>
            </form>
          </div>
        </div>
        <div className={login.toggle_container}>
          <div className={login.toggle}>
            <div className={login.toggle_panel}>
              <div className={login.toggle_right}>
                <h1>Добро <br/>пожаловать!</h1>
                <p>Введите Ваши персональные данные для авторизации</p>
                <NavLink to="/signUp">
                  <button className={login.hidden}>Зарегистрироваться</button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
