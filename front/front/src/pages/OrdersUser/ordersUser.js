import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, Link, Navigate } from 'react-router-dom';
import HeaderClient from '../../components/headerClient/headerClient';
import axios from 'axios';
import styles from './ordersUser.module.css';
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import { useNavigate } from 'react-router-dom';


const OrdersUser = () => {

    const [orders, setOrders] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null); 

    const isAuthenticated = !!localStorage.getItem('accessToken');
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId'); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('accessToken'); 
                const response = await axios.get(`http://localhost:8083/tourAgency/orders/getOrders/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',                    },
                });
                setOrders(response.data); 
                
            } catch (err) {
                setError('Не удалось загрузить заявки. Попробуйте позже.');
            } finally {
                setLoading(false);
            }
        };


    if (!isAuthenticated) {
        return <Navigate to="/signIn" replace />;
    }

    if (userRole !== 'USER') {
        return <Navigate to="/signIn" replace />;
    }

        fetchOrders();
    }, [userId]);


    const formatCreatedDate = (dateString) => {
        try {
            return format(parseISO(dateString), "dd.MM.yyyy");
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString; 
        }
    };


    const handlePointerClick = (order) => {
        navigate(`/tour/${order.id}`);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'processing':
                return styles.processing; 
            case 'accepted':
                return styles.accepted; 
            case 'rejected':
                return styles.rejected;
            default:
                return styles.unknown;
        }
    };
    
    const getStatusText = (status) => {
        switch (status) {
            case 'processing':
                return 'Заявка в рассмотрении';
            case 'accepted':
                return 'Заявка принята';
            case 'rejected':
                return 'Заявка отклонена';
            default:
                return 'Неизвестный статус';
        }
    };
    
    return (
        <div>
            <HeaderClient />
            <div className={styles.ordersUserPage}>
                <div className={styles.secondHeader}>
                    <p>Профиль</p>
                    <p>Избранное</p>
                    <p>Мои заявки</p>
                    <p>Мои заказы</p>
                </div>
                <div className={styles.orderPart}>
                    <h1>Мои заявки</h1>
                    <div className={styles.orders}>
                        {orders.map((order) => (
                            <div key={order.id} className={styles.order}>
                                <div className={styles.line}>
                                    <div className={styles.userInfo}>
                                        <span className={styles.idLabel}>O</span>
                                        <span className={styles.dividerBlack}></span>
                                        <span className={styles.textInSpan}>
                                            {formatCreatedDate(order.createdDate)}
                                        </span>
                                    </div>
                                    <div className={styles.userInfo}>
                                        <span className={styles.idLabel}>П</span>
                                        <span className={styles.dividerBlack}></span>
                                        <span className={styles.textInSpan}>
                                            {formatCreatedDate(order.updateStatusDate)}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.lineColumn}>
                                    <div className={styles.column}>
                                        <div className={styles.userInfoColumn}>
                                            <span className={styles.idLabel}>Кол. чел.:</span>
                                            <span className={styles.textInSpan}>
                                                {order.numberOfPeople}
                                            </span>
                                        </div>
                                        <div className={styles.aboutTour}>
                                            <p className={styles.idLabel}>Тур</p>
                                            <div
                                                className={styles.pointer}
                                                onClick={() => handlePointerClick(order)}
                                            >
                                                <p>{order.nameOfTour}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.column}>
                                        <div className={styles.userInfo}>
                                            <div className={styles.textColumn}>
                                                <span className={styles.idLabel}>
                                                    Кол. дней.:
                                                    <div
                                                        className={`${styles.textInSpan} ${styles.spaceAfter}`}
                                                    >
                                                        {order.numberOfDays}
                                                    </div>
                                                </span>
                                                <span className={styles.idLabel}>
                                                    С{' '}
                                                    <div
                                                        className={`${styles.textInSpan} ${styles.spaceAfter}`}
                                                    >
                                                        {formatCreatedDate(order.date)}
                                                    </div>
                                                </span>
                                                <span className={styles.idLabel}>
                                                    По{' '}
                                                    <div
                                                        className={`${styles.textInSpan} ${styles.spaceAfter}`}
                                                    >
                                                        {formatCreatedDate(order.endDate)}
                                                    </div>
                                                </span>
                                            </div>
                                        </div>
                                        <div className={styles.status}>
                                            <div
                                                className={`${styles.statusBlock} ${getStatusClass(
                                                    order.status
                                                )}`}
                                            >
                                                <span>{getStatusText(order.status)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {order.status === 'accepted' && (
                                    <div className={styles.line}>
                                        <button className={styles.pay}>
                                            Оплатить
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrdersUser;
