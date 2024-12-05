import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import HeaderAdmin from "../../components/headerAdmin/headerAdmin";
import SliderBar from "../../components/sliderBar/sliderBar";
import analytics from "./analytics.module.css";
import calendar from "./calendar.png"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
    const [initialTotalUsers, setInitialTotalUsers] = useState('');
    const [initialTotalOrders, setInitialTotalOrders] = useState('');
    const [totalUsers, setTotalUsers] = useState('');
    const [totalOrders, setTotalOrders] = useState('');
    const [processingOrders, setProcessingOrders] = useState('');
    const [acceptedOrders, setAcceptedOrders] = useState('');
    const [rejectedOrders, setRejectedOrders] = useState('');
    const [averageAge, setAverageAge] = useState('');
    const [averageAgeMale, setAverageAgeMale] = useState('');
    const [averageAgeFemale, setAverageAgeFemale] = useState('');
    const [genderData, setGenderData] = useState({ male_percentage: 0, female_percentage: 0 });
    const [activeSection, setActiveSection] = useState('clients');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null); 

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
    
        const endpoints = [
            { url: 'http://localhost:8083/tourAgency/admin/quantityOfAllUsers', setter: setInitialTotalUsers },
            { url: 'http://localhost:8083/tourAgency/orders/quantityOfAllOrders', setter: setInitialTotalOrders },
            { url: 'http://localhost:8083/tourAgency/admin/averageAgeClient', setter: setAverageAge },
            { url: 'http://localhost:8083/tourAgency/admin/averageAgeMale', setter: setAverageAgeMale },
            { url: 'http://localhost:8083/tourAgency/admin/averageAgeFemale', setter: setAverageAgeFemale },
            { url: 'http://localhost:8083/tourAgency/admin/percentageOfFemale', setter: setAverageAgeFemale },
            { url: 'http://localhost:8083/tourAgency/admin/percentageOfMale', setter: setAverageAgeFemale },
            { url: 'http://localhost:8083/tourAgency/orders/quantityOfOrderProcessing', setter: setProcessingOrders },
            { url: 'http://localhost:8083/tourAgency/orders/quantityOfOrderRejected', setter: setRejectedOrders },
            { url: 'http://localhost:8083/tourAgency/orders/quantityOfOrderAccepted', setter: setAcceptedOrders },
            { url: 'http://localhost:8083/tourAgency/orders/quantityOfAllOrders', setter: setTotalOrders },
        ];
    
        const fetchAllData = async () => {
            try {
                const responses = await Promise.all(
                    endpoints.map(endpoint => 
                        axios.get(endpoint.url, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            },
                        })
                    )
                );
    
                responses.forEach((response, index) => {
                    endpoints[index].setter(response.data);
                });
            } catch (err) {
                console.error("Ошибка при запросах:", err);
            }
        };
    
        fetchAllData();
    }, []);
    
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
    
        const fetchGenderData = async () => {
            try {
                const [maleResponse, femaleResponse] = await Promise.all([
                    axios.get('http://localhost:8083/tourAgency/admin/percentageOfMale', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                    axios.get('http://localhost:8083/tourAgency/admin/percentageOfFemale', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }),
                ]);
    
                setGenderData({
                    male_percentage: maleResponse.data,
                    female_percentage: femaleResponse.data,
                });
            } catch (err) {
                console.error("Ошибка при запросе данных о процентах полов:", err);
                setError('Не удалось загрузить статистику по гендерному распределению');
            }
        };
    
        fetchGenderData();
    }, []);
    
    


    const handleSectionClick = (section) => {
        setActiveSection(section);
    };

    const orderData = {
        labels: ['В расмотрении', 'Принятые', 'Отклоненные'],
        datasets: [
            {
                label: 'Процент заявок',
                data: totalOrders > 0
                    ? [
                        (processingOrders / totalOrders) * 100,
                        (acceptedOrders / totalOrders) * 100,
                        (rejectedOrders / totalOrders) * 100,
                    ]
                    : [0, 0, 0], 
                backgroundColor: ['#76B174', '#F4E06E', '#DF9E61'],
                hoverBackgroundColor: ['#76B174', '#F4E06E', '#DF9E61'],
            },
        ],
    };

    const orderOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.raw.toFixed(1)}%`
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100, 
                ticks: {
                    callback: (value) => `${value}%`, 
                }
            }
        }
    };
    
    

    return (
        <div>
                <HeaderAdmin />
                <div className={analytics.containerAnalytics}>
                    <SliderBar />
                    <main className={analytics.content}>
                        <div className={analytics.first}>
                            <div className={analytics.generalNumbers}>
                                <div className={analytics.all}>
                                    <p className={analytics.header}>Всего заявок</p>
                                    <p className={analytics.justTextInHeader}>{initialTotalOrders}</p>
                                </div>
                                <div className={analytics.all}>
                                    <p className={analytics.header}>Всего клиентов</p>
                                    <p className={analytics.justTextInHeader}>{initialTotalUsers}</p>
                                </div>
                            </div>
                            <hr className={analytics.lineSeparator} />
                            <div className={analytics.measures}>
                                <div className={analytics.inputMeasures}>
                                    <div className={analytics.inputDate}>
                                        <p className={analytics.justTextInHeader}>C</p>
                                        <div className={analytics.inputDateIn}>
                                            <input
                                                type="date"
                                                name="beginningDate"
                                                placeholder="дд.мм.ггг"   
                                            />
                                            <div className={analytics.photo}>
                                                <img src = {calendar}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={analytics.inputDate}>
                                        <p className={analytics.justTextInHeader}>По</p>
                                        <div className={analytics.inputDateIn}>
                                            <input
                                                type="date"
                                                name="endDate"
                                                placeholder="дд.мм.ггг"   
                                            />
                                            <div className={analytics.photo}>
                                                <img src = {calendar}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={analytics.deliver}></div>
                                    <div className={analytics.inputDate}>
                                        <p className={analytics.justTextInHeader}>Регион</p>
                                        <div className={analytics.inputDateIn}>
                                            <input
                                                type="text"
                                                name="location"
                                                placeholder="Регион"   
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={analytics.buttonViewStatistics}>
                                    <p>Посмотреть статистику</p>
                                </div>
                            </div>
                            <hr className={analytics.lineSeparator} />
                        </div>
                        <div className={analytics.tableStatistics}>
                            <div className={analytics.headerTable}>
                                <div className={analytics.buttonTable} onClick={() => handleSectionClick('clients')}
                                >    
                                    <p className={analytics.justTextInHeader}>Клиенты</p>
                                </div>
                                <div className={analytics.buttonTable} onClick={() => handleSectionClick('orders')}>
                                    <p className={analytics.justTextInHeader} >Заявки</p>
                                </div>
                            </div>
                            <hr className={analytics.lineSeparator}/> 
                            {activeSection === 'clients' && 
                                <div className={analytics.contentSectionClients}>
                                    <div className={analytics.averageAge}>
                                        <div className={analytics.age}>
                                            <h1>Средний возраст клиента</h1>
                                            <p className={analytics.justTextInHeader}>{averageAge}</p>
                                        </div>
                                        <hr className={analytics.lineSeparator}/> 
                                        <div className={analytics.age}>
                                            <h1>Средний возраст мужчины</h1>
                                            <p className={analytics.justTextInHeader}>{averageAgeMale}</p>
                                        </div>
                                        <hr className={analytics.lineSeparator}/> 
                                        <div className={analytics.age}>
                                            <h1>Средний возраст женщины</h1>
                                            <p className={analytics.justTextInHeader}>{averageAgeFemale}</p>
                                        </div>
                                    </div>
                                    <div className={analytics.diagrams}>
                                        <div>
                                            <CircularProgressbar
                                                value={genderData.male_percentage}
                                                text={`${genderData.male_percentage.toFixed(1)}%`}
                                                styles={buildStyles({
                                                    pathColor: "#36A2EB",
                                                    textColor: "#36A2EB",
                                                    trailColor: "#d6d6d6"
                                                })}
                                            />
                                            <p className={analytics.justTextInHeader}>Мужчины</p>
                                        </div>
                                        <div>
                                            <CircularProgressbar
                                                value={genderData.female_percentage}
                                                text={`${genderData.female_percentage.toFixed(1)}%`}
                                                styles={buildStyles({
                                                    pathColor: "#FF6384",
                                                    textColor: "#FF6384",
                                                    trailColor: "#d6d6d6"
                                                })}
                                            />
                                            <p className={analytics.justTextInHeader}>Женщины</p>
                                        </div>
                                    </div>
                                </div>
                            }          
                            {activeSection === 'orders' &&
                                <div className={analytics.orderStatistics}>
                                    <div className={analytics.orderAnalytics}>
                                        <div className={analytics.dataOrder}>
                                            <p className={analytics.header}>Всего заявок</p>
                                            <p className={analytics.justTextInHeader}>{totalOrders}</p>
                                        </div>
                                        <div className={analytics.dataOrder}>
                                            <p className={analytics.header}>В расмотрении</p>
                                            <p className={analytics.justTextInHeader}>{processingOrders}</p>
                                        </div>
                                        <div className={analytics.dataOrder}>
                                            <p className={analytics.header}>Принятые</p>
                                            <p className={analytics.justTextInHeader}>{acceptedOrders}</p>
                                        </div>
                                        <div className={analytics.dataOrder}>
                                            <p className={analytics.header}>Отклоненные</p>
                                            <p className={analytics.justTextInHeader}>{rejectedOrders}</p>
                                        </div>
                                    </div>
                                    <div className={analytics.chartContainer}>
                                        <Bar data={orderData} options={orderOptions}/>
                                    </div>
                                </div>  
                            }
                        </div>
                    </main>
                </div>
        </div>
    );
}

export default Analytics;