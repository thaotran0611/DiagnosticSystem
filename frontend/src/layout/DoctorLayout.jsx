import React from "react";
import axios from 'axios';

import './DoctorLayout.css'
import { Grid, GridItem } from "@chakra-ui/react";

import UserTag from "../components/Usertag/UserTag";
import { Icon } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Sidebar from "../components/Sidebar/Sidebar";
import {log} from '../functions';
import { format } from 'date-fns'

export const DoctorLayout = ({children, path, expand, patient, name}) => {
    const user_name = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).name
    : '0';
    const navigate = useNavigate();
    const handleLogout = () => {
        const sessionToken = sessionStorage.getItem('user')
        ? JSON.parse(sessionStorage.getItem('user')).token
        : '0';
        console.log(sessionToken)
        const url = 'http://localhost:8000/auth/logout'
        sessionStorage.removeItem('user');
        axios({
            method: 'delete',
            url: url,
            data: { session_token: sessionToken },
          })
            .then((res) => {
              console.log(res)
            })
            .catch((res) => {
              console.log(res);
            });
        var log_data = {
            'user_code':  sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')).code: '0',
            'time': format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            'action': 'Logout',
            'related_item': ''
            }
        log(log_data);
        navigate('/login');
    };
    return(
        <div className="Doctor_Layout_Container" style={{backgroundColor: '#3E36B0'}}>
            <Grid
            templateAreas={patient ? `"header header"
                                      "nav main"` :
                                      `"header"
                                       "main"`}
            gridTemplateRows={'7% 93%'}
            gridTemplateColumns={ patient ? !expand ? '35% 65%': '3% 97%' : '100%'}
            h='99%'
            gap='0'
            color='blackAlpha.700'
            backgroundColor='#E7E3E9'
            margin= '0.3% 0.3% 0.3% 0.3%'
            borderRadius={'40px'}
            position={'relative'}
            >
                <GridItem pl='2' area={'header'}>
                    <Grid paddingRight={'40px'} paddingTop={'8px'} paddingLeft={'40px'} templateColumns={'repeat(20, 1fr)'}>
                        <GridItem colSpan={1} colStart={1}><Sidebar role={1}/></GridItem>
                        <GridItem colSpan={6} colStart={2}>
                            {path}
                        </GridItem>
                        {/* <GridItem colStart={17} colSpan={1} marginLeft={'auto'} marginRight={6}>
                                <BellIcon cursor={'pointer'} marginTop={3} boxSize={'1.8em'} color={'#716F6F'}/>
                        </GridItem> */}
                        <GridItem colSpan={2} colStart={18}>
                            <UserTag img={AccountCircleOutlinedIcon} name={user_name}/>
                        </GridItem>
                        <GridItem colSpan={1} colStart={20} marginLeft={'auto'} marginRight={6}>
                            <Icon onClick={handleLogout} as={LogoutOutlinedIcon} cursor={'pointer'} marginTop={2} boxSize={'1.6em'} color={'#716F6F'}/>
                        </GridItem>
                    </Grid>
                </GridItem>
                {children}
            </Grid>
        </div>
    )
};