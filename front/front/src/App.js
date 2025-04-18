import React from 'react';
import MainPageUser from "./pages/mainPage/MainPageUser";
import AboutUs from "./pages/AboutUs/AboutUs";
import SignIn from "./pages/authorization/SignIn";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './pages/authorization/SignUp';
import MainAdmin from './pages/mainAdmin/MainAdminPage';
import DataBase from './pages/dataBase/DataBase';
import ToursAdmin from './pages/toursAdmin/ToursAdmin';
import Orders from './pages/orders/orders';
import Analytics from './pages/analytics/analytics';
import Tours from './pages/tour/tour';
import TourDetail from './pages/tourDetail/tourDetail';
import ApplicationForm from './pages/applicationForm/applicationForm';
import Report from './pages/report/report';
import { AuthProvider } from './components/AuthProvider';
import SelectedUser from './components/selectedUser/selectedUser';
import OrdersUser from './pages/OrdersUser/ordersUser';

function App() {
  return (
    <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<MainPageUser/>}></Route>
                <Route path="/aboutUs" element={<AboutUs/>}></Route>
                <Route path="/signIn" element={<SignIn/>}></Route>
                <Route path="/signUp" element={<SignUp/>}></Route>
                <Route path="/tours" element={<Tours/>}></Route>
                <Route path="/tour" element={<TourDetail/>}></Route>
                <Route path="/application" element={<ApplicationForm />} />
                <Route path="/mainAdmin/:user_id" element={<MainAdmin/>}></Route>
                <Route path="/dataBase" element={<DataBase/>}></Route>
                <Route path="/dataBase/selectedUser/:id" element={<SelectedUser/>}></Route>
                <Route path="/toursAdmin" element={<ToursAdmin/>}></Route>
                <Route path="/orders" element={<Orders/>}></Route>
                <Route path="/analytics" element={<Analytics/>}></Route>
                <Route path="/report" element={<Report/>}></Route>
                <Route path="/ordersUser" element={<OrdersUser/>}></Route>
            </Routes>
        </Router>
    </AuthProvider>
  );
}

export default App;
