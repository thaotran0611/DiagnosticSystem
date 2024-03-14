import React from "react";
import { render } from 'react-dom';
import { ChakraProvider } from "@chakra-ui/react";
//import Header from "./components/Header";
import SideBar from "./components/Sidebar/Sidebar";
import PatientList from "./components/PatientList/PatientList";
import Note from "./components/Note/Note";
import InformationTag from "./components/InformationTag/InformationTag";
import OveralTag from "./components/OveralTag/OveralTag";
import LoginPage from "./screens/Login/LoginPage";
import LandingPage from "./screens/Landing/LandingPage";
import UserTag from "./components/Usertag/UserTag";
import Search from "./components/Search/Search";
import Filter from "./components/Filter/Filter";
import SearchAndFilterBar from "./components/SearchAndFilterBar/SearchAndFilterBar";
import FilterTag from "./components/Filter/FilterTag";
import Tabs from "./components/Tabs/Tabs"
import BarChart from "./components/Chart/BarChart";
import ChartEvents from "./components/Chart/ChartEvents";
import { LineChart } from "./components/Chart/LineChart";
import { PieChart } from "./components/Chart/PieChart";
import { HorizontalChart } from "./components/Chart/HorizontalChart";
import Overview from "./screens/Doctor/Overview/Overview";
function App() {
  
  return (
    <ChakraProvider>
      {/* <PatientList /> */}
      {/* <SideBar /> */}
      {/* <Note /> */}
      {/* <InformationTag/> */}
      {/* <OveralTag /> */}
      {/* <LoginPage/> */}
      {/* <LandingPage /> */}
      {/* <InputTag/> */}
      {/* <UserTag/> */}
      {/* <Search /> */}
      {/* <Filter/> */}
      {/* <SearchAndFilterBar/> */}
      {/* <FilterTag /> */}
      {/* <Tabs/> */}
      {/* <BarChart /> */}
      {/* <ChartEvents/> */}
      {/* <LineChart/> */}
      {/* <PieChart/> */}
      {/* <HorizontalChart/> */}
      <Overview/>
    </ChakraProvider>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)