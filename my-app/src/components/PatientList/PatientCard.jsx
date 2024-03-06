import React from "react";

export default function PatientCard({patientList}){
    // const gender = patient.Gender[0]
    return (
        <div>
            {
            patientList.map(patient => (
                <div className={`patientCard ${patient.Type} ${patient.Gender}`} key={patient.SubjectID}>
                    <div className="circle"> {patient.Gender[0]} </div>            
                    <div className="name">  {patient.Name}   </div>
                    <div className="time">  {patient.AdmitTime}  </div>
                    <div className="type">  {patient.Type} </div>
                </div>
            ))
        }
        </div>
    )
};
