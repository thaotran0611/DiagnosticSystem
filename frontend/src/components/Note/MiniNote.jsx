import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from "@mui/icons-material/Edit";
import { TiPin } from "react-icons/ti";
import './MiniNote.css';
import Takenote from "./Takenote";
import Popup from "reactjs-popup";

const MiniNote = (props) => {
    const handleClick = () => {
        props.onDelete(props.id);
    }

    const handleEdit = () => {
        props.onEdit(props.id)
    }

    return(
        <div className="MiniNote-contain">
            {props.important == "important" ? 
                <TiPin className="tipin-icon"/> :
                null
            }
            <div className="MiniNote-content" style={props.important == "important" ? {backgroundColor: 'rgba(246,32,32,0.1)'} : {backgroundColor: '#D9D9D9'}}>
                <p className="content-date">{props.date}</p>
                <p className="content-text">{props.text}</p>
                <Popup trigger={<EditIcon onClick={handleEdit}  className="edit-icon"/>}
                    nested modal contentStyle={{background: 'none', border: 'none'}}>
                    <Takenote text={props.text} important={props.important} date={props.date} id={props.id}/>  
                </Popup>
                <DeleteIcon onClick={handleClick} className="delete-icon"/>
            </div>
        </div>
    )
};

export default MiniNote;