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
  var role = '';
  if (sessionStorage.getItem('user')) {
      role = JSON.parse(sessionStorage.getItem('user')).role;
  }
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
            <LoginPage setLoggedIn={setLoggedIn}/>
          }
        />
        {role == 'DOCTOR' && (<Route 
          path='/overview'
          element={
            <Overview/>
          }
        />)}
        {role == 'DOCTOR' && (<Route
          path='/doctor/patient'
          element={
            <Patient/>
          }
        />)}
        
        {role == 'DOCTOR' && (<Route
          path='/doctor/patient/detailpatient/:patientCode'
          element={
            <DetailPatient/>
          }
        />
        )}
        {role == 'DOCTOR' && (<Route
          path='/doctor/setting'
          element={
            <Setting/>
          }
        />
        )}
        {role == 'RESEARCHER' && (<Route 
          path='/overview'
          element={
            <OverviewResearcher/>
          }
        /> )}
        {role == 'RESEARCHER' && (<Route 
          path='/researcher/disease'
          element={
            <Disease />
          }
        />
        )}
        {role == 'RESEARCHER' && (<Route 
          path='/researcher/disease/detaildisease'
          element={
            <DetailDisease />
          }
        /> )}
        {role == 'RESEARCHER' && (<Route
          path='/researcher/medicine'
          element={
            <Medicine/>
          }
        />)}

        {role == 'RESEARCHER' && (<Route 
          path='/researcher/medicine/detailmedicine'
          element={
            <DetailMedicine/>
          }
        />)}
        
        {role == 'ANALYST' && (<Route
          path='/overview'
          element={
            <OverviewAnalyst/>
          }
        />)}

        {role == 'ANALYST' && (<Route
          path='/analyst/model'
          element={
            <Model/>
          }
        /> )}

        {role == 'ADMINISTRATOR' && (<Route
          path='/overview'
          element={
            <OverviewAdmin/>
          }
        />)}

        {role == 'ADMINISTRATOR' && (<Route
          path='/admin/users'
          element={
            <User/>
          }
        />)}
        {role == 'ADMINISTRATOR' && (<Route
          path='/admin/users/detailuser'
          element={
            <DetailUser/>
          }
        />)}
        {role == 'ADMINISTRATOR' && (<Route
          path='/admin/schedule'
          element={
            <Schedule/>
          }
        />)}
      </Routes>
    </Box>
  );
}

export default App;
