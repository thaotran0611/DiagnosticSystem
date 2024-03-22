import React from "react";
import './LoginPage.css';
import doctor from '../../img/doctor2.png';
import logo from '../../img/logo.png';
import {
    MDBContainer,
    MDBInput,
    MDBCheckbox,
    MDBBtn,
  }
  from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const navigate = useNavigate();
    return(
        <div className="bg-contain">
            <div className="login-contain">
                <div className="logo" style={{position: 'absolute', top: '5vh', width: '40%', left: '30%'}}>
                    <img onClick={()=>{navigate('../')}} style={{height: '300px', cursor: 'pointer'}} src={logo} alt="no logo" />
                </div>
                <MDBContainer style={{position: 'absolute', left: 'calc(50% - 514px/2)', top: '30vh'}} className="p-3 my-5 d-flex flex-column w-50">

                    <MDBInput style={{borderRadius: '10px'}} wrapperClass='mb-4' label='Username' id='form1' type='email'/>
                    <MDBInput style={{borderRadius: '10px'}} wrapperClass='mb-4' label='Password' id='form2' type='password'/>

                    <div className="d-flex justify-content-between mx-3 mb-4">
                        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                        <a href="!#">Forgot password?</a>
                    </div>

                    <MDBBtn onClick={() => {navigate('../doctor/overview')}} style={{backgroundColor:'#3E36B0', border: 'none', borderRadius: '10px'}} className="mb-4">Log in</MDBBtn>
                </MDBContainer>
            </div>
            <div style={{position: 'absolute', bottom: '0', left: '18%', height: '90vh'}}>
                <img style={{width: '58.5vh'}} src={doctor}/>
            </div>
        </div>
    )
};

export default LoginPage;