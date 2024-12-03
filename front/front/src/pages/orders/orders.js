import React, { useEffect, useState } from "react";
import axios from "axios";
import format from "date-fns/format";
import parseISO from "date-fns/parseISO";
import HeaderAdmin from "../../components/headerAdmin/headerAdmin";
import SliderBar from "../../components/sliderBar/sliderBar";
import { useNavigate } from 'react-router-dom';
import styles from "./orders.module.css";
import { FaChevronRight } from 'react-icons/fa';
import searchIcon from "./../../photo/search2.png";
import reloadIcon from "./../../photo/reload.png";
import Pointer from "./../../components/pointer/pointer";
import RejectButton from "../../components/rejectButton/rejectButton";
import AcceptButton from "../../components/acceptButton/acceptButton"

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeStatus, setActiveStatus] = useState("processing");

    const navigate = useNavigate();

    const handlePointerClick = (order) => {
        navigate(`/tour/${order.id}`);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('accessToken');  
            if (!token) {
                throw new Error('Token not found. Please log in again.');
            }
            const response = await axios.get('http://localhost:8083/tourAgency/orders/getOrders', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('Response from server:', response.data); 
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

    const formatCreatedDate = (dateString) => {
        try {
            return format(parseISO(dateString), "dd.MM.yyyy");
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateString; 
        }
    };

    const handleSearch = async () => {
        // setIsLoading(true);
        // setError(null);
        // try {
        //     const response = await axios.get('http://localhost:8083/tourAgency/orders/search', {
        //         user_name: searchTerm,
        //         user_surname: searchTerm,
        //         user_patronymic: searchTerm,
        //         tour_name: searchTerm,
        //         travel_agency: searchTerm
        //     }, {
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     });
        //     setOrders(response.data);
        //     setFilteredOrders(response.data);
        // } catch (error) {
        //     console.error('Search error:', error);
        //     setError(error);
        // } finally {
        //     setIsLoading(false);
        // }
    };

    const handleSearchEnter = async (event) => {
        // if (event.key === 'Enter') {
        //     handleSearch();
        // }
    };

    const handleReload = () => {
        fetchOrders();
    };

    const filterByStatus = (status) => {
        setActiveStatus(status);
        const filtered = orders.filter(order => order.status === status);
        setFilteredOrders(filtered);
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('Token not found. Please log in again.');
            }
    
            const response = await axios.put(
                `http://localhost:8083/tourAgency/orders/updateStatus/${orderId}`,
                newStatus,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            const updatedOrder = response.data;
            const updatedOrders = orders.map(order =>
                order.id === orderId ? updatedOrder : order
            );
            setOrders(updatedOrders);
            const filtered = updatedOrders.filter(order => order.status === activeStatus);
            setFilteredOrders(filtered);
    
            console.log('Order status updated:', updatedOrder);
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Не удалось обновить статус. Попробуйте позже.');
        }
    };
    

    const handleClick = (status) => {
        setActiveStatus(status);
        filterByStatus(status); 
    };

    return (
        <div>
            <HeaderAdmin />
            <div className={styles.containerOrders}>
                <SliderBar />
                <main className={styles.content}>
                    <div className={styles.data}>
                        <div className={styles.tableDataBase}>
                            <thead className={styles.tableDataBaseTH}>
                                <tr>
                                    <th 
                                        className={`${styles.processing} ${activeStatus === "processing" ? styles.active : ""}`} 
                                        onClick={() => handleClick("processing")}
                                    >
                                        В обработке
                                    </th>
                                    <th 
                                        className={`${styles.accepted} ${activeStatus === "accepted" ? styles.active : ""}`} 
                                        onClick={() => handleClick("accepted")}
                                    >
                                        Принята
                                    </th>
                                    <th 
                                        className={`${styles.rejected} ${activeStatus === "rejected" ? styles.active : ""}`} 
                                        onClick={() => handleClick("rejected")}
                                    >
                                        Отклонена
                                    </th>
                                </tr>
                            </thead>
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
                                    placeholder="Введите фио или тур"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearchEnter}
                                />
                            </div>
                            <div className={styles.reloadIcon}>
                                <img 
                                    className={styles.reloadIcon} 
                                    src={reloadIcon} 
                                    alt="Reload" 
                                    onClick={handleReload} 
                                />
                            </div>
                        </div>
                        <div className={styles.applicationCards}>
                            {isLoading ? (
                                <div>Загрузка...</div>
                            ) : (
                                filteredOrders.length === 0 ? (
                                    <div>Нет данных для отображения</div>
                                ) : (   
                                filteredOrders.map(order => (
                                    <div key={order.id} className={styles.card}>
                                        <div className={styles.applicationHeader}>
                                            <div className={styles.idBox}>
                                                <span>ID</span>
                                                <span className={styles.dividerWhite}></span>
                                                <span className={styles.idValue}>{order.id}</span>
                                            </div>
                                            <div className={styles.userInfo}>
                                                <span className={styles.idLabel}>K</span>
                                                <span className={styles.dividerBlack}></span>
                                                <input
                                                    value= {`${order.user.surname} ${order.user.name} ${order.user.patronymic}`}
                                                />
                                            </div>
                                        </div>
                                        <div className={styles.applicationHeader}>
                                            <div className={styles.userInfo}>
                                                <span  className={styles.idLabel}>O</span>
                                                <span className={styles.dividerBlack}></span>
                                                <span className= {styles.textInSpan}>{formatCreatedDate(order.createdDate)}</span>
                                            </div>
                                            {order.status !== 'processing' && (
                                                <div className={styles.userInfo}>
                                                    <span  className={styles.idLabel}>П</span>
                                                    <span className={styles.dividerBlack}></span>
                                                    <span className= {styles.textInSpan}>{formatCreatedDate(order.updateStatusDate)}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.applicationHeader}>
                                            <div className={styles.userInfo}>
                                                <span  className={styles.idLabel}>Кол. чел.:</span>
                                                <span className={styles.dividerBlack}></span>
                                                <span className= {styles.textInSpan}>{order.numberOfPeople}</span>
                                            </div>
                                            <div className={styles.userInfo}>
                                                <span className= {styles.textInSpan}>{order.user.phoneNumber}</span>
                                            </div>
                                        </div>
                                        <div className={styles.applicationHeader}>
                                            <div className={styles.userInfo}>
                                                <span className= {styles.textInSpan}>{order.user.email}</span>
                                            </div>
                                        </div>
                                        <div className={styles.aboutTour}>
                                            <p className={styles.idLabel}>Тур</p>
                                            <div className = {styles.pointer} onClick={() => handlePointerClick(order)}>
                                                <p>{order.nameOfTour}</p>
                                                <Pointer/>
                                            </div>
                                        </div>
                                        <div className={styles.applicationHeader}>
                                            <div className={styles.userInfo}>
                                                <div className={styles.textColumn}>
                                                    <span  className={styles.idLabel}>Кол. дней.: 
                                                        <div className={`${styles.textInSpan} ${styles.spaceAfter}`}>{order.numberOfDays}</div>
                                                    </span>
                                                    <span  className={styles.idLabel}>С{' '} 
                                                        <div className={`${styles.textInSpan} ${styles.spaceAfter}`}> {formatCreatedDate(order.date)}</div>
                                                    </span>
                                                    <span  className={styles.idLabel}>По{' '} 
                                                        <div className={`${styles.textInSpan} ${styles.spaceAfter}`}> {formatCreatedDate(order.endDate  )}</div>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className={styles.buttons}>
                                                {order.status === "processing" && (
                                                    <>
                                                        <AcceptButton onClick={() => updateOrderStatus(order.id, 'accepted')} />
                                                        <RejectButton onClick={() => updateOrderStatus(order.id, 'rejected')} />
                                                    </>
                                                )}
                                                {order.status === "accepted" && (
                                                    <RejectButton onClick={() => updateOrderStatus(order.id, 'rejected')} />
                                                )}
                                                {order.status === "rejected" && (
                                                    <AcceptButton onClick={() => updateOrderStatus(order.id, 'accepted')} />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Orders;
