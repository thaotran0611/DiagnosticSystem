import React from "react";
import { render } from 'react-dom';
import { ChakraProvider } from "@chakra-ui/react";
//import Header from "./components/Header";
import SideBar from "./components/Sidebar/Sidebar";
import PatientList from "./components/PatientList/PatientList";
import Note from "./components/Note/Note";
import InformationTag from "./components/InformationTag/InformationTag";
import OveralTag from "./components/OveralTag/OveralTag";
import LayoutSelector from "./components/LayoutSelector/LayoutSelector";
import LoginPage from "./screens/Login/LoginPage";

function App() {
  
  return (
    <ChakraProvider>
      { <PatientList /> }
      {/* <SideBar /> */}
      { /* <Note /> */ }
      { /*< LayoutSelector /> */ }
      {/* <InformationTag/> */}
      {/* <OveralTag /> */}
      {/*<LoginPage/>*/}
      {/* <InputTag/> */}
    </ChakraProvider>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)