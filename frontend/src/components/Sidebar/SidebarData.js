import React from "react";
import { AiFillLayout } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { MdPeopleAlt } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { FaVirusCovid } from "react-icons/fa6";
import { GiMedicines } from "react-icons/gi";
import { HiDesktopComputer } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";

export const SidebarDataDoctor = [
    {
        title: "Overview",
        icon: <AiFillLayout class="icon" style={{ fontSize: "3.5rem"}} />,
        link: "../overview"
    },
    {
        title: "Patient",
        icon: <MdPeopleAlt class="icon" style={{ fontSize: "3.5rem"}} />,
        link: "../doctor/patient"
    },
    {
        title: "Setting",
        icon: <IoSettingsOutline class="icon" style={{ fontSize: "3.5rem"}} />,
        link: "../doctor/setting"
    },
]

export const SidebarDataResearcher = [
    {
        title: "Overview",
        icon: <AiFillLayout class="icon" style={{ fontSize: "3.5rem"}} />,
        link: "../overview"
    },
    {
        title: "Diseases",
        icon: <FaVirusCovid class="icon" style={{ fontSize: "3.5rem"}}/>,
        link: "../researcher/disease"
    },
    {
        title: "Medicine",
        icon: <GiMedicines class="icon" style={{ fontSize: "3.5rem"}}/>,
        link: "../researcher/medicine"
    },
    {
        title: "Setting",
        icon: <IoSettingsOutline class="icon" style={{ fontSize: "3.5rem"}} />,
        link: "../doctor/setting"
    }
]

export const SidebarDataAnalyst = [
    {
        title: "Overview",
        icon: <AiFillLayout class="icon" style={{ fontSize: "3.5rem"}} />,
        link: "../overview"
    },
    {
        title: "Model",
        icon: <HiDesktopComputer class="icon" style={{ fontSize: "3.5rem"}}/>,
        link: "../analyst/file"
    },
    {
        title: "Setting",
        icon: <IoSettingsOutline class="icon" style={{ fontSize: "3.5rem"}} />,
        link: "../analyst/setting"
    }
]

export const SidebarDataAdmin = [
    {
        title: "Overview",
        icon: <AiFillLayout class="icon" style={{ fontSize: "3.5rem"}} />,
        link: "../overview"
    },
    {
        title: "Users",
        icon: <FaUser class="icon" style={{ fontSize: "3.5rem"}}/>,
        link: "../admin/users"
    },
    {
        title: "Schedule",
        icon: <IoTimeOutline class="icon" style={{ fontSize: "3.5rem"}}/>,
        link: "../admin/schedule"
    },
    {
        title: "Setting",
        icon: <IoSettingsOutline class="icon" style={{ fontSize: "3.5rem"}} />,
        link: "../admin/setting"
    }
]