import React from "react";
import { render } from 'react-dom';
import { ChakraProvider } from "@chakra-ui/react";
//import Header from "./components/Header";
import SideBar from "./components/Sidebar/Sidebar";
import PatientList from "./components/PatientList/PatientList";
import Note from "./components/Note/Note";
import LayoutSelector from "./components/LayoutSelector/LayoutSelector";
import InformationTag from "./components/InformationTag/InformationTag";
import OveralTag from "./components/OveralTag/OveralTag";
import LoginPage from "./screens/Login/LoginPage";
import MyTabs from "./components/Tabs/Tabs";
import PatientInfor from "./components/PatientInfor/PatientInfor";
import PatientCard from "./components/PatientList/PatientCard";
import MyTable from "./components/MyTable/MyTable";
import PatientGridCard from "./components/PatientGridCard/PatientGridCard";

function App() {
  
  return (
    <ChakraProvider>
      {/* <LoginPage/> */}
      {/* <PatientList /> */}
      {<MyTable/>}
      {/* <SideBar /> */}
      { /* <Note /> */ }
      { /*< LayoutSelector /> */ }
      {/* <InformationTag/> */}
      {/* <OveralTag /> */}
      {/* <MyTabs/> */}
      {/* {<PatientInfor/>} */}
      {/* {<PatientCard/>} */}
      {/* {<PatientGridCard/>} */}
      {/* <InputTag/> */}
    </ChakraProvider>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)