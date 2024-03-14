import React from "react";
import SideBar from "../../../components/Sidebar/Sidebar";
import "./Overview.css"
import OveralTag from "../../../components/OveralTag/OveralTag";
import Note from "../../../components/Note/Note";
import PatientList from "../../../components/PatientList/PatientList";
import PatientGridCard from "../../../components/PatientGridCard/PatientGridCard";
import PatientInfor from "../../../components/PatientInfor/PatientInfor";
import { Center } from "@chakra-ui/react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbSeparator,
  } from '@chakra-ui/react'
const Overview = () => {
    return(
        <div className="Doctor_Overview_Container" style={{backgroundColor: '#3E36B0'}}>
            <div><SideBar/></div>
            <div className="Doctor_Overview_Body" style={{backgroundColor: '#F7F5F8', margin: '0.3% 0.3% 0.3% 0', borderRadius: '40px'}}>
                <div style={{paddingTop: '20px', paddingLeft: '10px'}}>
                    <Breadcrumb>
                        <BreadcrumbItem isCurrentPage>
                            <BreadcrumbLink href='#'>Overview</BreadcrumbLink>
                        </BreadcrumbItem>
                    </Breadcrumb>
                </div>
                <div className="Doctor_Overview_Body_row" style={{}}>
                    <Center>
                        <OveralTag title = "Visit for today" value = "50"/>
                    </Center>
                    <Center>
                        <Note/>
                    </Center>
                </div>
                <div style={{}} className="Doctor_Overview_Body_row">
                    <div style={{backgroundColor: '#fff', borderRadius: '20px'}}>
                        <PatientList/>
                    </div>
                    <Center>
                        <PatientInfor/>
                    </Center>
                </div>
            </div>
        </div>
    )
};

export default Overview;