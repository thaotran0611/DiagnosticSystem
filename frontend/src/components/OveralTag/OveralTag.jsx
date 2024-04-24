import React from "react";
import './OveralTag.css';
import InformationTag from "../InformationTag/InformationTag";
import doctorimg from "../../img/doctor.png";
import { TagData } from "../Note/NoteData";
const OveralTag = (props) => {
    return(
        <div style={{width: '100%', height: '280px;', position: 'relative', marginTop: '40px'}}>
            <div className="linear-bg">
                <p style={{fontSize:'25px', fontWeight: '600'}}>{props.title}</p>
                <p style={{fontSize: '60px', fontWeight: '650'}}>{props.value}</p>
                {
                    // props.data ? 
                    // props.data.map(infor => (
                    props.tagData ? 
                    props.tagData.map(infor => (
                        infor.id === 1 ?
                        <div style={{ width: 'fit-content', position: 'absolute', bottom: '5%'}}>
                            <InformationTag title={infor.title} value={infor.value}/>
                        </div> 
                        : 
                        <div style={{ width: 'fit-content', position: 'absolute', bottom: '5%', left: '25%'}}>
                        <InformationTag title={infor.title} value={infor.value}/>
                    </div>
                    ))
                    :
                    TagData ?
                    TagData.map(infor => (
                        infor.id === 1 ?
                        <div style={{ width: 'fit-content', position: 'absolute', bottom: '5%'}}>
                            <InformationTag title={infor.title} value={infor.value}/>
                        </div> 
                        : 
                        <div style={{ width: 'fit-content', position: 'absolute', bottom: '5%', left: '25%'}}>
                        <InformationTag title={infor.title} value={infor.value}/>
                    </div>
                    )) : null
                }
                <div style={{position: 'absolute', right: '1%', bottom: '-9%'}}>
                    <img src={doctorimg}/>;
                </div>
            </div>
        </div>
    )
};

export default OveralTag;