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
import {log} from '../../functions'
const Takenote = (props) => {
    const user_code = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user')).code
    : '0';
    const [message, setMessage] = useState(props.note ? props.note : '');
    const [title, setTitle] = useState(props.title ? props.title : '');

    const handleTakenote = event => {
        setMessage(event.target.value);
    };
    const [important, setImportant] = useState(props.priority == 1 ? "important" : "non-important")
    const [priority, setPriority] = useState(0)
    const [insertSuccess, setInsertSuccess] = useState(false);

    const generateRandomString = (length) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const handleImportant = () => {
        if (important === "important") {
            setImportant("non-important");
            setPriority(0);
        } else {
            setImportant("important");
            setPriority(1);
        }
    };
    const submit = () => {
        let url = 'http://localhost:8000/insert-note' ;
        const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const newNoteData = {
            note_id: generateRandomString(5),
            priority: priority,
            title: title,
            note: message,
            created_at: currentDate,
            user_code: user_code,
            // subject_id: props.subject_id
        };
        if (props.type === "self-note"){
            // url = 'http://localhost:8000/insert-self-note'
        }
        else if(props.type === "patient-note"){
            // url = 'http://localhost:8000/insert-patient-note';
            newNoteData.subject_id = props.subject_id;
        }
        else if(props.type === "user-note"){
            // url = ''
            newNoteData.admin_code = user_code;
            newNoteData.user_code = props.user_code;

        }
        else if(props.type === "disease-note"){
            newNoteData.disease_code = props.disease_code;

        }

        props.setNote([newNoteData, ...props.data]); 
        axios({
            method: 'post',
            url: url,
            data: {
                note: newNoteData,
                type: props.type
            },
          })
            .then((res) => {
              console.log(res)
              var log_data = res.data.log;
              log(log_data);
              setInsertSuccess(true);
            })
            .catch((res) => {
              console.log(res);
              setInsertSuccess(false);
            });
        setTimeout(() => {
            props.onSubmit();
        }, 500);
    }

    const change = () => {
        const currentDate = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
        const updatedNoteData = {
            note_id: props.note_id,
            priority: priority,
            title: title,
            note: message,
            created_at: currentDate,
            user_code: user_code,
        };

        let url = 'http://localhost:8000/update-note' ;
        if (props.type === "self-note"){
            // url = 'http://localhost:8000/update-self-note'
        }
        else if(props.type === "patient-note"){
            updatedNoteData.subject_id = props.subject_id;
        }
        else if(props.type === "user-note"){
            updatedNoteData.admin_code = user_code;
            updatedNoteData.user_code = props.user_code;
        }
        else if(props.type === "disease-note"){
            updatedNoteData.disease_code = props.disease_code;
        }
        
        const updatedNotes = props.data.map(note => {
            if (note.note_id === props.note_id) {
                return updatedNoteData; // Update the specific note
            } else {
                return note; // Keep other notes unchanged
            }
        });
        props.setNote(updatedNotes);
        axios({
            method: 'post',
            url: url,
            data: {
                note: updatedNoteData,
                type: props.type
            },
          })
            .then((res) => {
              console.log(res)
              var log_data = res.data.log;
              log(log_data);
              setInsertSuccess(true);
            })
            .catch((res) => {
              console.log(res);
              setInsertSuccess(false);
            });
        setTimeout(() => {
            props.onSubmit();
        }, 500);
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
            <div className="submit-btn" style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '10px' }}>
                {props.new ? <Submit_button text = "Submit" onClick = {submit} />: <Submit_button text = "Change" onClick = {change} /> }
                {/* {
                    insertSuccess && <Alert status='success'> <AlertIcon /> Insert New Note ! </Alert>
                } */}

            </div>
        </div>
    )
}

export default Takenote;