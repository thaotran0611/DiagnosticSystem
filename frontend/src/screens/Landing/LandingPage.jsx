import React, { useEffect, useState } from "react";
import './LandingPage.css'
import logo from '../../img/logo.png';
import Submit_button from "../../components/Button/Submit-button";
import doctor from "../../img/LandingPage/doctor1.png";
import patient from "../../img/LandingPage/patient1.png";
import icu from "../../img/LandingPage/icu1.png";
import doctor_process from "../../img/LandingPage/process_of_doctor.png";
import bg1 from "../../img/LandingPage/bg1.png"
import doctor2 from "../../img/LandingPage/doctor2.png"
import bg2 from "../../img/LandingPage/bg2.png"
import medicine_process from "../../img/LandingPage/process_of_medicine.png"
import medicine_process2 from "../../img/LandingPage/process_of_medicine2.png"
import GoogleMapReact from 'google-map-react';
import phone from "../../img/LandingPage/phone.png";
import mail from "../../img/LandingPage/mail.png";
import facebook from "../../img/LandingPage/facebook.png";
import instagram from "../../img/LandingPage/instagram.png";
import linkedin from "../../img/LandingPage/linkedin.png";
import telegram from "../../img/LandingPage/telegram.png";
import axios from 'axios';
import { Pagination, ThemeProvider, createTheme} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Scrollspy from 'react-scrollspy'


const theme = createTheme();


