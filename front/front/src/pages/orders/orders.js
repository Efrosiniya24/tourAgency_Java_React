import React, { useEffect, useState } from "react";
import axios from "axios";
import HeaderAdmin from "../../components/headerAdmin/headerAdmin";
import SliderBar from "../../components/sliderBar/sliderBar";
import styles from "./orders.module.css";
import { FaChevronRight } from 'react-icons/fa';
import searchIcon from "./../../photo/search2.png";
import reloadIcon from "./../../photo/reload.png";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [currentStatus, setCurrentStatus] = useState('processing');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/orders/allOrders/');
            const allOrders = response.data;
            setOrders(allOrders);
            const processingOrders = allOrders.filter(order => order.status === 'processing');
            setFilteredOrders(processingOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async () => {
        setIsLoading(true);
        setError(null);
        console.log('Search term:', searchTerm);
        try {
            const response = await axios.post('http://localhost:8000/orders/search/', 
                { 
                    user_name: searchTerm, 
                    user_surname: searchTerm, 
                    user_patronymic: searchTerm, 
                    tour_name: searchTerm, 
                    travel_agency: searchTerm 
                }, 
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log('Search response:', response.data);
            setOrders(response.data);
            setFilteredOrders(response.data);
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

    const filterByStatus = (status) => {
        setCurrentStatus(status);
        const filtered = orders.filter(order => order.status === status);
        setFilteredOrders(filtered);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.post('http://localhost:8000/orders/update-status/', {
                order_id: orderId,
                status: newStatus
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.status === 'success') {
                const updatedOrders = orders.map(order => order.id === orderId ? { ...order, status: newStatus } : order);
                setOrders(updatedOrders);
                const filtered = updatedOrders.filter(order => order.status === currentStatus);
                setFilteredOrders(filtered);
            } else {
                console.error('Failed to update order status:', response.data.message);
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className={styles.orderStyle}>
            <div className={styles.container}>
                <HeaderAdmin />
                <div className={styles.containerOrders}>
                    <SliderBar />
                    <main className={styles.content}>
                        <section className={styles.data}>
                            <div className={styles.tableDataBase}>
                                <th className={`${styles.th_content} ${styles.processing}`} onClick={() => filterByStatus('processing')}><div>В обработке</div></th>
                                <th className={`${styles.th_content} ${styles.accepted}`} onClick={() => filterByStatus('accepted')}><div>Принята</div></th>
                                <th className={`${styles.th_content} ${styles.rejected}`} onClick={() => filterByStatus('rejected')}><div>Отклонена</div></th>
                                <hr className={styles.lineSeparator} />
                            </div>
                            <div className={styles.searchAndUserInfo}>
                                <div className={styles.search}>
                                    <img 
                                        src={searchIcon} 
                                        alt="Search" 
                                        onClick={handleSearch}
                                    />
                                    <input 
                                        type="text" 
                                        className={styles.searchInput}
                                        placeholder="Введите имя, фамилию, или турагентство"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={handleSearchEnter}
                                    />
                                </div>
                                <img 
                                    className={styles.reloadIcon} 
                                    src={reloadIcon} 
                                    alt="Reload" 
                                    onClick={handleReload} 
                                />
                            </div>
                            <div className={styles.application_cards}>
                                {isLoading ? (
                                    <div>Загрузка...</div>
                                ) : (
                                    filteredOrders.map(order => (
                                        <div key={order.id} className={styles.application_card}>
                                            <div className={styles.application_header}>
                                                <div className={styles.id_box}>
                                                    <span className={styles.id_label}>ID</span>
                                                    <span className={styles.divider}></span>
                                                    <span className={styles.id_value}>{order.id}</span>
                                                </div>
                                                <div className={styles.user_info}>
                                                    <div className={styles.name_box}>
                                                        <span className={styles.id_label}>K</span>
                                                        <span className={styles.name}>{`${order.user.surname} ${order.user.name} ${order.user.patronymic}`}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.application_body}>
                                                <div className={styles.client_info}>
                                                    <div className={styles.inline_container}>
                                                        <div className={styles.date_box}>
                                                            <span className={styles.date}>{order.createdAt}</span>
                                                        </div>
                                                        <div className={styles.name_box}>
                                                            <span className={styles.id_label}>M</span>
                                                            <span className={styles.name}></span>
                                                        </div>
                                                    </div>
                                                    <div className={styles.phone_box}>
                                                        <span className={styles.phone}>{order.user.phone}</span>
                                                    </div>
                                                    <div className={styles.phone_box}>
                                                        <span className={styles.phone}>{order.user.email}</span>
                                                    </div>
                                                    <div className={styles.inline_container}>
                                                        <div className={styles.phone_box}>
                                                            <span className={styles.id_label}>Кол. чел.:</span>
                                                            <span className={styles.phone}>{order.numberOfPeople}</span>
                                                        </div>
                                                        <div className={styles.phone_box}>
                                                            <span className={styles.id_label}>Турагентство:</span>
                                                            <span className={styles.phone}>{order.tour.travelAgency}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.application_main}>
                                                    <div className={styles.application_details}>
                                                        <p className={`${styles.header} ${styles.rectangle}`}>{order.tour.name}</p>
                                                        <div>
                                                            <p>{order.tour.description}</p>
                                                        </div>
                                                        <button className={styles.nextButton}><FaChevronRight /></button>
                                                    </div>
                                                    <div className={`${styles.application_actions} ${order.status === 'processing' ? styles.processing_actions : ''}`}>
                                                        {order.status === 'processing' && (
                                                            <>
                                                                <button className={styles.reject} onClick={() => updateOrderStatus(order.id, 'rejected')}>Отклонить</button>
                                                                <button className={styles.accept} onClick={() => updateOrderStatus(order.id, 'accepted')}>Принять</button>
                                                            </>
                                                        )}
                                                        {order.status === 'accepted' && (
                                                            <button className={styles.reject} onClick={() => updateOrderStatus(order.id, 'rejected')}>Отклонить</button>
                                                        )}
                                                        {order.status === 'rejected' && (
                                                            <button className={styles.accept} onClick={() => updateOrderStatus(order.id, 'accepted')}>Принять</button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Orders;
