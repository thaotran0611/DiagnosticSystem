import React from "react";
import './Takenote.css';
import { useState } from "react";
import { TiPin } from "react-icons/ti";
import Submit_button from "../Button/Submit-button";
import { format } from "date-fns";
const Takenote = (props) => {
    const [message, setMessage] = useState(props.text ? props.text : '');
    const handleTakenote = event => {
        setMessage(event.target.value);
    };
    const [important, setImportant] = useState(props.important ? props.important : "non-important")
    const handleImportant = () => {
        if (important == "important") setImportant("non-important");
        else setImportant("important")
    };
    const submit = () => {
        console.log(important, message)
    }
    
    return(
        <div className="takenote">
            <h1>Take note</h1>
            <TiPin id="important" name="important" onClick={handleImportant} className={important}/>
            <p style={{display: 'inline', paddingLeft: '55%', fontSize: '14px'}}>{props.date ? props.date : format(new Date(), 'dd-MMM-yyyy hh:mm:ss a')}</p>
            <textarea id="takenote" value={message} onChange={handleTakenote} placeholder="Write your note here!" name="takenote" />
            <div className="submit-btn">
                <Submit_button text = "submit" onClick = {submit} />
            </div>
        </div>
    )
}

export default Takenote;