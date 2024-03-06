import React from "react";

const InformationTag = (props) => {
    return(
        <div style={{width: '168px', height: '111px'}} className="Tag-contain">
            <div style={{width: '168px', height: '95px', backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: '15px', padding: '8px'}}>
                <p style={{fontSize: '16px', fontWeight: '500', marginTop: '2px'}}>{props.title}</p>
                <p style={{fontSize: '25px', fontWeight: '700', marginTop: '6px'}}>{props.value}</p>
            </div>
        </div>
    );
};

export default InformationTag;