const LandingPage = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [data, setData] = useState([]);
    const options = {
        method: 'GET',
        url: 'https://community-healthcaregov.p.rapidapi.com/api/glossary.json',
        headers: {
            'X-RapidAPI-Key': '6a0e55ac50msh338ffb061b88fadp1a97ebjsn25f3793d2513',
            'X-RapidAPI-Host': 'community-healthcaregov.p.rapidapi.com'
        }
    };

    useEffect(() => {
        axios.request(options)
        .then(res => {
            setData(res.data['glossary']);
            setLoading(false);
        })
        .catch(error => {
            setError(error);
            setLoading(false);
        });
    }, [])

    const defaultProps = {
        center: {
          lat: 10.773383705915252,
          lng: 106.66015233336253
        },
        zoom: 16
    };
    const [page, setPage] = useState(1);
    const pageSize = 3;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const slicedData = data.slice(startIndex, endIndex);

    const handleChangePage = (event, newpage) => {
        setPage(newpage);
    };
      
    const AnyReactComponent = ({ text }) => <div style={{width: 'max-content', color: 'red', fontSize: '10pxpx'}}>{text}</div>;

    const navigate = useNavigate();
    return(
        <div style={{height: 'max-content'}}>
            <div className="LandingPage_Header">
                <img style={{height: '120px', marginLeft: '10%'}} src={logo}/>
                <nav style={{position: 'absolute', marginTop: '40px', marginLeft: '44%'}} class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <Scrollspy currentClassName="active" items={['ICU', 'ICUProcess', 'MedicineProcess', 'Contact']} style={{fontSize: '20px', fontWeight: '600', color: '#111'}} className="navbar-nav">
                            <a style={{textDecoration: 'none', color: 'black', borderRadius: '10px', margin: '0px 20px'}} href="#ICU" className="nav-link">ICU information</a>
                            <a style={{textDecoration: 'none', color: 'black', borderRadius: '10px', margin: '0px 20px'}} href="#ICUProcess" className="nav-link">ICU process</a>
                            <a style={{textDecoration: 'none', color: 'black', borderRadius: '10px', margin: '0px 20px'}} href="#MedicineProcess" className="nav-link">Medicine process</a>
                            <a style={{textDecoration: 'none', color: 'black', borderRadius: '10px', margin: '0px 20px'}} href="#Contact" className="nav-link">Contact us</a>
                            <div style={{margin: '0px 20px'}}>
                                <Submit_button onClick={()=>{navigate('../login')}} text = 'Login'/>
                            </div>
                        </Scrollspy>
                        </div>
                    </div>
                </nav>
            </div>

            <div className="LandingPage_Body">
                <div id="ICU" className="LandingPage_icu">
                    <div className="LandingPage_icu_img">
                        <img style={{position: 'absolute'}} src={doctor} alt="no img" />
                        <img style={{position: 'absolute', left: '390px'}} src={patient} alt="no img" />
                        <img style={{position: 'absolute', left: '230px', top: '200px'}}src={icu} alt="no img" />
                    </div>
                    <div style={{paddingRight: '200px', fontSize: '18px'}} className="LandingPage_icu_content">
                        <p style={{fontSize: '26px', fontWeight: '800'}}>Intensive Care Unit (ICU)</p>
                        <ul style={{fontSize: '20px', fontWeight: '500'}}>
                            <li>"Intensive Care Unit (ICU)" or "Critical Care Unit (CCU)" is a clinical department tasked with continuing the intensive treatment and care of critically ill patients from the Emergency Department and other clinical departments within the hospital.</li>
                            <li>Coordinating with the Emergency Department to participate in pre-hospital and in-hospital emergency care situations during mass casualty incidents and disasters.</li>
                            <li>Collaborating with the Emergency Department to provide specialized support for the emergency response system in other departments within the hospital.</li>
                            <li>In cases where a critically ill patient exceeds the expertise available, a consultation may be sought, higher-level support may be requested, or the patient may be transferred to another facility.</li>
                        </ul>
                        <div style={{marginTop: '20px', paddingLeft: '600px'}}>
                            <a href="https://pubmed.ncbi.nlm.nih.gov/27612678/" style={{textDecoration: 'none'}}>
                                <Submit_button text = 'Read more...'/>
                            </a>
                        </div>
                    </div>
                </div>
                <div id="ICUProcess" style={{height: '800px'}} className="LandingPage_process_doctor">
                    <div style={{padding: '200px 100px'}} className="LandingPage_process_doctor_content">
                        <img style={{width: '1000px'}} src={doctor_process} alt="no img" />
                        <div style={{marginTop: '50px', paddingLeft: '500px'}}>
                            <a href="https://benhnhietdoi.vn/UploadFiles/2018/12/20/QT.03_NKTH.pdf" style={{textDecoration: 'none'}}>    
                                <Submit_button text = 'Read more...'/>
                            </a>
                        </div>
                    </div>
                    <div className="LandingPage_process_doctor_img">
                        <img style={{position: 'absolute', right: '0'}} src={bg1} alt="no img" />
                        <img style={{position: 'absolute', right: '20px', top: '140px'}} src={doctor2} alt="no img" />
                    </div>
                </div>
                <div id="MedicineProcess" className="LandingPage_process_medicine">
                    <div className="LandingPage_process_medicine_img">
                        <img style={{position: 'absolute'}} src={bg2} alt="no img" />
                        <img style={{position: 'absolute', top: '80px', left: '20px'}} src={medicine_process} alt="no img" />
                    </div>
                    <div style={{padding: '100px 200px'}} className="LandingPage_process_medicine_content">
                        <p style={{fontSize: '26px', fontWeight: '800'}}>The process of drug discovery</p>
                        <img src={medicine_process2} alt="no img" />
                        <div style={{marginTop: '20px', paddingLeft: '500px'}}>
                            <a href="https://www.rasayanika.com/2020/08/10/what-is-clinical-pharmacology-understanding-clinical-pharmacology/" style={{textDecoration: 'none'}}>
                                <Submit_button text = 'Read more...'/>
                            </a>
                        </div>
                    </div>
                </div>
                <div style={{padding: '50px 20px', position: "relative" }} className="LandingPage_more_infor">
                    <ThemeProvider theme={theme}>
                        {
                            error ? <p>{error}</p> :
                            loading ? <p>loading...</p> :
                            slicedData.map(infor => (
                                <div style={{backgroundColor: 'rgba(62,54,176,0.2)', height: '360px', borderRadius: '10px', padding: '20px'}}>
                                    <h5>{infor['title']}</h5>
                                    <h6>{infor['date']}</h6>
                                    <div dangerouslySetInnerHTML={{__html:infor['content']}} style={{backgroundColor:"#fff", borderRadius: '10px', padding: '10px', height: '70%', overflow: 'hidden'}}>
                                    </div>
                                </div>
                            ))
                        }
                        <div className="pagination-landing-container">
                            <Pagination
                                count={Math.ceil(data.length / pageSize)}
                                page={page}
                                onChange={handleChangePage}
                                shape="rounded"
                                showFirstButton
                                showLastButton
                            >
                            </Pagination>
                        </div>
                    </ThemeProvider>
                </div>
            </div>
            <div id="Contact" className="Landingpage_Footer">
                <div style={{padding: '50px 20px', position: 'relative'}}>
                    <img src={logo} alt="no img" />
                </div>
                <div className="Landingpage_Footer_contact" style={{padding: '50px 100px'}}>
                    <div className="Landingpage_Footer_contact_parent">
                        <div className="Landingpage_Footer_contact_child" style={{color: '#fff', fontSize: '18px', borderRight: '1px solid #fff', padding: '20px 20px 0 20px',}}>
                            <div style={{marginTop: '8px'}}>
                                <img src={phone} alt="no img" />
                            </div>
                            <div>
                                <p style={{marginBottom: '0'}}>Call us: +84 794 763 040</p>
                                <p>Hotline: +84 372 767 808</p>
                            </div>
                        </div>
                        <div className="Landingpage_Footer_contact_child" style={{color: '#fff', fontSize: '18px', paddingTop: '20px', paddingLeft: '50px'}}>
                            <div style={{marginTop: '8px'}}>
                                <img src={mail} alt="no img" />
                            </div>
                            <div>
                                <p style={{marginBottom: '0'}}>anhducduonghuynh@gmail.com</p>
                                <p>duc.duong122@hcmut.edu.vn</p>
                            </div>
                        </div>
                    </div>
                    <div className="Landingpage_Footer_contact_link">
                        <a href="https://www.facebook.com/duc.duong.332345/"><img src={facebook} alt="no img" /></a>
                        <img src={instagram} alt="no img" />
                        <img src={linkedin} alt="no img" />
                        <img src={telegram} alt="no img" />
                    </div>
                </div>
                <div style={{ height: '100%', width: '100%', padding: '20px' }}>
                    <GoogleMapReact 
                        bootstrapURLKeys={{ key: "" }}
                        defaultCenter={defaultProps.center}
                        defaultZoom={defaultProps.zoom}
                    >
                    <AnyReactComponent
                        lat={10.773383705915252}
                        lng={106.66015233336253}
                        text="Đại học BK"
                    />
                    </GoogleMapReact>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;