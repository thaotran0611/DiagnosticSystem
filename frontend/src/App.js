import logo from './img/logo.png';
import './App.css';
import React, {useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import LandingPage from './screens/Landing/LandingPage';
import LoginPage from './screens/Login/LoginPage';
import Overview from './screens/Doctor/Overview/Overview';
import Patient from './screens/Doctor/Patient/Patient';
import BasicDateTimePicker from './components/DateTimePicker/DateTimePicker';
import PatientGridCard from './components/PatientGridCard/PatientGridCard';
import DetailPatient from './screens/Doctor/DetailPatient/DetailPatient';
import Sidebar from './components/Sidebar/Sidebar';
import Setting from './screens/Setting/Setting';
import OverviewResearcher from './screens/Reseacher/Overview/Overview';
import Disease from './screens/Reseacher/Disease/Diseases';
import DetailDisease from './screens/Reseacher/DetailDisease/DetailDisease';
import Medicine from './screens/Reseacher/Medicine/Medicine';
import DetailMedicine from './screens/Reseacher/DetailMedicine/DetailMedicine';
import OverviewAnalyst from './screens/Analyst/Overview/Overview';
import Model from './screens/Analyst/Model/Model';
import OverviewAdmin from './screens/Administrator/Overview/Overview';
import User from './screens/Administrator/User/User';
import DetailUser from './screens/Administrator/DetailUser/DetailUser';
import Schedule from './screens/Administrator/Schedule/Schedule';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Box>
      <Routes>
        <Route 
          path="/"
          element={
            <LandingPage/>
          }
        />
        <Route
          path="/login"
          element={
            <LoginPage/>
          }
        />
        <Route 
          path='/doctor/overview'
          element={
            <Overview/>
          }
        />
        <Route
          path='/doctor/patient'
          element={
            <Patient/>
          }
        />
        <Route
          path='/doctor/patient/detailpatient'
          element={
            <DetailPatient/>
          }
        />
        <Route
          path='/doctor/setting'
          element={
            <Setting/>
          }
        />
        <Route 
          path='/researcher/overview'
          element={
            <OverviewResearcher/>
          }
        />
        <Route 
          path='/researcher/disease'
          element={
            <Disease />
          }
        />
        <Route 
          path='/researcher/disease/detaildisease'
          element={
            <DetailDisease />
          }
        />
        <Route
          path='/researcher/medicine'
          element={
            <Medicine/>
          }
        />
        <Route 
          path='/researcher/medicine/detailmedicine'
          element={
            <DetailMedicine/>
          }
        />
        <Route
          path='/analyst/overview'
          element={
            <OverviewAnalyst/>
          }
        />
        <Route
          path='/analyst/model'
          element={
            <Model/>
          }
        />
        <Route
          path='/admin/overview'
          element={
            <OverviewAdmin/>
          }
        />
        <Route
          path='/admin/users'
          element={
            <User/>
          }
        />
        <Route
          path='/admin/users/detailuser'
          element={
            <DetailUser/>
          }
        />
        <Route
          path='/admin/schedule'
          element={
            <Schedule/>
          }
        />
      </Routes>
    </Box>
  );
}

export default App;
