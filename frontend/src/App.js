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

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    // <Sidebar/>
    // <BasicDateTimePicker/>
    // <PatientGridCard/>
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
      </Routes>
    </Box>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
