import React from "react";
import { AiFillLayout } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { MdPeopleAlt } from "react-icons/md";

export const SidebarData = [
    {
        title: "Overview",
        icon: <AiFillLayout class="icon" />,
        link: "../doctor/overview"
    },
    {
        title: "Patient",
        icon: <MdPeopleAlt class="icon" />,
        link: "../doctor/patient"
    },
    {
        title: "Setting",
        icon: <IoLocationOutline class="icon"/>,
        link: "../doctor/setting"
    },
    // {
    //     title: "Logout",
    //     icon: <CiLogout class="icon"/>,
    //     link: "#"
    // }

]