import React from "react";
import './UserTag.css'
import user_img from "../../img/UserTag/user_img.png"

const UserTag = (props) => {
    return(
        <div className="UserTag_container" style={{position: 'relative', width: '200px', height: '64px', borderRadius: '10px', border: '1px solid rgba(17,17,17,0.2)', padding: '6px'}}>
            <div className="UserTag_img">
                <img src={props.img} />
            </div>
            <div style={{padding: '5%'}} className="UserTag_name">
                <p style={{fontSize: '1.4rem'}}>{props.name}</p>
            </div>
        </div>
    )
}

export default UserTag