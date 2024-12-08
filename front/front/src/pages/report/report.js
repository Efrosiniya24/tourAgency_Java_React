import React, { useEffect, useState, useRef } from "react";   
import axios from "axios";
import { jsPDF } from "jspdf";
import "react-circular-progressbar/dist/styles.css";
import html2canvas from "html2canvas"; 
import styles from "./report.module.css";
import HeaderAdmin from "../../components/headerAdmin/headerAdmin";
import SliderBar from "../../components/sliderBar/sliderBar";

jsPDF.API.events.push(["addFonts", function () {
  this.addFont('https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Me5Q.ttf', 'Roboto', 'normal');
}]);


const Report = () => {
  const [initialTotalUsers, setInitialTotalUsers] = useState("");
  const [initialTotalOrders, setInitialTotalOrders] = useState("");
  const [totalUsers, setTotalUsers] = useState("");
  const [totalOrders, setTotalOrders] = useState("");
  const [processingOrders, setProcessingOrders] = useState("");
  const [acceptedOrders, setAcceptedOrders] = useState("");
  const [rejectedOrders, setRejectedOrders] = useState("");
  const [averageAge, setAverageAge] = useState("");
  const [averageAgeMale, setAverageAgeMale] = useState("");
  const [averageAgeFemale, setAverageAgeFemale] = useState("");
  const [genderData, setGenderData] = useState({
    male_percentage: 0,
    female_percentage: 0,
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const endpoints = [
      {
        url: "http://localhost:8083/tourAgency/admin/quantityOfAllUsers",
        setter: setInitialTotalUsers,
      },
      {
        url: "http://localhost:8083/tourAgency/orders/quantityOfAllOrders",
        setter: setInitialTotalOrders,
      },
      {
        url: "http://localhost:8083/tourAgency/admin/averageAgeClient",
        setter: setAverageAge,
      },
      {
        url: "http://localhost:8083/tourAgency/admin/averageAgeMale",
        setter: setAverageAgeMale,
      },
      {
        url: "http://localhost:8083/tourAgency/admin/averageAgeFemale",
        setter: setAverageAgeFemale,
      },
      {
        url: "http://localhost:8083/tourAgency/admin/percentageOfFemale",
        setter: setAverageAgeFemale,
      },
      {
        url: "http://localhost:8083/tourAgency/admin/percentageOfMale",
        setter: setAverageAgeFemale,
      },
      {
        url: "http://localhost:8083/tourAgency/orders/quantityOfOrderProcessing",
        setter: setProcessingOrders,
      },
      {
        url: "http://localhost:8083/tourAgency/orders/quantityOfOrderRejected",
        setter: setRejectedOrders,
      },
      {
        url: "http://localhost:8083/tourAgency/orders/quantityOfOrderAccepted",
        setter: setAcceptedOrders,
      },
      {
        url: "http://localhost:8083/tourAgency/orders/quantityOfAllOrders",
        setter: setTotalOrders,
      },
    ];

    const fetchAllData = async () => {
      try {
        const responses = await Promise.all(
          endpoints.map((endpoint) =>
            axios.get(endpoint.url, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
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
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const fetchGenderData = async () => {
      try {
        const [maleResponse, femaleResponse] = await Promise.all([
          axios.get("http://localhost:8083/tourAgency/admin/percentageOfMale", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          axios.get(
            "http://localhost:8083/tourAgency/admin/percentageOfFemale",
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          ),
        ]);

        setGenderData({
          male_percentage: maleResponse.data,
          female_percentage: femaleResponse.data,
        });
      } catch (err) {
        console.error("Ошибка при запросе данных о процентах полов:", err);
      }
    };

    fetchGenderData();
  }, []);

  const generatePDF = async () => {
    const doc = new jsPDF();

    doc.setFont("Roboto");

    doc.setFontSize(16);
    doc.text("Отчёт об аналитике", 20, 20);

    doc.setFontSize(12);
    doc.text(`Все пользователи: ${initialTotalUsers}`, 20, 30);
    doc.text(`Все заказы: ${initialTotalOrders}`, 20, 40);
    doc.text(`Обрабатываемые заказы: ${processingOrders}`, 20, 50);
    doc.text(`Принятые заказы: ${acceptedOrders}`, 20, 60);
    doc.text(`Отклоненные заказы: ${rejectedOrders}`, 20, 70);
    doc.text(`Средний возраст: ${averageAge}`, 20, 80);
    doc.text(`Средний возраст (мужчины): ${averageAgeMale}`, 20, 90);
    doc.text(`Средний возраст (женщины): ${averageAgeFemale}`, 20, 100);

    doc.text(`Процент мужчин: ${genderData.male_percentage}%`, 20, 110);
    doc.text(`Процент женщин: ${genderData.female_percentage}%`, 20, 120);

    const reportGenerationTime = new Date().toLocaleString();
    const pageWidth = doc.internal.pageSize.width;
    const timeXPosition = pageWidth - 20 - doc.getStringUnitWidth(reportGenerationTime) * doc.internal.scaleFactor;
    doc.text(`${reportGenerationTime}`, timeXPosition, 20);

    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const imgData = canvas.toDataURL("image/png");

      doc.addImage(imgData, "PNG", 20, 130, 180, 40);
    }

    doc.save("analytics-report.pdf");
};


  return (
    <div>
        <HeaderAdmin />
        <div className={styles.container}>
            <SliderBar />
            <main className={styles.content}>
                <h1>Генерация отчета</h1>
                <button onClick={generatePDF} className={styles.button}>Скачать отчет</button>
            </main>
        </div>
    </div>
  );
};

export default Report;
