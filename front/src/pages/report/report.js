import React, { useState } from "react";
import axios from "axios";
import HeaderAdmin from "../../components/headerAdmin/headerAdmin";
import SliderBar from "../../components/sliderBar/sliderBar";
import reportt from "./report.png";
import report from "./report.module.css";

const Report = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const downloadReport = async () => {
        try {
            const response = await axios.post('http://localhost:8000/orders/generate_order_report/', {
                start_date: startDate,
                end_date: endDate
            }, {
                responseType: 'blob', // важный параметр для получения данных в формате Blob
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Отчет по заявкам(full).pdf'); // Имя файла
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error("Ошибка при скачивании отчета:", error);
        }
    };

    return (
        <div className={report.reportt}>
            <div className={report.container}>
                <HeaderAdmin />
                <div className={report.containerOrders}>
                    <SliderBar />
                    <main className={report.content}>
                        <div className={report.container}>
                            <div className={`${report.filter_bar} ${report.flexRow}`}>
                                <div className={report.filterP}>
                                    <div className={report.dateRegionFilter}>
                                        <div className={report.dateFilter}>
                                            <p>С</p>
                                            <input 
                                                type="date" 
                                                id="start-date" 
                                                value={startDate} 
                                                onChange={(e) => setStartDate(e.target.value)} 
                                            />
                                            <p>по</p>
                                            <input 
                                                type="date" 
                                                id="end-date" 
                                                value={endDate} 
                                                onChange={(e) => setEndDate(e.target.value)} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className={report.card}>
                            <button onClick={downloadReport}>
                                <img src={reportt} alt="Отчет"/>
                                <p className={report.card_p}>Скачать отчет по заявкам</p>
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default Report;
