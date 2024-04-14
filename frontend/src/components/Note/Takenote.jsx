import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Takenote.css';
import { TiPin } from "react-icons/ti";
import Submit_button from "../Button/Submit-button";
import { format } from "date-fns";
import {
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
  } from '@chakra-ui/react'
const Takenote = (props) => {
    const user_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const [message, setMessage] = useState(props.content ? props.content : '');
    const [title, setTitle] = useState(props.title ? props.title : '');

    const handleTakenote = event => {
        setMessage(event.target.value);
    };
    const [important, setImportant] = useState(props.priority == 1 ? "important" : "non-important")
    const [priority, setPriority] = useState(0)
    const [insertSuccess, setInsertSuccess] = useState(false);


    const handleImportant = () => {
        if (important === "important") {
            setImportant("non-important");
            setPriority(0);
        } else {
            setImportant("important");
            setPriority(1);
        }
    };
    
    const url = props.type == "self-note" ? 'http://localhost:8000/insert-self-note': 'http://localhost:8000/insert-patient-note';
    const submit = () => {
        const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        axios({
            method: 'post',
            url: url,
            data: {
                priority: priority,
                title: title,
                content: message,
                created_at:currentDate,
                user_code: user_code,
                subject_id: props.subject_id
            },
          })
            .then((res) => {
              console.log(res)
              setInsertSuccess(true);
            })
            .catch((res) => {
              console.log(res);
              setInsertSuccess(false);
            });
        setTimeout(() => {
            props.onSubmit();
        }, 1000);
    }
    const handleTitleChange = event => {
        setTitle(event.target.value);
    };
    
    return(
        <div className="takenote">
            <h1>Take note</h1>
            <TiPin id="important" name="important" onClick={handleImportant} className={important}/>
            <p style={{display: 'inline', paddingLeft: '55%', fontSize: '14px'}}>{props.created_at  ? props.created_at : format(new Date(), 'dd-MMM-yyyy hh:mm:ss a')}</p>
            <textarea id="title" value={title} onChange={handleTitleChange} placeholder="Enter title" name="title" />
            <textarea id="takenote" value={message} onChange={handleTakenote} placeholder="Write your note here!" name="takenote" />
            <div className="submit-btn">
                {props.new ? <Submit_button text = "Submit" onClick = {submit} />: <Submit_button text = "Change" onClick = {submit} /> }
                {/* {
                    insertSuccess && <Alert status='success'> <AlertIcon /> Insert New Note ! </Alert>
                } */}

            </div>
        </div>
    )
}

export default Takenote;