import React, { useState} from "react";
import axios from 'axios';

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

const LoginPage = ({ setLoggedIn }) => {
    const navigate = useNavigate();

    // Define state variables for username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Handler function to update username state
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        console.log(username)
    };

    // Handler function to update password state
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        console.log(password)
    };
    const handleLogin = (event) =>{
        axios({
            method: 'put',
            url: 'http://localhost:8000/auth',
            data: {
              username: username,
              password: password,
            },
          })
            .then((res) => {
              console.log(res)
              const dataResponse = {
                code: res.data.user.code,
                mail: res.data.user.mail,
                name: res.data.user.name,
                username: res.data.user.username,
                role: res.data.user.role
              };
              sessionStorage.setItem('user', JSON.stringify(dataResponse));
            })
            .then(() => {
              setLoggedIn(true);
              navigate("/overview");
            })
            .catch((res) => {
              console.log(res);
              // setOpen(true);
            });    }


    return(
        <div className="bg-contain">
            <div className="login-contain">
                <div className="logo" style={{position: 'absolute', top: '5vh', width: '40%', left: '30%'}}>
                    <img onClick={()=>{navigate('../')}} style={{height: '300px', cursor: 'pointer'}} src={logo} alt="no logo" />
                </div>
                <MDBContainer style={{position: 'absolute', left: 'calc(50% - 514px/2)', top: '30vh'}} className="p-3 my-5 d-flex flex-column w-50">

                    {/* Update input fields to use state variables */}
                    <MDBInput 
                        style={{borderRadius: '10px'}} 
                        wrapperClass='mb-4' 
                        label='Username' 
                        id='form1' 
                        type='email' 
                        value={username} 
                        onChange={handleUsernameChange} 
                    />
                    <MDBInput 
                        style={{borderRadius: '10px'}} 
                        wrapperClass='mb-4' 
                        label='Password' 
                        id='form2' 
                        type='password' 
                        value={password} 
                        onChange={handlePasswordChange} 
                    />

                    <div className="d-flex justify-content-between mx-3 mb-4">
                        <MDBCheckbox name='flexCheck' value='' id='flexCheckDefault' label='Remember me' />
                        <a href="!#">Forgot password?</a>
                    </div>
                    <MDBBtn onClick={handleLogin}  style={{backgroundColor:'#3E36B0', border: 'none', borderRadius: '10px'}} className="mb-4">Log in</MDBBtn>
                    {/* <MDBBtn onClick={() => {navigate('../doctor/overview')}}  style={{backgroundColor:'#3E36B0', border: 'none', borderRadius: '10px'}} className="mb-4">Log in</MDBBtn> */}
                </MDBContainer>
            </div>
            <div style={{position: 'absolute', bottom: '0', left: '18%', height: '90vh'}}>
                <img style={{width: '58.5vh'}} src={doctor}/>
            </div>
        </div>
    )
};

export default LoginPage;
