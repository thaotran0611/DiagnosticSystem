import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import { TiPin } from "react-icons/ti";
import './MiniNote.css';
import Takenote from "./Takenote";
import Popup from "reactjs-popup";

const MiniNote = (props) => {
    const handleClick = () => {
        props.onDelete(props.note_id);
    }

    const handleEdit = () => {
        props.onEdit(props.note_id)
    }

    return(
        <div className="MiniNote-contain">
            {props.priority  == 1 ? 
                <TiPin className="tipin-icon"/> :
                null
            }
            <div className="MiniNote-content" style={props.priority  == 1 ? {backgroundColor: 'rgba(246,32,32,0.1)'} : {backgroundColor: '#D9D9D9'}}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>{props.title}</p>
                <p className="content-date">{props.created_at}</p>
            </div>
                <p className="content-text" style={{ maxWidth: '80%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{props.note}</p>
                <Popup trigger={<EditIcon onClick={handleEdit}  className="edit-icon"/>}
                    nested modal contentStyle={{background: 'none', border: 'none'}}>
                    {close => <Takenote data={props.data} setNote={props.setNote} onSubmit={close} type={props.type} new={false} content={props.note} priority={props.priority} created_at={props.created_at} note_id={props.note_id} title={props.title} subject_id={props.subject_id} user_code={props.user_code}/>}
                </Popup>
                <DeleteIcon onClick={handleClick} className="delete-icon"/>
            </div>
        </div>
    )
};

export default MiniNote;