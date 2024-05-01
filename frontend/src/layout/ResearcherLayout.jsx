import React from "react";
import './ResearcherLayout.css'
import { Grid, GridItem } from "@chakra-ui/react";

import UserTag from "../components/Usertag/UserTag";
import { Icon } from "@chakra-ui/react";
import { BellIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Sidebar from "../components/Sidebar/Sidebar";

export const ResearcherLayout = ({children, path, expand, disease, name}) => {
    const navigate = useNavigate();
    const handleLogout = () => {
        sessionStorage.removeItem('user');
        navigate('/login');
    };
    return(
        <div className="Doctor_Layout_Container" style={{backgroundColor: '#3E36B0'}}>
            <Grid
            templateAreas={disease ? `"header header"
                                      "nav main"` :
                                      `"header"
                                       "main"`}
            gridTemplateRows={'7% 93%'}
            gridTemplateColumns={ disease ? !expand ? '35% 65%': '3% 97%' : '100%'}
            h='99%'
            gap='0'
            color='blackAlpha.700'
            backgroundColor='#E7E3E9'
            margin= '0.3% 0.3% 0.3% 0.3%'
            borderRadius={'40px'}
            >
                <GridItem pl='2' area={'header'}>
                    <Grid paddingRight={'40px'} paddingTop={'8px'} paddingLeft={'40px'} templateColumns={'repeat(20, 1fr)'}>
                        <GridItem colSpan={1} colStart={1}><Sidebar role={2}/></GridItem>
                        <GridItem colSpan={6} colStart={2}>
                            {path}
                        </GridItem>
                        {/* <GridItem colStart={18} colSpan={1} marginLeft={'auto'} marginRight={6}>
                                <BellIcon cursor={'pointer'} marginTop={3} boxSize={'1.8em'} color={'#716F6F'}/>
                        </GridItem> */}
                        <GridItem colSpan={1} colStart={19}>
                            <UserTag img={AccountCircleOutlinedIcon} name={name}/>
                            <UserTag img={AccountCircleOutlinedIcon} name={name}/>
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