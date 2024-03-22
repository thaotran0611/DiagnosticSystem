import React from "react";
import './UserTag.css'
import user_img from "../../img/UserTag/user_img.png"
import { Icon, Image } from "@chakra-ui/react";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';

const UserTag = (props) => {
    return(
        <div className="UserTag_container" style={{position: 'relative', width: '200px', height: '50px', borderRadius: '10px', border: '1px solid rgba(17,17,17,0.2)', padding: '6px'}}>
            <div className="UserTag_img">
                <Icon color={'#716F6F'} as={props.img} boxSize={'1.8em'} />
            </div>
            <div style={{padding: '5%'}} className="UserTag_name">
                <p style={{fontSize: '1.2rem'}}>{props.name}</p>
            </div>
        </div>
    )
}

export default UserTag