import React from "react";
import { AiFillLayout } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { CiLogout } from "react-icons/ci";
import { MdPeopleAlt } from "react-icons/md";

export const SidebarData = [
    {
        title: "Home",
        icon: <AiFillLayout class="icon" />,
        link: "#"
    },
    {
        title: "Patient",
        icon: <MdPeopleAlt class="icon" />,
        link: "#"
    },
    {
        title: "Visit",
        icon: <IoLocationOutline class="icon"/>,
        link: "#"
    },
    {
        title: "Logout",
        icon: <CiLogout class="icon"/>,
        link: "#"
    }

]